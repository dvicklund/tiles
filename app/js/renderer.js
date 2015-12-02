var Map = require('./map');

var Renderer = module.exports = function(context, width, height) {
  // Map dimensions number of tiles
  this.width = width;
  this.height = height;
  
  // Tile dimensions by pixel
  this.tileX = canvas.width / width; 
  this.tileY = canvas.height / height;
  
  // Initialize level map
  this.map = new Map(width, height);
  this.map.genMap();
  this.map.genPortal();
  this.map.genEnemy();
  
  // Score.
  this.score = 0;
  this.highScore = 0;
  
  // Drawing variables
  // var fps = 60;
  this.frameCounter = 0;
  this.portalColor = '';
  this.enemyColor = '';
  this.enemyColorCounter = -5;

  // Drawing loop - draws the whole damn thing, like, infinity times
  this.draw = function() {
    var self = this;

    // Increment frameCounter
    this.frameCounter++;

    // v Redundant fps limiter since requestAnimationFrame is now operational
    // setTimeout(function() {
        
    context.clearRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(self.draw);

    if(this.frameCounter % 5 === 0) {
      this.enemyColorCounter++;
      var colorSeedR = Math.floor(Math.random() * 256);
      var colorSeedG = Math.floor(Math.random() * 256);
      var colorSeedB = Math.floor(Math.random() * 256);
      this.portalColor = 'rgba(' + colorSeedR + ', ' + colorSeedG + ', ' + colorSeedB + ', 1.0)';
      this.enemyColor = 'rgba(' + Math.floor(254 / (Math.abs(this.enemyColorCounter) + 1)).toString() + 
                           ', ' + Math.floor(colorSeedG/10).toString() + 
                           ', ' + Math.floor(colorSeedB/10).toString() + ', 1.0)';
      this.frameCounter = 0;
      if(this.enemyColorCounter === 5) {
        this.enemyColorCounter = -5;
      }
    }


    this.map.mapArray.forEach(function(row, y) {
      row.forEach(function(tile, x) {
        if(tile === 3) {
          self.drawTile("rgba(0, 0, 255, 0.9)", x, y);
        } else if(tile === 5) {
          self.drawTile("rgba(250, 255, 0, 0.9)", x, y);
        } else if(tile === 6) {
          self.drawTile(self.enemyColor, x, y);
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
    this.drawHiScore();
    this.drawInstructions();
    // }.bind(this), 1000 / fps);
  }.bind(this);

  this.drawTile = function(color, x, y) {
    context.fillStyle = color;
    context.fillRect(
      x * this.tileX, y * this.tileY,
      this.tileX, this.tileY
    );
  };

  this.checkHiScore = function() {
    if(this.score > this.highScore) {
      this.highScore = this.score;
    }
    return this.highScore;
  };

  this.drawScore = function() {
    context.fillStyle = "rgba(20, 255, 255, 0.9)";
    context.font = '1.5em serif';
    context.textAlign = 'left';
    context.fillText('Score: ' + this.score, 20, canvas.height - 5 );
  };

  this.drawHiScore = function() {
    context.fillStyle = "rgba(255, 255, 140, 0.9)";
    context.font = '1.5em serif';
    context.textAlign = 'right';
    context.fillText('High Score: ' + this.highScore, canvas.width - 20, canvas.height - 5);
  };

  this.drawInstructions = function() {
    context.fillStyle = "rgba(180, 180, 180, 0.6)";
    context.font = '1.2em sans-serif';
    context.textAlign = 'center';
    context.fillText('WASD to Move - R to Restart (And lose 10 points!)', canvas.width / 2, canvas.height - 5);
  };

  this.refreshDimensions = function() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    this.tileX = canvas.width / this.width;
    this.tileY = canvas.height / this.height;
    this.draw();
  }.bind(this);

  this.moveEntity = function(x, y, dx, dy) {
    var origPos = this.map.mapArray[y][x];
    var newPos = this.map.mapArray[y + dy][x + dx];

    if(newPos !== 6 && newPos !== 5 && newPos !== 4) {
      this.map.mapArray[y + dy][x + dx] = origPos;
      this.map.mapArray[y][x] = newPos;
    } 
  }.bind(this);
};

