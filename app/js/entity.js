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
    } else if (keyCode === "r") {
      this.renderer.map.renewMap();
      this.renderer.map.genPortal();
      this.renderer.score = 0;
      this.xPos = 1;
      this.yPos = 1;
    }
  }.bind(this);
};

