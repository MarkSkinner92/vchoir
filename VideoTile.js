var keys = [];
class VideoTile {
  constructor(_video) {
    this.video = _video;
    this.clipPolygon = [new Thumb(0,0),new Thumb(200,0),new Thumb(200,200),new Thumb(0,200),new Thumb(0,100)];
    this.infocus = true;
    this.dragingInPolygon = false;
    this.imageOffset = {x:0,y:0};
    this.pos = {x:0,y:0,w:0,h:0};
    this.file = {name:'unnamed'};
    this.layer;
    console.log(this.video);
    this.scaleFactor = 1;
    this.video.addEventListener('loadeddata', (event) => {
      this.videoIsReady();
    });
  }
  videoIsReady(){
    this.pos = {x:0,y:0,w:this.video.videoWidth,h:this.video.videoHeight};
  }
  renderToCanvas(){
    mainCanvas.beginPath();
    mainCanvas.moveTo(this.clipPolygon[0].x,this.clipPolygon[0].y);
    for(let i = 1; i < this.clipPolygon.length; i++){
      mainCanvas.lineTo(this.clipPolygon[i].x,this.clipPolygon[i].y);
    }
    mainCanvas.closePath();
    mainCanvas.save();
    mainCanvas.clip();
    // console.log(pos);
    mainCanvas.drawImage(this.video,this.pos.x,this.pos.y,this.pos.w,this.pos.h);
    mainCanvas.restore();
    // mainCanvas.stroke();

    if(this.infocus){
      for(let i = 0; i < this.clipPolygon.length; i++){
        this.clipPolygon[i].renderToCanvas();
      }

      if(mouseDown && mouseDown != oldMouseDown) {
        this.dragingInPolygon = this.mouseInside() && !this.thumbInUse();

        if(this.dragingInPolygon){
          this.imageOffset.x = mouseX-this.pos.x;
          this.imageOffset.y = mouseY-this.pos.y;
          for(let i = 0; i < this.clipPolygon.length; i++){//also set the offsets for the thumbs
            this.clipPolygon[i].setOffset();
          }
        }
      }
      if(!mouseDown && mouseDown != oldMouseDown) {
        this.dragingInPolygon = false;
      }
      if(this.dragingInPolygon){
        if(keys['Shift']){
          this.pos.x = mouseX - this.imageOffset.x;
          this.pos.y = mouseY - this.imageOffset.y;
          for(let i = 0; i < this.clipPolygon.length; i++){
            this.clipPolygon[i].setPosition();
          }
        }
        else{
          this.pos.x = mouseX - this.imageOffset.x;
          this.pos.y = mouseY - this.imageOffset.y;
        }
      }
    }
  }
  thumbInUse(){
    for(let i = 0; i < this.clipPolygon.length; i++){
      if(this.clipPolygon[i].isDragging) return true;
    }
    return false;
  }
  takeFocus(value){
    if(this.layer) this.layer.takeFocus(value);
  }
  mouseInside(){
    return insidePolygon(mouseX,mouseY,this.clipPolygon);
  }
  mouseOver(){
    let overThumb = false;
    this.clipPolygon.forEach(item => {
      overThumb |= item.mouseOver();
    });
    return this.mouseInside() || overThumb;
  }
  getName(){
    return this.file.name;
  }
  delete(){
    this.video.remove();
    videoArray.splice(videoArray.indexOf(this),1);
  }
  setName(name){
    this.file.name = name;
  }
  play(){
    this.video.play();
  }
  pause(){
    this.video.pause();
  }
  scroll(y){
    if(this.mouseInside() && this.infocus){
      if(y > 0 && this.pos.w > 30)
        this.calculatePosition(y/-200);
      else if(y < 0 && this.pos.w < 10000)
        this.calculatePosition(y/-200);
    }
  }
  calculatePosition(factor){
    // Zoom into the image.
    factor += 1;
    let original = {x:this.pos.x,y:this.pos.y,w:this.pos.w,h:this.pos.h};

    this.pos.w = (this.pos.w * factor);
    this.pos.h = (this.pos.h * factor);

    this.pos.x -= (this.pos.w - original.w)* ((mouseX - original.x)/original.w);
    this.pos.y -= (this.pos.h - original.h)* ((mouseY - original.y)/original.h);
  }
}
function insidePolygon(x,y, vs) {
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].x, yi = vs[i].y;
        var xj = vs[j].x, yj = vs[j].y;
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};


var mouseX,mouseY,mouseDown,oldMouseDown;
class Thumb {
  constructor(x,y,parent){
    this.x = x;
    this.y = y;
    this.ofx = x;
    this.ofy = y;
    this.isDragging = false;
    this.parent = parent;
  }
  renderToCanvas(){
    mainCanvas.beginPath();
    mainCanvas.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    mainCanvas.closePath();
    mainCanvas.fillStyle='#bc86fc';
    mainCanvas.fill();
    if(this.mouseOver()){
      canvas.style.cursor = "pointer";
      if(oldMouseDown != mouseDown && mouseDown && !this.isDragging){
        this.setOffset();
        this.isDragging = true;
      }
    }
    if(this.isDragging){
      canvas.style.cursor = "pointer";
      this.setPosition();
    }
    if(oldMouseDown != mouseDown && !mouseDown){
      this.isDragging = false;
    }
  }
  mouseOver(){
    return Math.dist(mouseX,mouseY,this.x,this.y) < 10;
  }
  setOffset(){
    this.ofx = mouseX-this.x;
    this.ofy = mouseY-this.y;
  }
  setPosition(){
    this.x = snap(mouseX - this.ofx,0,canvas.width);
    this.y = snap(mouseY - this.ofy,0,canvas.height);
  }
}
function snap(v,l,h){
  if(v < l + 20) v = l;
  if(v > h - 20) v = h;
  return v;
}
function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}
function listenForMouseEvents(){
  canvas.addEventListener('mousemove',e=>{
    let c = getMousePos(e);
    mouseX = c.x;
    mouseY = c.y;
  });
  window.addEventListener('mousemove',e=>{
    let c = getMousePos(e);
    window.mouseX = c.x;
    window.mouseY = c.y;
  });
  canvas.addEventListener('mousedown',e=>{
    focusWithMouse();
    let c = getMousePos(e);
    mouseX = c.x;
    mouseY = c.y;
    mouseDown = true;
  });
  canvas.addEventListener('mouseup',e=>{
    let c = getMousePos(e);
    mouseX = c.x;
    mouseY = c.y;
    mouseDown = false;
  });
  canvas.addEventListener('wheel',function(e){
    for(let i = 0; i < videoArray.length; i++){
      videoArray[i].scroll(e.deltaY);
    }
  });
}
function focusWithMouse(){
  let inpoly = false;
  videoArray.forEach(item => {
    if(item.mouseOver()){
      item.takeFocus(true);
      inpoly = true;
    }
  });
  if(!inpoly) videoArray.forEach(item => {item.takeFocus(false)});
}
function listenForKeyEvents(){
  window.addEventListener('keydown',e=>{
    keys[e.key] = true;
    switch(e.key){
      case 'ArrowUp':
        moveSelectedLayer(1);
      break;
      case 'ArrowDown':
        moveSelectedLayer(-1);
      break;
    }
  });
  window.addEventListener('keyup',e=>{
    keys[e.key] = false;
  });
}
Math.dist=function(x1,y1,x2,y2){
  if(!x2) x2=0;
  if(!y2) y2=0;
  return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}
