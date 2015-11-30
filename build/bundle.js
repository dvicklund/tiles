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

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var windowWidth = document.defaultView.innerWidth;
	var windowHeight = document.defaultView.innerHeight;
	canvas.height = windowHeight;
	canvas.width = windowWidth;

	var Renderer = __webpack_require__(1);
	var Entity = __webpack_require__(3);
	var Render = new Renderer(context, 25, 14);
	var Player = new Entity(Render, true);

	window.addEventListener('resize', Render.refreshDimensions, false);
	window.addEventListener('keypress', Player.keyPressed, false);

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
	    setTimeout(function() {
	      context.clearRect(0, 0, canvas.width, canvas.height);
	      var self = this;
	      requestAnimationFrame(self.draw);

	      if(this.frameCounter % 4 === 0) {
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
	      this.drawHiScore();
	      this.drawInstructions();
	    }.bind(this), 1000 / fps);
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
	  }

	  this.drawScore = function() {
	    context.fillStyle = "rgba(20, 255, 255, 0.9)";
	    context.font = '2em serif';
	    context.textAlign = 'left';
	    context.fillText('Score: ' + this.score, 20, canvas.height - 15 );
	  }

	  this.drawHiScore = function() {
	    context.fillStyle = "rgba(255, 255, 140, 0.9)";
	    context.font = '2em serif';
	    context.textAlign = 'right';
	    context.fillText('High Score: ' + this.highScore, canvas.width - 20, canvas.height - 15);
	  }

	  this.drawInstructions = function() {
	    context.fillStyle = "rgba(180, 180, 180, 0.6)";
	    context.font = '1.2em sans-serif';
	    context.textAlign = 'center';
	    context.fillText('WASD to Move - R to Restart :(', canvas.width / 2, canvas.height - 15);
	  }

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

	    if(newPos !== 5 && newPos !== 4) {
	      this.map.mapArray[y + dy][x + dx] = origPos;
	      this.map.mapArray[y][x] = newPos;
	    } 
	  }.bind(this);
	};



/***/ },
/* 2 */
/***/ function(module, exports) {

	var Map = module.exports = function(cellsX, cellsY) {
	  this.mapArray = [];
	  this.cellsY = cellsY;
	  this.cellsX = cellsX;
	  this.level = 0;

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
	          this.mapArray[y].push(Math.round(Math.random(1) * 0.7));
	        }
	      }
	    }
	  };

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
	          this.mapArray[y].push(Math.round(Math.random(1) * 0.7));
	        }
	      }
	    }
	  };

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
	          this.mapArray[y].push(Math.round(Math.random(1) * 0.7));
	        }
	      }
	    }
	  };

	  this.genPortal = function() {
	    var seed;
	    this.mapArray.forEach(function(row, y, Yarr) {
	      row.forEach(function(tile, x, Xarr) {
	        seed = Math.random();
	        if(seed >= 0.98 && (tile === 0 || tile === 1)) {
	          Xarr[x] = 4;
	        }
	      });
	    });
	  };
	};



/***/ },
/* 3 */
/***/ function(module, exports) {

	var Entity = module.exports = function(rend, cont, xPos, yPos) {
	  this.xPos = xPos || 1;
	  this.yPos = yPos || 1;
	  this.controllable = cont;
	  this.renderer = rend;

	  this.checkPos = function() {
	    if(this.renderer.map.mapArray[this.yPos][this.xPos] === 5) {
	      this.renderer.map.renewMap();
	      this.renderer.map.genPortal();
	      this.renderer.score += 1; 
	      this.renderer.checkHiScore();
	      this.xPos = 1;
	      this.yPos = 1;
	    } else if(this.renderer.map.mapArray[this.yPos][this.xPos] === 4) {
	      this.renderer.map.refreshMap(this.xPos, this.yPos);
	      this.renderer.map.genPortal();
	      this.renderer.map.mapArray[this.yPos][this.xPos] = 3;
	    }
	  };

	  this.moveUp = function() {
	    if(this.yPos - 1 > 0 && this.renderer.map.mapArray[this.yPos-1][this.xPos] !== 1) {
	      this.renderer.moveEntity(this.xPos, this.yPos, 0, -1);
	      this.yPos--;
	      this.checkPos();
	    }
	  };

	  this.moveDown = function() {
	    if(this.yPos + 1 < this.renderer.height - 1 && this.renderer.map.mapArray[this.yPos+1][this.xPos] !== 1) {
	      this.renderer.moveEntity(this.xPos, this.yPos, 0, 1);
	      this.yPos++;
	      this.checkPos();
	    }
	  };

	  this.moveRight = function() {
	    if(this.xPos+1 < this.renderer.width - 1 && this.renderer.map.mapArray[this.yPos][this.xPos+1] !== 1) {
	      this.renderer.moveEntity(this.xPos, this.yPos, 1, 0);
	      this.xPos++;
	      this.checkPos();
	    }
	  };

	  this.moveLeft = function() {
	    if(this.xPos-1 > 0 && this.renderer.map.mapArray[this.yPos][this.xPos-1] !== 1) {
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
	      this.renderer.score = 0;
	      this.xPos = 1;
	      this.yPos = 1;
	    }
	  }.bind(this);
	};



/***/ }
/******/ ]);