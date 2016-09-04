'use strict';
class Maze {
  constructor(options) {
    this.options = {...options};

    this.imagesLoaded = 0;
    this.imagesTotal = Object.keys(this.options.imgs).length;


    this.playerImage = new Image();
    this.playerImage.onload=this.checkLoadedImages.bind(this);
    this.playerImage.src = this.options.imgs.playerImageUrl;

    this.tokenImage = new Image();
    this.tokenImage.onload = this.checkLoadedImages.bind(this);
    this.tokenImage.src = this.options.imgs.tokenImageUrl;
  }

  init() {

    this.mainCanvas = document.createElement('canvas');
    this.tempCanvas = document.createElement('canvas');

    this.tempCanvas.width = this.mainCanvas.width = Math.round(this.options.canvasWidth);

    this.squareLength = Math.round(this.options.canvasWidth / this.options.mazeLayout[0].length);

    this.tempCanvas.height = this.mainCanvas.height = this.squareLength * this.options.mazeLayout.length;



    this.options.mazeContainer.appendChild(this.mainCanvas);

    this.mainCtx = this.mainCanvas.getContext('2d');
    this.tempCtx = this.tempCanvas.getContext('2d');

    this.setPlayer();
    this.preRenderMaze();
    this.addListeners();
    this.render();

  }

  checkLoadedImages() {
    this.imagesLoaded++;

    if (this.imagesLoaded === this.imagesTotal) {
      this.init();
    }
  }

  setPlayer() {
    this.player = {
      x: this.options.playerPosition[0] * this.squareLength,
      y: this.options.playerPosition[1] * this.squareLength,

      velX: 0,
      velY: 0,

      sizeX: this.squareLength,
      sizeY: this.squareLength
    }
  }

  preRenderMaze() {
    this.drawGrid(this.tempCtx, this.options.mazeLayout[0].length, this.options.mazeLayout.length);
  }

  addListeners() {
    this.mainCanvas.addEventListener('click', this.clickHandler.bind(this));
  }

  clickHandler(e) {
    console.log(e);
    if (Math.abs(e.clientX - this.player.x) > Math.abs(e.clientY - this.player.y)) {
      console.log('x');
    }
    else {
      console.log('y');
    }
  }

  drawGrid(context, xSquares, ySquares) {
    context.fillStyle = this.options.backgroundColour;
    context.fillRect(0,0,this.mainCanvas.width, this.mainCanvas.height);

    const yLimit = ySquares*this.squareLength;
    const xLimit = xSquares*this.squareLength;

    context.fillStyle = this.options.wallColour;
    for (let y = 0; y < ySquares; y++) {
      for (let x = 0; x < xSquares; x++) {
        if (this.options.mazeLayout[y][x] === 3) {
          context.fillRect(x*this.squareLength,y*this.squareLength,this.squareLength, this.squareLength);
        }
        else if (this.options.mazeLayout[y][x] === 2) {
          context.drawImage(this.tokenImage,x*this.squareLength,y*this.squareLength, this.squareLength, this.squareLength);
        }

      }
    }

  }

  drawPlayer(context, x, y, xSize, ySize) {
    context.drawImage(this.playerImage, x, y, xSize, ySize);
  }

  render() {
    this.mainCtx.drawImage(this.tempCanvas, 0, 0);
    this.drawPlayer(this.mainCtx, this.player.x, this.player.y, this.player.sizeX, this.player.sizeY);
  }

  updatePlayer() {

    checkCollisions();

    this.player.x += this.player.velX;
    this.player.y += this.player.velY;

  }

  checkCollisions() {
    let playerMidX = this.player.x + (this.player.sizeX/2);
    let playerMidY = this.player.y + (this.player.sizeY/2);

    if (this.player.x + this.player.sizeX > this.mainCanvas.width) {
      this.player.x = this.mainCanvas - this.player.sizeX;
    }
    else if (this.player.x < 0) {
      this.player.x = 0;
    }

    if (this.player.y + this.player.sizeY > this.mainCanvas.height) {
      this.player.y = this.mainCanvas - this.player.sizeY;
    }
    else if (this.player.y < 0) {
      this.player.y = 0;
    }

    // travelling right
    if (this.player.velX > 0) {

    }
    // travelling left
    else if (this.player.velX < 0) {

    }
    // travelling up
    else if (this.player.velY < 0) {

    }
    //travelling down
    else if (this.player.velY > 0) {

    }
  }

  loop() {
    if (!this.gameState.ended) {
      requestAnimationFrame(loop);
      updatePlayer();
      render();
    }


  }
}

const mazeGame = new Maze ({
        mazeContainer: document.getElementById('maze-container'),
        canvasWidth: 0.8 * window.innerWidth,
        grid: true,
        wallColour: 'midnightblue',
        playerColour: '#F00',
        backgroundColour: '#9f9a9a',
        imgs: {
          playerImageUrl: 'build/images/player.png',
          tokenImageUrl: 'build/images/coin.png',
        },
        mazeLayout: [
          [0,0,0,0,0],
          [1,0,0,0,0],
          [0,0,2,0,2],
          [0,0,0,0,3],
          [0,2,0,3,3]
        ],
        numTargets : 3,
        playerPosition: [0,1],
        playerSpeed: 1.5,
        hitbox: 10
      });
