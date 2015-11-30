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

