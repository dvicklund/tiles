var Map = function(height, width) {
  this.mapArray = [];
  this.height = height;
  this.width = width;

  this.genMap = function() {
    for(var y = 0; y < this.height; y++) {
      for(var x = 0; x < this.width; x++) {
        if(!this.mapArray[y]) this.mapArray[y] = [];
        if(y === 0 || y === this.height - 1 || x === 0 || x === this.width - 1) {
          this.mapArray[y].push(1);
        } else {
          this.mapArray[y].push(Math.round(Math.random(1) * 0.7));
        }
      }
    }
  };
};
