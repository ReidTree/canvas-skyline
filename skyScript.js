var canvas = document.getElementById('canvas');

//canvas to full width of window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// context
var c = canvas.getContext('2d');

var mouse = {
  x: undefined,
  y: undefined
}

var maxRadius = 9;
var minRadius = 2;
var pi = Math.PI * 2;

//mouse interactive listener
window.addEventListener('mousemove', function(event){
  mouse.x = event.x
  mouse.y = event.y
})

//resize window listener
window.addEventListener('resize', function(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
})
var scroll_position = 0;
var ticking = false;


var img = new Image();
function Sky(s0,s,s1,s2,s3,des,x,y,dx,dy,radius){
  var sM = s * 2.3;
  this.s0 = s0;
  this.s = s;
  this.s1 = s1;
  this.s2 = s2;
  this.s3 = s3;
  this.sM = sM;
  this.des = des;
  this.moon = 400;
  this.sConst = s
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.minRadius = radius;
  this.x0 = x - radius;
  this.y0 = y - radius;
  this.x1 = x + radius;
  this.r2 = 2 * radius;
  this.sunX = innerWidth/10;
  this.sunR = 50;
  this.sunMinR = 50;
  this.sunMaxR = 100;

  this.draw = function(){
    if (this.des === "star"){
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, pi, false);
      var my_gradient = c.createRadialGradient(this.x,
        this.y, this.radius , this.x, this.y, 0)
      my_gradient.addColorStop(0, "rgba(0,0,0,0)");
      my_gradient.addColorStop(1, "white");
      c.fillStyle = my_gradient;
      c.fill();

    } else if(this.des === "sunrise"){
      var gradient = c.createLinearGradient(this.s1,this.s1,this.s1,this.s0);
      gradient.addColorStop(0,"skyblue");
      gradient.addColorStop(1,"rgba(0,0,0,0)");
      c.fillStyle = gradient;
      c.fillRect(0,this.s0,innerWidth,this.sConst+1);

    } else if(this.des === "sunset"){
      var gradient = c.createLinearGradient(this.s3,this.s3,this.s3,this.s2);
      gradient.addColorStop(0,"skyblue");
      gradient.addColorStop(1,"rgba(0,0,0,.21)");
      c.fillStyle = gradient;
      c.fillRect(0,this.s,innerWidth,this.sConst);

    } else if (this.des === "moon"){
      img.src = "images/moon.png";
      c.drawImage(img, innerWidth - (innerWidth*.2),this.sM,100,100);

    } else if (this.des === "sun"){
      c.beginPath();
      c.arc(this.sunX, this.s, this.sunR, 0, pi, false);
      var my_gradient = c.createRadialGradient(this.sunX,
        this.s, this.sunR , this.sunX, this.s, 0)
      my_gradient.addColorStop(0, "rgba(255,255,255,0.1)");
      my_gradient.addColorStop(1, "yellow");
      c.fillStyle = my_gradient;
      c.fill();
    }
  }

  this.update = function(){
    // top sky line gradient movement
    if ( this.des === "sunrise"){
      if(this.s0 + this.sConst < 0){
        this.s0 = innerHeight - s;
        this.s1 = innerHeight - s1;
      }

      // bottom sky line gradient movement
    } else if (this.des === "sunset") {
      if(this.s + this.sConst < 0){
        this.s = innerHeight - s;
        this.s2 = innerHeight;
        this.s3 = innerHeight - s1;
      }

      // interactive moon
    } else if (this.des === "moon") {
      if(this.sM + 100 < 0){
        this.sM = innerHeight - 100;
      }
      this.sM -= speed

      // interactive stars
    } else if (this.des === "star"){
      if (this.y - this.radius > innerHeight || this.y + this.radius < 0) {
        this.y = innerHeight
      }
      this.y += this.dy;

      if (mouse.x - this.x < 25 && mouse.x - this.x > -25 && mouse.y - this.y < 25
        && mouse.y - this.y > - 25 ) {
          if (this.radius < maxRadius){
            this.radius += 4;
          }
      } else if (this.radius > this.minRadius) {
        this.radius -= 1;
      }
    }

    //sun interactive response
    if(this.des === "sun"){
      if (this.s + 50 < 0){
        this.s = innerHeight - 50;
      }
      if (mouse.x - this.sunX < 50 && mouse.x - this.sunX > -50 && mouse.y - this.s < 50
        && mouse.y - this.s > - 50 ) {
          if (this.sunR < this.sunMaxR){
            this.sunR += 4;
          }
      } else if (this.sunR > this.sunMinR) {
        this.sunR -= 1;
      }
    }

    if (this.des === "sunset" || this.des === "sunrise" || this.des === "sun") {
      this.s -= speed;
      this.s0 -= speed;
      this.s1 -= speed;
      this.s2 -= speed;
      this.s3 -= speed;
    }
    this.draw();
  }
}

var skyArrray = [];
var item = ["moon","sunrise","sunset","sun"]
var speed = document.getElementById('speed').value;
var items = [];

for (var i = 0; i < (innerWidth/10); i++){
  items.push("star");
}

item.forEach(function(e){
  items.push(e);
})

//initial canvas layout
function init() {
  skyArray = []
  c.fillRect(0,0, innerWidth, innerHeight);
  for (var i = 0; i < items.length; i++){
    var s0 = 0;
    var s = innerHeight/3
    var s1 = s/2;
    var s2 = s*2;
    var s3 = s2-s1;
    var des = items[i];
    var radius = Math.random() * 5 + 1;
    var x = Math.random() * (innerWidth - radius * 2) + radius;
    var y = Math.random() * (innerHeight - radius * 2) + radius;
    var dx = (Math.random() + 0.5) * 2;
    var dy = (Math.random() - 1) * .3;
    skyArray.push(new Sky(s0,s,s1,s2,s3,des,x,y,dx,dy,radius));
  }
}

//iterating animation function
function animate(){
  requestAnimationFrame(animate);
  c.clearRect(0,0, innerWidth, innerHeight);
  for (var i = 0; i < skyArray.length; i++){
    skyArray[i].update();
  }
}

init();
animate();

var hide = document.getElementById('hide');
var description = document.getElementById('block');
var show = document.getElementById('show');
var display = true;

var descriptionHandler = function(){
  description.style.display = (display === true) ? "none" : "initial";
  show.innerHTML = (display === true) ? "SHOW DESCRIPTION" : "HIDE DESCRIPTION";
  show.style.color = (display === true) ? "white" : "black";
  display = (display === true) ? false : true;
};

show.addEventListener('click', function(e){
  descriptionHandler();
});

document.getElementById('speed').addEventListener("change", function(){
  speed = document.getElementById('speed').value;
})
