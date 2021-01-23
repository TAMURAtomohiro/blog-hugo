var width = 600;
var height = 320;                  // canvas size in pixels
var cells = 100;                   // number of grid cells
var xyrange = 30.0;                // axis ranges (-xyrange..+xyrange)
var xyscale = width / 2 / xyrange; // pixels per x or y unit
var zscale = height * 0.4;         // pixels per z unit
var angle = Math.PI / 6;           // angle of x, y axes (=30°)
var sin30 = Math.sin(angle);
var cos30 = Math.cos(angle); // sin(30°), cos(30°)
var bucketSize = 1000;

window.onload = function() {
  var canvas = new fabric.Canvas('canvas-surface');
  canvas.width = width;
  canvas.height = height;
  var polygons = [];
  for (var i = 0; i < cells; i++) {
    for (var j = 0; j < cells; j++) {
      var pa = corner(i + 1, j)
      var pb = corner(i, j)
      var pc = corner(i, j + 1)
      var pd = corner(i + 1, j + 1)
      var z = (pb.z + pd.z) / 2

      var polygon = new fabric.Polygon([pa, pb, pc, pd]);
      polygon.strokeWidth = 0.3;
      polygon.stroke = '#000000';
      polygon.fill = '#ffffff';
      polygons.push(polygon);
      if (polygons.length > bucketSize) {
        render(canvas, polygons);
        polygons = [];
      }
    }
  }
  render(canvas, polygons);
};

function render(canvas, polygons) {
  if (polygons.length === 0) { return; }
  var t0 = new Date();
  canvas.add.apply(canvas,polygons);
  console.log(new Date() - t0);
}

function corner(i, j) {
  var x = xyrange * (i / cells - 0.5);
  var y = xyrange * (j / cells - 0.5);

  var z = f(x, y)

  // Project (x,y,z) isometrically onto 2-D SVG canvas (sx,sy).
  var sx = width / 2 + (x - y) * cos30 * xyscale
  var sy = height / 2 + (x + y) * sin30 * xyscale - z * zscale
  return {x: sx, y: sy, z: z * zscale};
}

function f(x, y) {
  var r = Math.hypot(x, y); // distance from (0,0)
  return Math.sin(r) / r;
}
