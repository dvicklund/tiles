/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// Grab canvas element from HTML, then grab its context.
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	// Set width and height of the canvas element to fill the viewport
	var windowWidth = canvas.width = document.defaultView.innerWidth;
	var windowHeight = canvas.height = document.defaultView.innerHeight;

	// Grab renderer and entity modules
	var Renderer = __webpack_require__(1);
	var Entity = __webpack_require__(3);

	// Set up the renderer and player
	var Render = new Renderer(context, Math.round(windowWidth/25), Math.round(windowHeight/25));
	var Player = new Entity(Render, true);

	// Add window listeners for resizing canvas dimensions and player controls
	window.addEventListener('resize', Render.refreshDimensions, false);
	window.addEventListener('keypress', Player.keyPressed, false);

	// Initialize infinite drawing loop
	Render.draw();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Map = __webpack_require__(2);

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
	  this.lives = 3;
	  
	  // Drawing variables
	  // var fps = 60;
	  this.frameCounter = 0;
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
	      console.log(i * this.tileX);
	      this.drawTile('blue', i * 2 + 1, 0);
	    }
	    // context.fillStyle = '#fff';
	    // context.font = '1.2em serif';
	    // context.textAlign = 'left';
	    // context.fillText('Lives: ' + this.lives, 20, 22);
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

	  this.gameOver = function() {
	    context.fillStyle = "rgba(180, 180, 180, 0.6)";
	    context.fillRect(0, 0, canvas.width, canvas.height);
	    
	    context.fillStyle = "blue";
	    context.font = "3em serif";
	    context.textAlign = 'center';
	    context.fillText('You are dead,\npoor blue dot.', canvas.width/2, canvas.height/2);
	  };
	};



/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Entity = __webpack_require__(3);

	var Map = module.exports = function(cellsX, cellsY) {
	  // 2-Dimensional array (after generation) where the map is stored
	  this.mapArray = [];

	  this.enemyArray = [];

	  // Number of cells in Y- and X-directions
	  this.cellsY = cellsY;
	  this.cellsX = cellsX;

	  // Player's current map level and block frequencies
	  this.level = 1;
	  this.portalFreq = 0.02;
	  this.enemyFreq = 0.0005;
	  this.wallFreq = 0.75;

	  // Initializes this.mapArray
	  this.genMap = function() {
	    for(var y = 0; y < this.cellsY; y++) {
	      for(var x = 0; x < this.cellsX; x++) {
	        if(!this.mapArray[y]) this.mapArray[y] = [];
	        if(y === 0 || y === this.cellsY - 1 || x === 0 || x === this.cellsX - 1) {
	          this.mapArray[y].push(2);
	        } else if(y === this.cellsY - 2 && x === this.cellsX - 2) {
	          this.mapArray[y].push(5);
	        } else if(y === 1 && x === 1) {
	          this.mapArray[y].push(3);
	        } else if((y >= 1 && y <= 3) && (x >= 1 && x <= 3)) {
	          this.mapArray[y].push(0);
	        } else {
	          this.mapArray[y].push(Math.round(Math.random() * this.wallFreq));
	        }
	      }
	    }
	  };

	  // Increases level and calculated difficulty by 1
	  this.increaseLevel = function() {
	    this.level += 1;
	    this.portalFreq -= 0.0002;
	    if(this.portalFreq < 0) this.portalFreq = 0;
	    this.enemyFreq += 0.0005;
	  };

	  // Creates a new map and places the player back at the starting block
	  this.renewMap = function() {
	    this.mapArray = [];
	    for(var y = 0; y < this.cellsY; y++) {
	      for(var x = 0; x < this.cellsX; x++) {
	        if(!this.mapArray[y]) this.mapArray[y] = [];
	        if(y === 0 || y === this.cellsY - 1 || x === 0 || x === this.cellsX - 1) {
	          this.mapArray[y].push(2);
	        } else if(y === this.cellsY - 2 && x === this.cellsX - 2) {
	          this.mapArray[y].push(5);
	        } else if(y === 1 && x === 1) {
	          this.mapArray[y].push(3);
	        } else if((y >= 1 && y <= 3) && (x >= 1 && x <= 3)) {
	          this.mapArray[y].push(0);
	        } else {
	          this.mapArray[y].push(Math.round(Math.random(1) * this.wallFreq));
	        }
	      }
	    }
	  };

	  // Recreates the world around the player
	  this.refreshMap = function(xPos, yPos) {
	    this.mapArray = [];
	    for(var y = 0; y < this.cellsY; y++) {
	      for(var x = 0; x < this.cellsX; x++) {
	        if(!this.mapArray[y]) this.mapArray[y] = [];
	        if(y === 0 || y === this.cellsY - 1 || x === 0 || x === this.cellsX - 1) {
	          this.mapArray[y].push(2);
	        } else if(y === this.cellsY - 2 && x === this.cellsX - 2) {
	          this.mapArray[y].push(5);
	        } else if(Math.abs(xPos - x) <= 1 && Math.abs(yPos - y) <= 1) {
	          this.mapArray[y].push(0);
	        } else {
	          this.mapArray[y].push(Math.round(Math.random(1) * this.wallFreq));
	        }
	      }
	    }
	  };

	  // Creates a number of portals relative to input Number (from 0.000 - 1.000)
	  // Note: Decimals not required but allowed in order to refine extremes of rarity
	  this.genPortal = function() {
	    var seed;
	    this.mapArray.forEach(function(row, y, Yarr) {
	      row.forEach(function(tile, x, Xarr) {
	        seed = Math.random();
	        if(seed >= 1 - this.portalFreq && (tile === 0 || tile === 1)) {
	          Xarr[x] = 4;
	        }
	      }.bind(this));
	    }.bind(this));
	  };

	  // Generates enemies based on the input probability Number (0.0 - 1.0)
	  this.genEnemy = function() {
	    var enemySeed;
	    var enemyName;
	    var self = this;
	    this.mapArray.forEach(function(row, y, Yarr) {
	      row.forEach(function(tile, x, Xarr) {
	        enemySeed = Math.random();
	        if(enemySeed >= 1 - this.enemyFreq && (tile === 0 || tile === 1)) {
	          Xarr[x] = 6;
	          enemyName = "enemy" + x + y;
	          this.enemyArray.push(new Entity(this, false, x, y));
	        }
	      }.bind(this));
	    }.bind(this));
	  };
	};



