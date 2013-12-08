var canvas,c,w,h;

function init() {
  canvas = document.getElementById("dsotm");
  c = canvas.getContext("2d");
  w = c.canvas.width;
  h = c.canvas.height;
}

function round(amount) {
  return Math.floor(amount);
}

function responsiveX(n) {
  return round((n/800) * w)
}

function responsiveY(n) {
  return round((n/800) * h);
}

function drawTriangle(x, y, prismHeight, fillStyle) {
  c.fillStyle = fillStyle;
  c.beginPath();
  var goDown = round(prismHeight * getProportion());
  c.moveTo(x, y);
  c.lineTo(x + prismHeight, y + goDown);
  c.lineTo(x - prismHeight, y + goDown);
  c.lineTo(x, y);
  c.fill();
}

function getGreyShadowStyle(alpha) {
  return "rgba(49,73,71,"+ alpha +")";
}

function getProportion() {
  return 1.732
}

function whiteTriangleTop() {
  return responsiveY(225);
}

function whiteTriangleHeight() {
  return responsiveY(138);
}

function blackTriangleTop() {
  return responsiveY(260);
}

function blackTriangleHeight() {
  return responsiveY(110);
}

function backToCanvas() {
  return -1 * (2 * w);
}

function outOfCanvas() {
  return -1 * backToCanvas();
}

function white() {
  return "rgba(255,255,255,0.8)";
}

function drawPrism() {
  var x = w/2;
  drawTriangle(x, whiteTriangleTop(), whiteTriangleHeight(), white());
  c.save();
  drawTriangle(x, whiteTriangleTop() + responsiveY(4), whiteTriangleHeight() - responsiveY(3), getGreyShadowStyle(0.3));
  c.restore();
  c.save();
  c.shadowColor = getGreyShadowStyle(1.0);
  c.shadowBlur = responsiveX(13);
  c.shadowOffsetX = backToCanvas();
  drawTriangle(x + outOfCanvas(), blackTriangleTop() - responsiveY(15), blackTriangleHeight() + responsiveY(12),"blue");
  c.restore();
  c.shadowColor = "rgba(0,0,0,0.8)";
  c.shadowBlur = responsiveY(10);
  c.shadowOffsetX = backToCanvas();
  drawTriangle(x + outOfCanvas(), blackTriangleTop(), blackTriangleHeight(),"black");
}

function drawWhiteRay() {
  c.save();
  c.lineWidth = responsiveY(3.2);
  c.strokeStyle = "rgba(255,255,255,0.8)";
  c.beginPath();
  c.moveTo(0, responsiveY(425));
  c.lineTo(responsiveX(338), responsiveY(335));
  c.stroke();
  c.restore();
}

function drawRefractionInsidePrism() {
  c.save();
  var gradient = c.createLinearGradient(responsiveX(333), responsiveY(335), responsiveX(468), responsiveY(335));
  gradient.addColorStop(0, white());
  gradient.addColorStop(1, getGreyShadowStyle(0.1));
  c.fillStyle = gradient;
  c.beginPath();
  c.moveTo(responsiveX(333), responsiveY(335));
  c.lineTo(responsiveX(448), responsiveY(310));
  c.lineTo(responsiveX(476), responsiveY(362));
  c.lineTo(responsiveX(338), responsiveY(339));
  c.lineTo(responsiveX(333), responsiveY(335));
  c.fill();
  c.restore();
}

function drawFilledPolygon(pointArray, fillStyle) {
  c.save();
  c.fillStyle = fillStyle;
  c.beginPath();
  c.moveTo(pointArray[0]["x"], pointArray[0]["y"]);
  for (var i = 1; i < pointArray.length; i++) {
      c.lineTo(pointArray[i].x, pointArray[i].y);
  }
  c.lineTo(pointArray[0].x, pointArray[0].y);
  c.fill();
  c.restore();
}

function drawRainbow() {
  var rainbowStartLeft = responsiveX(448);
  var rainbowStartTop = responsiveY(310);
  var rainbowStopTop = responsiveY(360);
  var stopInc = responsiveY(13.5);
  var startInc = responsiveX(5);
  var rainbowColoredRayOverlapAmount = responsiveY(0.5);
  var rainbow = {"red"   : "rgba(255,47 ,65 , 0.8)",
                 "orange": "rgba(245,186,68 , 0.8)",
                 "yellow": "rgba(254,254,84 , 0.8)",
                 "green" : "rgba(113,197,71 , 0.8)",
                 "blue"  : "rgba(57, 168,245, 0.8)",
                 "purple": "rgba(157,122,204, 0.8)"
                };
  var rainbowMap = {};
  rainbowMap[0] = "red";
  rainbowMap[1] = "orange";
  rainbowMap[2] = "yellow";
  rainbowMap[3] = "green";
  rainbowMap[4] = "blue";
  rainbowMap[5] = "purple";
  c.save();
  for (var i = 0; i < 6; i++) {

      var point1 = {"x" : rainbowStartLeft + startInc * i, "y" : rainbowStartTop + startInc * i * getProportion()};
      var point2 = {"x" : w, "y" : rainbowStopTop + stopInc * i};
      var point3 = {"x" : w, "y" : rainbowStopTop + stopInc + stopInc * i + rainbowColoredRayOverlapAmount};
      var point4 = {"x" : rainbowStartLeft + startInc + startInc * i, "y" : rainbowStartTop + startInc * getProportion() + startInc * i * getProportion() + rainbowColoredRayOverlapAmount};

      var pointArray = new Array();
      pointArray[0] = point1;
      pointArray[1] = point2;
      pointArray[2] = point3;
      pointArray[3] = point4;

      drawFilledPolygon(pointArray, rainbow[rainbowMap[i]]);

    }
    c.restore();
}

function generateNoise(opacity) {
  var opacity = opacity || .2;

  canvas.width = w;
  canvas.height = h;

  for ( x = 0; x < canvas.width; x+= responsiveX(4)) {
    for ( y = 0; y < canvas.height; y+= responsiveY(4)) {
       number = Math.floor( Math.random() * 60 );

       c.save();
       c.fillStyle = "rgba(" + number + "," + number + "," + number + "," + opacity + ")";
       c.shadowColor="rgba(" + number + "," + number + "," + number + "," + opacity + ")";
       c.shadowBlur=2;
       c.fillRect(x, y, responsiveX(2), responsiveY(2));
       c.restore();
    }
  }
}

function dsotm() {
  init();
  generateNoise(0.7);
  drawRainbow();
  drawPrism();
  drawWhiteRay();
  drawRefractionInsidePrism();
}
