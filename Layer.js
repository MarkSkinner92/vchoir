var layers = [];
class Layer {
  constructor(videoTile){
    this.videoTile = videoTile;
    this.videoTile.layer = this;
    this.pe = document.getElementById('layer');
    this.element = this.pe.cloneNode(true);
    this.element.id='';
    this.bk = this.element.style.background;
    this.element.style.display = 'inline-block';
    this.element.querySelector('#layer-title').innerText = videoTile.getName();
    this.element.querySelector('#layer-delete').addEventListener('click',e =>{
      this.delete();
    });
    this.element.addEventListener('click',e =>{
      this.takeFocus(!this.infocus);
    });
    this.takeFocus(true);
    document.getElementById('vidbar').appendChild(this.element);
  }
  delete(){
    this.videoTile.delete();
    this.element.remove();
    layers.splice(layers.indexOf(this),1);
  }
  takeFocus(f){
    if(f){
      for(let i = 0; i < layers.length; i++) layers[i].takeFocus(false);
      this.element.style.background = '#17523f';
    }else{
      this.element.style.background = this.bk;
    }
    this.infocus = f;
    this.videoTile.infocus = f;
  }
}
function moveSelectedLayer(v){
  let si = 0;
  layers.forEach((item, i) => {
    if(item.infocus){
      si = i;
    }
  });
  switchLayers(si,si-v);
}
function switchLayers(a,b){
  if(layers[a] && layers[b]){
    if(a > b){
      c = layers[a];
      layers[a] = layers[b];
      layers[b] = c;

      c = videoArray[videoArray.indexOf(layers[a].videoTile)];
      videoArray[videoArray.indexOf(layers[a].videoTile)] = videoArray[videoArray.indexOf(layers[b].videoTile)];
      videoArray[videoArray.indexOf(layers[b].videoTile)] = c;

      swap(layers[a].element,layers[b].element);
    }
    if(a < b){
      swap(layers[a].element,layers[b].element);
      
      c = videoArray[videoArray.indexOf(layers[a].videoTile)];
      videoArray[videoArray.indexOf(layers[a].videoTile)] = videoArray[videoArray.indexOf(layers[b].videoTile)];
      videoArray[videoArray.indexOf(layers[b].videoTile)] = c;

      c = layers[a];
      layers[a] = layers[b];
      layers[b] = c;
    }
  }
}
const swap = function(nodeA, nodeB) {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

    // Move `nodeA` to before the `nodeB`
    nodeB.parentNode.insertBefore(nodeA, nodeB);

    // Move `nodeB` to before the sibling of `nodeA`
    parentA.insertBefore(nodeB, siblingA);
};
