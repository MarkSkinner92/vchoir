var mainCanvas, canvas;
document.addEventListener('DOMContentLoaded', function(){
  startListeningForVideos();
  canvas = document.getElementById('canvas')
  mainCanvas = canvas.getContext('2d');
  listenForMouseEvents();
  listenForKeyEvents();
  draw();
},false);

function draw() {
  mainCanvas.clearRect(0, 0, canvas.width, canvas.height);
  if(videoArray.length > 0){
    canvas.style.cursor = "default";
    mainCanvas.lineWidth=5;
    for(let i = 0; i < videoArray.length; i++){
      if(videoArray[i]!== undefined) videoArray[i].renderToCanvas();
    }
    oldMouseDown = mouseDown;
  }else{
    mainCanvas.setLineDash([8]);
    mainCanvas.strokeStyle='#555';
    mainCanvas.fillStyle='#555';
    mainCanvas.font = "30px Poppins";
    mainCanvas.lineWidth=3;
    mainCanvas.strokeRect(canvas.width/2-200, canvas.height/2-100, 400, 200);
    mainCanvas.fillText("Drop media here", canvas.width/2-130,canvas.height/2+8);
    mainCanvas.setLineDash([]);
  }
  setTimeout(draw,20);
}

function playAll(){
  for(let i = 0; i < videoArray.length; i++){
    if(videoArray[i]!== undefined) videoArray[i].play();
  }
}
function pauseAll(){
  for(let i = 0; i < videoArray.length; i++){
    if(videoArray[i]!== undefined) videoArray[i].pause();
  }
}
