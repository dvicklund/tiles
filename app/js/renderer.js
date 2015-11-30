var Map = require('./map');

var Renderer = module.exports = function(context, width, height) {
  this.width = width;
  this.height = height;
  
  this.tileX = canvas.width / width; 
  this.tileY = canvas.height / height;
  
  this.map = new Map(width, height);
  this.map.genMap();
  this.map.genPortal();
  
  this.score = 0;
  this.highScore = 0;
  
  var fps = 60;
  this.frameCounter = 0;
  this.portalColor;

  this.draw = function() {
    this.frameCounter++;
    // Recursive call for continuous animation
    setTimeout(function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      var self = this;
      requestAnimationFrame(self.draw);

      if(this.frameCounter % 5 === 0) {
        var colorSeedR = Math.floor(Math.random() * 256);
        var colorSeedG = Math.floor(Math.random() * 256);
        var colorSeedB = Math.floor(Math.random() * 256);
        this.portalColor = 'rgba(' + colorSeedR + ', ' + colorSeedG + ', ' + colorSeedB + ', 1.0)';
        this.frameCounter = 0;
      }

      this.map.mapArray.forEach(function(row, y) {
        row.forEach(function(tile, x) {
          if(tile === 3) {
            self.drawTile("rgba(0, 0, 255, 0.9)", x, y);
          } else if(tile === 5) {
            self.drawTile("rgba(250, 255, 0, 0.9)", x, y);
          } else if(tile === 4) {
            self.drawTile(self.portalColor, x, y);
          } else if(tile === 2) {
            self.drawTile("rgba(150, 70, 70, 0.9)", x, y);
          } else if(tile === 1) {
            self.drawTile("rgba(0, 0, 0, 0.8)", x, y);
          } else {
            self.drawTile("rgba(15, 200, 35, 0.8)", x, y);
          }
        });
      });
      this.drawScore();
    }.bind(this), 1000 / fps);
  }.bind(this);

  this.drawTile = function(color, x, y) {
    context.fillStyle = color;
    context.fillRect(
      x * this.tileX, y * this.tileY,
      this.tileX, this.tileY
    );
  };

  this.drawScore = function() {
    context.fillStyle = "rgba(20, 255, 255, 0.9)";
    context.font = '2em serif';
    context.fillText('Score: ' + this.score, 20, canvas.height - 20);
  }

  this.refreshDimensions = function() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    this.tileX = canvas.width / this.width;
    this.tileY = canvas.height / this.height;
    this.draw();
  }.bind(this);

  this.moveEntity = function(x, y, dx, dy) {
    var fromVal = this.map.mapArray[y][x];
    var newVal = this.map.mapArray[y + dy][x + dx];

    if(newVal !== 5 && newVal !== 4) {
      this.map.mapArray[y + dy][x + dx] = fromVal;
      this.map.mapArray[y][x] = newVal;
    } 
  }.bind(this);
};

