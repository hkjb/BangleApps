// assets
function getImg() {
  return require("heatshrink").decompress(atob("2FRgP/ABnxBRP5BJH+gEfBZHghnAv4JFmA+Bj0PBIn3//4h3An4oDAQJWEEIf8AwMEuFOCofAh/QjAWEg4VEwEAnw2DDoKEHEYPwAoUBmgrDhgUHS4XgAwUD/gVC/g+FAAZgEwEf4YqC/EQFQ4NDFgV/4Z3C/EcCo1974VCLAV/V4d7Co9/Co0PCoX+vk4Ko/HCosCRYX5nwTFkEAr/nCokICoL+B/aCGCoMHCoq3EdoraGCosPz4HBcILEJCocBwEHOwQrIgQrHgoHCFYMEgwVJYoMBsEnCofAnkMNQJXH4D4EbQMPkF/xwrEj+/HIkAoAVDj8QueHCoorDCoUDLwd96J0BKwgrHh4VDv+9CosDx6QCCo4HB//8VwvvXgQVDJIYSBCo/sBwaZBgF/NoYVHgH8V4qYDAwUYlAVFEYbFDDgwAGConogf9Zg8DCpP4cIh0Dg0BGAgVE+gVIgUA+AVI+wVE/xAEh5HDEgn+CpEAbgJCCHQoVBn4VJ/ED4ANDAAQVJ4EPPQPAt4VF4BeDColgj/8h/gFYwJBCpF//k//ANDCAYVIcgP+CpH/54VHCAIVB/4VIwYECCocIAwIVBx4VG9+AMITbCYAYJB34VG/UAj4VI7/9Cgw9CJYXAmBtDMAQsIfYhvCCofyvywGB4QFFgYGC/d+agYVLSgf8+ArG/APBD4QVBgh0CAwNwv/fCo4PCCo94s7VDCohnDAoI7Enlv8BZECoRCDAggAB3/3/gzDMAIVFY4IVE4IPBOoZ9DCpXwCoMvCqKxB//3bYywD4BtFAAPfDooVFFYIVGw4VFB4KZFngNE/uPCovgFYgEBuK+Fg4zFCoIrFCovwgQVF+AVFgPxEYzFEbgQVD4EDCoozBYogVCgYVE8bpGCo4HDCoPzBgoVIL4fAg4MGgAIHCofgCszND8BOHK4x2BCofwXgv4h6vGCps/Co6uDAA/7RgIjDDwTaDABPA//9FaAtDCop0FC5YVDLwoAH8//94GD/wVNCYKNECpwPBQggVPNggVBNp4VFFZwAGCquHCqnzCB4"));
}
//var IMAGEWIDTH = 176;
var IMAGEHEIGHT = 81;

Bangle.on('touch',(touchside, touchdata)=>{
  if (touchside == 1) {
    Bangle.buzz(30);
  }
});

function showWelcomeMessage() {
  g.reset().clearRect(0, 76, 44+44, g.getHeight()/2+6);
  g.setFontAlign(0, 0).setFont("6x8");
  g.drawString("world world world world", 44, 80);
  g.drawString("world world world world", 44, 88);
}

// time
var offsets = require("Storage").readJSON("a_clock_timer.settings.json") || [ ["PAR",1], ["TYO",9] ];
var drawTimeout;

function getGmt() {
  var d = new Date();
  var gmt = new Date(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
  return gmt;
}

function getTimeFromTimezone(offset) {
  return new Date(getGmt().getTime() + offset * 60 * 60 * 1000);
}

function queueNextDraw() {
  if (drawTimeout) clearTimeout(drawTimeout);
  drawTimeout = setTimeout(function() {
    drawTimeout = undefined;
    draw();
  }, 60000 - (Date.now() % 60000));
}

function draw() {
  g.reset().clearRect(0,24,g.getWidth(),g.getHeight()-IMAGEHEIGHT);
  g.drawImage(getImg(),0,g.getHeight()-IMAGEHEIGHT);

  var gmtHours = getGmt().getHours();

  var x_sun = 176 - (gmtHours / 24 * 176 + 4);
  g.setColor('#ff0').drawLine(x_sun, g.getHeight()-IMAGEHEIGHT, x_sun, g.getHeight());
  g.reset();

  var x_night_start = (176 - (((gmtHours-6)%24) / 24 * 176 + 4)) % 176;
  var x_night_end = 176 - (((gmtHours+6)%24) / 24 * 176 + 4);
  g.setColor('#000');
  for (let x = x_night_start; x < (x_night_end < x_night_start ? 176 : x_night_end); x+=2) {
    g.drawLine(x, g.getHeight()-IMAGEHEIGHT, x, g.getHeight());
  }
  if (x_night_end < x_night_start) {
    for (let x = 0; x < x_night_end; x+=2) {
      g.drawLine(x, g.getHeight()-IMAGEHEIGHT, x, g.getHeight());
    }
  }

  var locale = require("locale");

  var date = new Date();
  g.setColor('#fff');
  g.setFontAlign(0,0);
  g.setFont("Vector",36).drawString(locale.time(date,1), g.getWidth()/2, 46);
  g.setFont("6x8");
  g.drawString(locale.date(new Date(),1), 125, 68);
  g.drawString(offsets[0][0]+" "+locale.time(getTimeFromTimezone(offsets[0][1]),1), 125, 80);
  g.drawString(offsets[1][0]+" "+locale.time(getTimeFromTimezone(offsets[1][1]),1), 125, 88);

  queueNextDraw();
}

// init
g.setTheme({bg:"#000",fg:"#fff",dark:true}).clear();
draw();
Bangle.setUI("clock");
Bangle.loadWidgets();
Bangle.drawWidgets();
showWelcomeMessage();
