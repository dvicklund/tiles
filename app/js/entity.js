var Entity = module.exports = function(rend, cont, xPos, yPos, cps) {
  this.xPos = xPos || 1;
  this.yPos = yPos || 1;
  this.controllable = cont;
  this.renderer = rend;
  this.cellsPerSecond = cps || 2;
  this.facing = 'right';

  this.checkPos = function() {
    if(this.renderer.map.mapArray[this.yPos][this.xPos] === 6 && this.controllable === true){
      if(this.renderer.lives >= 0) {
        this.renderer.lives--;
        this.renderer.map.renew();
        this.renderer.startTime = Date.now();
        this.renderer.clockTime = this.initialTime;
        this.setPos(1, 1);
      } else {
        this.renderer.gameOver();
      }
    } else if(this.renderer.map.mapArray[this.yPos][this.xPos] === 5) {
      this.renderer.levelUp();
      this.setPos(1, 1);
    } else if(this.renderer.map.mapArray[this.yPos][this.xPos] === 4) {
      this.renderer.portalSound.play();
      this.renderer.map.refresh(this.xPos, this.yPos);
    }
  };

  this.setPos = function(x, y) {
    this.xPos = x;
    this.yPos = y;
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
      this.renderer.map.renew();
      this.setPos(1, 1);
    }
  }.bind(this);

  this.touching = false;

  this.screenTouched = function(e) {
    e.preventDefault();
    this.touching = true;
    var x = e.changedTouches[0].pageX;
    var y = e.changedTouches[0].pageY;
    var ratio = this.renderer.screenRatio;

    if((x / y) > ratio && ((x - canvas.width) / y) > -ratio) {
      this.moveRight();
    } else if ((x / y) < ratio && ((x - canvas.width) / y) < -ratio) {
      this.moveLeft();
    } else if ((x / y) < ratio && ((x - canvas.width) / y) > -ratio) {
      this.moveDown();
    } else if ((x / y) > ratio && ((x - canvas.width) / y) < -ratio) {
      this.moveUp();
    }
  }.bind(this);

  this.screenReleased = function(e) {
    e.preventDefault();
    this.touching = false;
  }.bind(this);
};
