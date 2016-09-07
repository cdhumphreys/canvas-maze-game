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
    this.setGameState();
    this.preRenderMaze();
    this.addListeners();
    this.render();

    this.loop();

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
      speed: Math.round(this.options.playerSpeed * this.squareLength / 60),
      sizeX: this.squareLength,
      sizeY: this.squareLength,

      hitbox: 15,
      bounceDistance: 2

    }
  }

  setGameState() {
    this.gameState = {
      ended: false,
      score: 0
    };

  }

  preRenderMaze() {
    this.drawGrid(this.tempCtx, this.options.mazeLayout[0].length, this.options.mazeLayout.length);
  }

  addListeners() {
    this.mainCanvas.addEventListener('click', this.clickHandler.bind(this));
  }

  clickHandler(e) {

    const canvasPos = this.mainCanvas.getBoundingClientRect();
    const canvasXOffset = canvasPos.left;
    const canvasYOffset = canvasPos.top;

    let canvasClickX = e.clientX - canvasXOffset;
    let canvasClickY = e.clientY - canvasYOffset;
    if (Math.abs(canvasClickX - this.player.x) > Math.abs(canvasClickY - this.player.y)) {
      if (canvasClickX > this.player.x + (this.player.sizeX/2)) {
        this.player.velY = 0;
        this.player.velX  = 1 * this.player.speed;
      }
      else if (canvasClickX < this.player.x + (this.player.sizeX/2)) {
        this.player.velY = 0;
        this.player.velX = -1 * this.player.speed;
      }
    }
    else {
      if (canvasClickY > this.player.y + (this.player.sizeY/2)) {
        this.player.velX = 0;
        this.player.velY  = 1 * this.player.speed;
      }
      else if (canvasClickY < this.player.y + (this.player.sizeY/2)) {
        this.player.velX = 0;
        this.player.velY = -1 * this.player.speed;
      }
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
    this.checkCollisions();
    this.player.x += this.player.velX;
    this.player.y += this.player.velY;

  }

  getGridPiece(x,y) {
    let i, j;

    i = Math.floor((x/this.mainCanvas.width) * this.options.mazeLayout[0].length);
    j = Math.floor((y/this.mainCanvas.height) * this.options.mazeLayout.length);

    if (i < 0) {
      i = 0;
    }
    else if (i >= this.options.mazeLayout[0].length) {
      i = this.options.mazeLayout[0].length - 1;
    }

    if (j < 0) {
      j = 0;
    }
    else if (j >= this.options.mazeLayout.length) {
      j = this.options.mazeLayout.length - 1;
    }
    return {i,j};

  }

  checkCollisions() {
    // console.log(Math.floor(this.getGridPiece(this.player.x+this.player.sizeX/2, this.player.y+this.player.sizeY/2,0).i));
    // console.log(Math.floor(this.getGridPiece(this.player.x+this.player.sizeX/2, this.player.y+this.player.sizeY/2,0).j));
    let playerMidX = this.player.x + (this.player.sizeX/2);
    let playerMidY = this.player.y + (this.player.sizeY/2);

    // edges of canvas
    if (this.player.x + this.player.sizeX > this.mainCanvas.width) {
      this.player.velX = 0;
      this.player.x = this.mainCanvas.width - this.player.sizeX;

    }
    else if (this.player.x < 0) {
      this.player.velX = 0;
      this.player.x = 0;

    }
    if (this.player.y + this.player.sizeY > this.mainCanvas.height) {
      this.player.velY = 0;
      this.player.y = this.mainCanvas.height - this.player.sizeY;
    }
    else if (this.player.y < 0) {
      this.player.velY = 0;
      this.player.y = 0;
    }

    let playerRightArrayPos = this.getGridPiece(playerMidX + this.player.hitbox, playerMidY);
    let playerLeftArrayPos = this.getGridPiece(playerMidX - this.player.hitbox, playerMidY);
    let playerDownArrayPos = this.getGridPiece(playerMidX, playerMidY + this.player.hitbox);
    let playerUpArrayPos = this.getGridPiece(playerMidX, playerMidY - this.player.hitbox);  

        // checking for contact with walls
    if (this.player.velX > 0 && this.options.mazeLayout[playerRightArrayPos.j][playerRightArrayPos.i] === 3) {
      this.player.velX = 0;
      this.player.x -= this.player.bounceDistance;
    }
    else if (this.player.velX < 0 && this.options.mazeLayout[playerLeftArrayPos.j][playerLeftArrayPos.i] === 3) {
      this.player.velX = 0;
      this.player.x += this.player.bounceDistance;
    }
    else if (this.player.velY > 0 && this.options.mazeLayout[playerDownArrayPos.j][playerDownArrayPos.i] === 3) {
      this.player.velY = 0;
      this.player.y -= this.player.bounceDistance;

    }
    else if (this.player.velY < 0 && this.options.mazeLayout[playerUpArrayPos.j][playerUpArrayPos.i] === 3) {
      this.player.velY = 0;
      this.player.y += this.player.bounceDistance;
    }







  }

  loop() {
    if (!this.gameState.ended) {
      requestAnimationFrame(this.loop.bind(this));
      this.updatePlayer();
      this.render();
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
          [0,0,0,0,0,0,0,0,0,0],
          [1,0,0,0,0,0,0,3,0,0],
          [0,0,2,0,2,0,0,3,0,0],
          [0,0,0,0,3,0,0,3,0,0],
          [0,2,0,3,3,0,0,2,0,0],
          [0,0,0,3,3,0,0,2,0,0],
          [0,0,0,3,3,0,0,3,0,0],
          [0,0,0,3,3,0,3,3,3,0],
          [0,0,0,3,3,0,0,3,0,0],
          [0,2,0,3,3,0,0,0,0,0]
        ],
        numTargets : 3,
        playerPosition: [5,1],
        playerSpeed: 1.5,
        hitbox: 10
      });
