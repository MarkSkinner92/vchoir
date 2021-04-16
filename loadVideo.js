var videoArray = [];
function startListeningForVideos(){
  var body = document.getElementsByTagName('body')[0];
  body.addEventListener('dragenter', preventDefault, false);
  body.addEventListener('dragleave', preventDefault, false);
  body.addEventListener('dragover', preventDefault, false);
  body.addEventListener('drop', onFileDrop, false);
}
function createVideoElementFromFile(file) {
    if (file) {
      if(isVideo(file.name)){
        var url = URL.createObjectURL(file);
        var reader = new FileReader();
        var video = document.createElement('video');
        document.getElementById('videoHolder').appendChild(video);
        reader.onload = function() {
            video.src = url;
            let videoTile = new VideoTile(video);
            videoTile.setName(file.name);
            videoArray.push(videoTile);
            layers.push(new Layer(videoTile))
            video.play();
        }
        reader.readAsDataURL(file);
      }else{
        console.log('file not a video ->',getExtension(file.name));
      }
    }
}
function isVideo(filename) {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'm4v':
    case 'avi':
    case 'mpg':
    case 'mp4':
    case 'mov':
    case 'webm':
      return true;
  }
  return false;
}
function getExtension(filename) {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}
const onFileDrop = e =>{
  let dt = e.dataTransfer
  let files = dt.files
  handleFiles(files)
  preventDefault(e);
}
function handleFiles(files) {
  ([...files]).forEach(createVideoElementFromFile)
}
function preventDefault(e){
  e.preventDefault();
  e.stopPropagation();
}
