//taken from https://jsfiddle.net/beentaken/9k1sf6p2/

function sqr(x) {
    return x * x
}

function dist2(v, w) {
    return sqr(v.x - w.x) + sqr(v.y - w.y)
}

function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);

  if (l2 == 0) return dist2(p, v);

  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;

  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);

  return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
}

function distToSegment(p, v, w) {
    return Math.sqrt(distToSegmentSquared(p, v, w));
}
Math.dist=function(x1,y1,x2,y2){
  if(!x2) x2=0;
  if(!y2) y2=0;
  return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}