/***/ },
/* 3 */
/***/ function(module, exports) {

	var Entity = module.exports = function(rend, cont, xPos, yPos, cps) {
	  this.xPos = xPos || 1;
	  this.yPos = yPos || 1;
	  this.controllable = cont;
	  this.renderer = rend;
	  this.cellsPerSecond = cps || 2;
	  this.facing = 'right';

	  this.checkPos = function() {
	    if(this.renderer.map.mapArray[this.yPos][this.xPos] === 6 && this.controllable === true){
	      if(this.renderer.lives > 0) {
	        this.renderer.lives--;
	        this.renderer.map.renewMap();
	        this.renderer.map.genPortal();
	        this.renderer.map.genEnemy();
	        this.xPos = 1;
	        this.yPos = 1;
	      } else {
	        this.renderer.gameOver();
	      }
	    } else if(this.renderer.map.mapArray[this.yPos][this.xPos] === 5) {
	      this.renderer.map.increaseLevel();
	      this.renderer.map.renewMap();
	      this.renderer.map.genPortal();
	      this.renderer.map.genEnemy();
	      this.renderer.score += 1; 
	      this.renderer.checkHiScore();
	      this.xPos = 1;
	      this.yPos = 1;
	    } else if(this.renderer.map.mapArray[this.yPos][this.xPos] === 4) {
	      this.renderer.map.refreshMap(this.xPos, this.yPos);
	      this.renderer.map.genPortal();
	      this.renderer.map.genEnemy();
	      this.renderer.map.mapArray[this.yPos][this.xPos] = 3;
	    }
	  };

	  this.moveUp = function() {
	    if(this.yPos - 1 > 0 && this.renderer.map.mapArray[this.yPos-1][this.xPos] !== 1) {
	      this.facing = 'up';
	      this.renderer.moveEntity(this.xPos, this.yPos, 0, -1);
	      this.yPos--;
	      this.checkPos();
	    }
	  };

	  this.moveDown = function() {
	    if(this.yPos + 1 < this.renderer.height - 1 && this.renderer.map.mapArray[this.yPos+1][this.xPos] !== 1) {
	      this.facing = 'down';
	      this.renderer.moveEntity(this.xPos, this.yPos, 0, 1);
	      this.yPos++;
	      this.checkPos();
	    }
	  };

	  this.moveRight = function() {
	    if(this.xPos+1 < this.renderer.width - 1 && this.renderer.map.mapArray[this.yPos][this.xPos+1] !== 1) {
	      this.facing = 'right';
	      this.renderer.moveEntity(this.xPos, this.yPos, 1, 0);
	      this.xPos++;
	      this.checkPos();
	    }
	  };

	  this.moveLeft = function() {
	    if(this.xPos-1 > 0 && this.renderer.map.mapArray[this.yPos][this.xPos-1] !== 1) {
	      this.facing = 'left';
	      this.renderer.moveEntity(this.xPos, this.yPos, -1, 0);
	      this.xPos--;
	      this.checkPos();
	    }
	  };
	  
	  this.keyPressed = function(e) {
	    var keyCode = String.fromCharCode(e.keyCode);
	    if (keyCode === "w") {
	      this.moveUp();
	    } else if (keyCode === "a") {
	      this.moveLeft();
	    } else if (keyCode === "s") {
	      this.moveDown();
	    } else if (keyCode === "d") {
	      this.moveRight();
	    } else if (keyCode === "r") {
	      this.renderer.map.renewMap();
	      this.renderer.map.genPortal();
	      this.renderer.map.genEnemy();
	      this.renderer.score = this.renderer.score - 1;
	      this.xPos = 1;
	      this.yPos = 1;
	    }
	  }.bind(this);
	};



/***/ }
/******/ ]);