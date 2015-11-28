// var Map = require('./map');

var Renderer = function(context, width, height) {
  this.context = context;
  this.width = width;
  this.height = height;
  this.tileX = context.canvas.width / width; 
  this.tileY = context.canvas.height / height;
  this.map = new Map(width, height);

  this.draw = function() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillStyle = "rgba(255,0,0,0.6)";
    this.map.mapArray.forEach(function(row, y) {
      row.forEach(function(tile, x) {
        if(tile !== 0) this.drawTile(x, y);
      });
    });
  };

  this.drawTile = function(x, y) {
    this.context.fillRect(
      x * this.tileX, y * this.tileY,
      this.tileX, this.tileY
    );
  };
};