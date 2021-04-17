var bars = [];
var barCanvas, sctx;
class Bar{
  constructor(){
    this.crop = [0,1,0.5,0.8];
    this.off = Array(this.crop.length).fill(0);
    this.drag = Array(this.crop.length).fill(false);
  }
  draw(){
    sctx.clearRect(0, 0, barCanvas.width, barCanvas.height);
    this.barWidth = barCanvas.width-40;
    sctx.fillStyle = '#111';
    sctx.fillRect(20,40,barCanvas.width-40,8);
    sctx.fillRect(20,100,barCanvas.width-40,8);
    sctx.fillRect(20,160,barCanvas.width-40,8);
    sctx.fillStyle = '#bc86fc';
    sctx.fillRect(this.p2s(this.crop[0]),40,this.p2s(this.crop[1]-this.crop[0])-20,8);
    sctx.fillRect(this.p2s(this.crop[2]),100,this.p2s(0.5-this.crop[2])-20,8);

    sctx.beginPath();
    sctx.arc(this.p2s(this.crop[0]), 44, 15, 0, 2 * Math.PI);
    sctx.closePath();
    sctx.fill();

    sctx.beginPath();
    sctx.arc(this.p2s(this.crop[1]), 44, 15, 0, 2 * Math.PI);
    sctx.closePath();
    sctx.fill();

    sctx.beginPath();
    sctx.arc(this.p2s(this.crop[2]), 104, 15, 0, 2 * Math.PI);
    sctx.closePath();
    sctx.fill();

    sctx.fillStyle = '#a1db5a';
    sctx.fillRect(this.p2s(this.crop[3]),160,this.p2s(-this.crop[3])-20,8);
    sctx.beginPath();
    sctx.arc(this.p2s(this.crop[3]), 164, 15, 0, 2 * Math.PI);
    sctx.closePath();
    sctx.fill();
  }
  mouseUp(a){
    for(let i = 0; i < this.drag.length; i++) this.drag[i] = false;
  }
  mouseMove(a){
    if(this.drag[0]){
      this.crop[0] = this.range(this.s2p(a.x-this.off[0]),0,1);
    }
    else if(this.drag[1]){
      this.crop[1] = this.range(this.s2p(a.x-this.off[1]),0,1);
    }
    else if(this.drag[2]){
      let v = this.range(this.s2p(a.x-this.off[2]),0,1);
      if(Math.abs(v-0.5) < 0.008) v = 0.5;
      this.crop[2] = v;
    }
    else if(this.drag[3]){
      let v = this.range(this.s2p(a.x-this.off[3]),0,1);
      if(Math.abs(v-0.8) < 0.008) v = 0.8;
      this.crop[3] = v;
    }
    let p = this.getBatchP2S();
    if(this.over(a,p[0],44) || this.over(a,p[1],44) || this.over(a,p[2],104) || this.over(a,p[3],164)) barCanvas.style.cursor = "pointer";
    else barCanvas.style.cursor = "default";
  }
  mouseDown(a){
    let p = this.getBatchP2S();
    if(this.over(a,p[0],44)){
      this.drag[0] = true;
      this.off[0] = a.x-p[0];
    }
    else if(this.over(a,p[1],44)){
      this.drag[1] = true;
      this.off[1] = a.x-p[1];
    }
    else if(this.over(a,p[2],104)){
      this.drag[2] = true;
      this.off[2] = a.x-p[2];
    }
    else if(this.over(a,p[3],164)){
      this.drag[3] = true;
      this.off[3] = a.x-p[3];
    }
  }
  over(p,v,y){
    return Math.dist(p.x,p.y,v,y) < 15;
  }
  getBatchP2S(){
    let r =[];
    this.crop.forEach((item, i) => {
      r.push(this.p2s(item));
    });
    return r;
  }
  //percent to screen
  p2s(v){
    return this.barWidth*v+20;
  }
  s2p(v){
    return (v-20)/this.barWidth;
  }
  range(v,l,r){
    return v<l?l:(v>r?r:v);
  }
}

var slider = new Bar();

function initCanvas(){
  barCanvas = document.getElementById('mainSettingsCanvas');
  sctx = barCanvas.getContext('2d');
  window.onresize = (e)=>{
    resizeBarCanvas();
  };
  barCanvas.draw = function(){
    slider.draw();
  }
  barCanvas.mouseUp = function(a){
    slider.mouseUp(a);
    barCanvas.draw();
  }
  barCanvas.mouseMove = function(a){
    slider.mouseMove(a);
    barCanvas.draw();
  }
  barCanvas.mouseDown = function(a){
    slider.mouseDown(a);
    barCanvas.draw();
  }
  barCanvas.addEventListener('mousedown',e=>{
    barCanvas.mouseDown(getMousePos(e,barCanvas));
  });
  barCanvas.addEventListener('mousemove',e=>{
    barCanvas.mouseMove(getMousePos(e,barCanvas));
  });
  window.addEventListener('mouseup',e=>{
    barCanvas.mouseUp(getMousePos(e,barCanvas));
  });
  resizeBarCanvas();
}
function resizeBarCanvas(){
  barCanvas.width = document.getElementById('settings').clientWidth;
  barCanvas.height = document.getElementById('settings').clientHeight;
  barCanvas.draw();
}
