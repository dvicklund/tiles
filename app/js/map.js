var Map = module.exports = function(cellsX, cellsY) {
  // 2-Dimensional array (after generation) where the map is stored
  this.mapArray = [];

  // Number of cells in Y- and X-directions
  this.cellsY = cellsY;
  this.cellsX = cellsX;

  // Player's current map level
  this.level = 0;

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
          this.mapArray[y].push(Math.round(Math.random() * 0.7));
        }
      }
    }
  };

  // Creates a new map and places the player back at the starting block
  this.renewMap = function() {
    this.level += 1;
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
          this.mapArray[y].push(Math.round(Math.random(1) * 0.7));
        }
      }
    }
  };

  // Creates a number of portals relative to input Number (from 0.000 - 1.000)
  // Note: Decimals not required but allowed in order to refine extremes of rarity
  this.genPortal = function(prob) {
    var seed;
    this.mapArray.forEach(function(row, y, Yarr) {
      row.forEach(function(tile, x, Xarr) {
        seed = Math.random();
        if(seed >= 1 - prob && (tile === 0 || tile === 1)) {
          Xarr[x] = 4;
        }
      });
    });
  };

  // Generates enemies based on the input probability Number (0.0 - 1.0)
  this.genEnemy = function(prob) {
    var enemySeed;
    this.mapArray.forEach(function(row, y, Yarr) {
      row.forEach(function(tile, x, Xarr) {
        enemySeed = Math.random();
        if(seed >= 1 - prob && (tile === 0 || tile === 1)) {
          Xarr[x] = 6;
        }
      });
    });
  };
};

