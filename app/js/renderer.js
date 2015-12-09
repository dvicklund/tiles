var Map = require('./map');

var Renderer = module.exports = function(context, width, height) {
  // Map dimensions number of tiles
  this.width = width;
  this.height = height;

  // Tile dimensions by pixel
  this.tileX = canvas.width / width; 
  this.tileY = canvas.height / height;
  
  // Screen ratio
  this.screenRatio = canvas.width / canvas.height;

  // Initialize level map
  this.map = new Map(width, height);
  this.map.init();
  
  // Score.
  this.score = 0;
  this.highScore = 0;
  this.lives = 5;
  
  // Drawing variables
  // var fps = 60;
  this.frameCounter = 0;
  this.pointColor = '';
  this.portalColor = '';
  this.enemyColor = '';
  this.enemyColorCounter = -5;

  // Drawing loop - draws the whole damn thing, like, infinity times
  this.draw = function() {
    var self = this;

    if(this.lives > 0) {
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
        this.pointColor = 'rgba('+ colorSeedR + ', ' + colorSeedR + ', 0, 1.0)';
        this.portalColor = 'rgba(' + colorSeedR + ', ' + colorSeedG + ', ' + colorSeedB + ', 1.0)';
        this.enemyColor = 'rgba(' + Math.floor(254 / (Math.abs(this.enemyColorCounter) + 1)).toString() + ', 0, 0,  1.0)';
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
          } else if(Array.isArray(tile)) {
            self.drawTile("rgba(15, 200, 35, 0.8)", x, y);
            self.drawSmallTile(self.pointColor, x, y);
          } else {
            self.drawTile("rgba(15, 200, 35, 0.8)", x, y);
          }
        });
      });

      this.drawLevel();
      this.drawLives();
      this.drawScore();
      this.drawHiScore();
      this.drawInstructions();
      // }.bind(this), 1000 / fps);
    } else {
      this.gameOver();
    }
  }.bind(this);

  this.drawTile = function(color, x, y) {
    context.fillStyle = color;
    context.fillRect(
      x * this.tileX, y * this.tileY,
      this.tileX, this.tileY
    );
  };

  this.drawSmallTile = function(color, x, y) {
    context.fillStyle = color;
    context.fillRect(
      (x + 0.4) * this.tileX, (y + 0.4) * this.tileY,
      this.tileX/5, this.tileY/5
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
    context.fillStyle = "rgba(180, 180, 180, 0.7)";
    context.font = '1.2em sans-serif';
    context.textAlign = 'center';
    context.fillText('WASD to Move - R to Restart (Lose a Life)', canvas.width / 2, canvas.height - 5);
  };

  this.drawLevel = function() {
    var currLevelHexRed = Math.floor(Math.min(this.map.level, 64) / 4).toString(16);
    var currLevelHexGreen = Math.floor((64 - Math.min(this.map.level, 64)) / 4).toString(16);
    context.fillStyle = "#" + currLevelHexRed + currLevelHexGreen + "0";
    context.font = '1.5em serif';
    context.textAlign = 'center';
    context.fillText('Level ' + this.map.level, canvas.width / 2, 22);
  }.bind(this);

  this.drawLives = function() {
    for(var i = 0; i < this.lives; i++) {
      this.drawTile('blue', i * 2 + 1, 0);
    }
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

    if(!Array.isArray(newPos) && newPos !== 6 && newPos !== 5 && newPos !== 4) {
      this.map.mapArray[y + dy][x + dx] = origPos;
      this.map.mapArray[y][x] = newPos;
    } else if(Array.isArray(newPos)) {
      this.map.mapArray[y + dy][x + dx] = origPos;
      this.map.mapArray[y][x] = 0;
      this.score += 1;
      this.checkHiScore();
    }
  }.bind(this);

  this.gameOver = function() {
    context.fillStyle = "rgba(180, 180, 180, 0.8)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = "blue";
    context.font = "3em serif";
    context.textAlign = 'center';
    context.fillText('You are dead,\npoor blue dot.', canvas.width/2, canvas.height/2);
    context.font = '1.5em serif';
    context.fillText('Press R to Restart', canvas.width/2, canvas.height/2 + 30);

    this.keyPress = function(e) {
      var keyCode = String.fromCharCode(e.keyCode);
      if (keyCode === "r") {
        this.map.renew();
        this.score = 0;
        this.xPos = 1;
        this.yPos = 1;
        this.lives += 5;
        window.removeEventListener('keypress', this.keyPress, false);
        this.draw();
      }
    }.bind(this);
  
    window.addEventListener('keypress', this.keyPress, false);
  };
};

