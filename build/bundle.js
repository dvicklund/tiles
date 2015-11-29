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
/***/ function(module, exports) {

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var windowWidth = document.defaultView.innerWidth;
	var windowHeight = document.defaultView.innerHeight;
	canvas.height = windowHeight;
	canvas.width = windowWidth;


	var Map = function(cellsX, cellsY) {
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
	        } else if((y === 2 && (x === 1 || x === 2)) || (y === 1 && x === 2)) {
	          this.mapArray[y].push(0);
	        } else {
	          this.mapArray[y].push(Math.round(Math.random(1) * 0.7));
	        }
	      }
	    }
	  }

	  this.renewMap = function() {
	    this.mapArray = [];
	    for(var y = 0; y < this.cellsY; y++) {
	      for(var x = 0; x < this.cellsX; x++) {
	        if(!this.mapArray[y]) this.mapArray[y] = [];
	        if(y === 0 || y === this.cellsY - 1 || x === 0 || x === this.cellsX - 1) {
	          this.mapArray[y].push(2);
	        } else if(y === this.cellsY - 2 && x === this.cellsX - 2) {
	          this.mapArray[y].push(5)
	        } else if(y === 1 && x === 1) {
	          this.mapArray[y].push(3);
	        } else if((y === 2 && (x === 1 || x === 2)) || (y === 1 && x === 2)) {
	          this.mapArray[y].push(0);
	        } else {
	          this.mapArray[y].push(Math.round(Math.random(1) * 0.7));
	        }
	      }
	    }
	  }

	  this.refreshMap = function() {
	    this.mapArray = [];
	    for(var y = 0; y < this.cellsY; y++) {
	      for(var x = 0; x < this.cellsX; x++) {
	        if(!this.mapArray[y]) this.mapArray[y] = [];
	        if(y === 0 || y === this.cellsY - 1 || x === 0 || x === this.cellsX - 1) {
	          this.mapArray[y].push(2);
	        } else if(y === this.cellsY - 2 && x === this.cellsX - 2) {
	          this.mapArray[y].push(5)
	        } else {
	          this.mapArray[y].push(Math.round(Math.random(1) * 0.7));
	        }
	      }
	    }
	  }

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


	var Renderer = function(width, height) {
	  this.width = width;
	  this.height = height;
	  this.tileX = canvas.width / width; 
	  this.tileY = canvas.height / height;
	  this.map = new Map(width, height);
	  this.map.genMap();
	  this.map.genPortal();
	  this.score = 0;

	  this.draw = function() {
	    context.clearRect(0, 0, canvas.width, canvas.height);
	    var self = this;
	    var colorSeedR = Math.floor(Math.random() * 256);
	    var colorSeedG = Math.floor(Math.random() * 256);
	    var colorSeedB = Math.floor(Math.random() * 256);
	    var portalColor = 'rgba(' + colorSeedR + ', ' + colorSeedG + ', ' + colorSeedB + ', 1.0)';

	    this.map.mapArray.forEach(function(row, y) {
	      row.forEach(function(tile, x) {
	        if(tile === 3) {
	          self.drawTile("rgba(0, 0, 255, 0.9)", x, y);
	        } else if(tile === 5) {
	          self.drawTile("rgba(250, 255, 0, 0.9)", x, y);
	        } else if(tile === 4) {
	          self.drawTile(portalColor, x, y);
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


	var Entity = function(rend, cont, xPos, yPos) {
	  this.xPos = xPos || 1;
	  this.yPos = yPos || 1;
	  this.controllable = cont;
	  this.renderer = rend;

	  this.checkPos = function() {
	    if(this.renderer.map.mapArray[this.yPos][this.xPos] === 5) {
	      this.renderer.map.renewMap();
	      this.renderer.map.genPortal();
	      this.renderer.score += 1;
	      this.xPos = 1;
	      this.yPos = 1;
	    } else if(this.renderer.map.mapArray[this.yPos][this.xPos] === 4) {
	      this.renderer.map.refreshMap();
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
	    }
	  }.bind(this);
	};


	var Render = new Renderer(25, 14);
	var Player = new Entity(Render, true);

	window.addEventListener('resize', Render.refreshDimensions, false);
	//window.addEventListener('keypress', Player.keyPressed, false);
	window.addEventListener('keypress', Player.keyPressed, false);

	var gameLoop = setInterval(Render.draw, 40);

/***/ }
/******/ ]);