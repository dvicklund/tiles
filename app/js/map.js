var Entity = require('./entity');

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

