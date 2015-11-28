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

	  this.genMap = function() {
	    for(var y = 0; y < this.cellsY; y++) {
	      for(var x = 0; x < this.cellsX; x++) {
	        if(!this.mapArray[y]) this.mapArray[y] = [];
	        if(y === 0 || y === this.cellsY - 1 || x === 0 || x === this.cellsX - 1) {
	          this.mapArray[y].push(2);
	        } else if(y === 1 && x === 1) {
	          this.mapArray[y].push(3);
	        } else {
	          this.mapArray[y].push(Math.round(Math.random(1) * 0.7));
	        }
	      }
	    }
	  };
	};


	var Renderer = function(width, height) {
	  this.width = width;
	  this.height = height;
	  this.tileX = canvas.width / width; 
	  this.tileY = canvas.height / height;
	  this.map = new Map(width, height);
	  this.map.genMap();

	  this.draw = function() {
	    context.clearRect(0, 0, canvas.width, canvas.height);
	    var self = this;

	    this.map.mapArray.forEach(function(row, y) {
	      row.forEach(function(tile, x) {
	        if(tile === 3) {
	          context.fillStyle = "rgba(0, 0, 255, 0.9)";
	          self.drawTile(x, y);
	        } else if(tile === 2) {
	          context.fillStyle = "rgba(150, 70, 70, 0.9)";
	          self.drawTile(x, y);
	        } else if(tile === 1) {
	          context.fillStyle = "rgba(0, 0, 0, 0.8)";
	          self.drawTile(x, y);
	        } else {
	          context.fillStyle = "rgba(15, 200, 35, 0.8)";
	          self.drawTile(x, y);
	        }
	      });
	    });
	  }.bind(this);

	  this.drawTile = function(x, y) {
	    context.fillRect(
	      x * this.tileX, y * this.tileY,
	      this.tileX, this.tileY
	    );
	  };

	  this.refreshDimensions = function() {
	    canvas.height = window.innerHeight;
	    canvas.width = window.innerWidth;
	    this.tileX = canvas.width / this.width;
	    this.tileY = canvas.height / this.height;
	    this.draw();
	  }.bind(this);

	  this.moveEntity = function(x, y, dx, dy) {
	    var moveVal = this.map.mapArray[y][x];
	    var newVal = this.map.mapArray[y + dy][x + dx];

	    this.map.mapArray[y + dy][x + dx] = moveVal;
	    this.map.mapArray[y][x] = newVal;    
	  }.bind(this);
	};


	var Entity = function(renderer, controllable, xPos, yPos) {
	  this.xPos = xPos || 1;
	  this.yPos = yPos || 1;
	  this.controllable = controllable;
	  this.renderer = renderer;

	  this.moveUp = function() {
	    if(this.yPos - 1 > 0 && renderer.map.mapArray[this.yPos-1][this.xPos] !== 1) {
	      this.renderer.moveEntity(this.xPos, this.yPos, 0, -1);
	      this.yPos--;
	    }
	  };

	  this.moveDown = function() {
	    if(this.yPos + 1 < renderer.height - 1 && renderer.map.mapArray[this.yPos+1][this.xPos] !== 1) {
	      this.renderer.moveEntity(this.xPos, this.yPos, 0, 1);
	      this.yPos++;
	    }
	  };

	  this.moveRight = function() {
	    if(this.xPos+1 < renderer.width - 1 && renderer.map.mapArray[this.yPos][this.xPos+1] !== 1) {
	      this.renderer.moveEntity(this.xPos, this.yPos, 1, 0);
	      this.xPos++;
	    }
	  };

	  this.moveLeft = function() {
	    if(this.xPos-1 > 0 && renderer.map.mapArray[this.yPos][this.xPos-1] !== 1) {
	      this.renderer.moveEntity(this.xPos, this.yPos, -1, 0);
	      this.xPos--;
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


	var Render = new Renderer(20, 14);
	var Player = new Entity(Render, true);

	window.addEventListener('resize', Render.refreshDimensions, false);
	window.addEventListener('keypress', Player.keyPressed, false);

	var gameLoop = setInterval(Render.draw, 100);


/***/ }
/******/ ]);