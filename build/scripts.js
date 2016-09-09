'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Maze = function () {
  function Maze(options) {
    _classCallCheck(this, Maze);

    this.options = _extends({}, options);

    this.imagesLoaded = 0;
    this.imagesTotal = Object.keys(this.options.imgs).length;

    this.playerImage = new Image();
    this.playerImage.onload = this.checkLoadedImages.bind(this);
    this.playerImage.src = this.options.imgs.playerImageUrl;

    this.tokenImage = new Image();
    this.tokenImage.onload = this.checkLoadedImages.bind(this);
    this.tokenImage.src = this.options.imgs.tokenImageUrl;

    this.numTargets = 0;

    for (var y = 0; y < this.options.mazeLayout.length; y++) {
      for (var x = 0; x < this.options.mazeLayout[0].length; x++) {
        if (this.options.mazeLayout[y][x] === 1) {
          this.playerPosition = [x, y];
        } else if (this.options.mazeLayout[y][x] === 2) {
          this.numTargets++;
        }
      }
    }
  }

  _createClass(Maze, [{
    key: 'init',
    value: function init() {

      // create canvases, score
      this.mainCanvas = document.createElement('canvas');
      this.tempCanvas = document.createElement('canvas');
      this.scoreBoard = document.createElement('div');
      this.scoreBoard.id = 'scoreBoard';
      this.scoreBoard.innerHTML = 'Score: ' + 0;

      // set size of canvas
      this.tempCanvas.width = this.mainCanvas.width = Math.round(this.options.canvasWidth);
      this.sizeCanvas();
      this.squareLength = Math.round(this.mainCanvas.width / this.options.mazeLayout[0].length);
      this.tempCanvas.height = this.mainCanvas.height = this.squareLength * this.options.mazeLayout.length;
      this.options.mazeContainer.appendChild(this.mainCanvas);
      this.options.mazeContainer.appendChild(this.scoreBoard);
      this.mainCtx = this.mainCanvas.getContext('2d');
      this.tempCtx = this.tempCanvas.getContext('2d');

      // player sprite setup
      this.options.spritesheet.frame.width = this.options.spritesheet.width / this.options.spritesheet.framesX;
      this.options.spritesheet.frame.height = this.options.spritesheet.height / this.options.spritesheet.framesY;
      this.timestep = 60 / this.options.spritesheet.spriteAnimFreq;

      //setup game
      this.setPlayer();
      this.setGameState();
      this.preRenderMaze();
      this.addListeners();

      // setup animation and start render loop
      this.startTime = Date.now();
      this.render();
      this.loop();
    }
  }, {
    key: 'checkLoadedImages',
    value: function checkLoadedImages() {
      this.imagesLoaded++;

      if (this.imagesLoaded === this.imagesTotal) {
        this.init();
      }
    }
  }, {
    key: 'setPlayer',
    value: function setPlayer() {
      this.player = {
        x: this.playerPosition[0] * this.squareLength,
        y: this.playerPosition[1] * this.squareLength,
        direction: 'down',

        velX: 0,
        velY: 0,
        speed: Math.round(this.options.playerSpeed * this.squareLength / 60),
        sizeX: this.squareLength,
        sizeY: this.squareLength,

        hitbox: {
          x: Math.round(this.squareLength * this.options.hitbox.x),
          y: Math.round(this.squareLength * this.options.hitbox.y)
        },
        bounceDistance: Math.round(this.squareLength / 8),

        spriteX: 0,
        spriteY: 1

      };
    }
  }, {
    key: 'setGameState',
    value: function setGameState() {
      this.gameState = {
        ended: false,
        score: 0
      };
    }
  }, {
    key: 'preRenderMaze',
    value: function preRenderMaze() {
      this.drawGrid(this.tempCtx, this.options.mazeLayout[0].length, this.options.mazeLayout.length);
    }
  }, {
    key: 'addListeners',
    value: function addListeners() {
      this.mainCanvas.addEventListener('click', this.clickHandler.bind(this));

      this.mainCanvas.addEventListener('touchstart', this.touchStartHandler.bind(this));
      this.mainCanvas.addEventListener('touchend', this.touchEndHandler.bind(this));

      window.addEventListener('resize', this.resizeCanvas.bind(this));
    }
  }, {
    key: 'clickHandler',
    value: function clickHandler(e) {

      var canvasPos = this.mainCanvas.getBoundingClientRect();
      var canvasXOffset = canvasPos.left;
      var canvasYOffset = canvasPos.top;

      var canvasClickX = e.clientX - canvasXOffset;
      var canvasClickY = e.clientY - canvasYOffset;

      if (Math.abs(canvasClickX - this.player.x) > Math.abs(canvasClickY - this.player.y)) {
        if (canvasClickX > this.player.x + this.player.sizeX / 2) {
          this.player.velY = 0;
          this.player.velX = 1 * this.player.speed;
          this.player.direction = 'right';
        } else if (canvasClickX < this.player.x + this.player.sizeX / 2) {
          this.player.velY = 0;
          this.player.velX = -1 * this.player.speed;
          this.player.direction = 'left';
        }
      } else {
        if (canvasClickY > this.player.y + this.player.sizeY / 2) {
          this.player.velX = 0;
          this.player.velY = 1 * this.player.speed;
          this.player.direction = 'down';
        } else if (canvasClickY < this.player.y + this.player.sizeY / 2) {
          this.player.velX = 0;
          this.player.velY = -1 * this.player.speed;
          this.player.direction = 'up';
        }
      }
    }
  }, {
    key: 'touchStartHandler',
    value: function touchStartHandler(e) {
      var canvasPos = this.mainCanvas.getBoundingClientRect();
      var canvasXOffset = canvasPos.left;
      var canvasYOffset = canvasPos.top;

      this.startX = e.touches[0].clientX - canvasXOffset;
      this.startY = e.touches[0].clientY - canvasYOffset;
    }
  }, {
    key: 'touchEndHandler',
    value: function touchEndHandler(e) {
      var canvasPos = this.mainCanvas.getBoundingClientRect();
      var canvasXOffset = canvasPos.left;
      var canvasYOffset = canvasPos.top;

      this.endX = e.changedTouches[0].clientX - canvasXOffset;
      this.endY = e.changedTouches[0].clientY - canvasYOffset;

      if (Math.abs(this.endX - this.startX) > Math.abs(this.endY - this.startY)) {
        if (this.endX > this.startX) {
          this.player.velY = 0;
          this.player.velX = 1 * this.player.speed;
          this.player.direction = 'right';
        } else if (this.endX < this.startX) {
          this.player.velY = 0;
          this.player.velX = -1 * this.player.speed;
          this.player.direction = 'left';
        }
      } else {
        if (this.endY > this.startY) {
          this.player.velX = 0;
          this.player.velY = 1 * this.player.speed;
          this.player.direction = 'down';
        } else if (this.endY < this.startY) {
          this.player.velX = 0;
          this.player.velY = -1 * this.player.speed;
          this.player.direction = 'up';
        }
      }
    }
  }, {
    key: 'drawGrid',
    value: function drawGrid(context, xSquares, ySquares) {
      context.fillStyle = this.options.backgroundColour;
      context.fillRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);

      var yLimit = ySquares * this.squareLength;
      var xLimit = xSquares * this.squareLength;

      context.fillStyle = this.options.wallColour;
      context.lineWidth = this.options.lineWidth;
      context.strokeStyle = this.options.lineColour;
      for (var y = 0; y < ySquares; y++) {
        for (var x = 0; x < xSquares; x++) {
          if (this.options.mazeLayout[y][x] === 3) {
            context.fillRect(x * this.squareLength, y * this.squareLength, this.squareLength, this.squareLength);
          } else if (this.options.mazeLayout[y][x] === 2) {
            context.drawImage(this.tokenImage, x * this.squareLength, y * this.squareLength, this.squareLength, this.squareLength);
          }
          if (this.options.grid) {
            this.drawSquareBorder(context, x * this.squareLength, y * this.squareLength, this.squareLength);
          }
        }
      }
    }
  }, {
    key: 'drawSquareBorder',
    value: function drawSquareBorder(context, x, y, length) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + length, y);
      context.lineTo(x + length, y + length);
      context.lineTo(x, y + length);
      context.closePath();
      context.stroke();
    }
  }, {
    key: 'clearSquare',
    value: function clearSquare(context, x, y) {
      context.fillStyle = this.options.backgroundColour;
      context.fillRect(x * this.squareLength, y * this.squareLength, this.squareLength, this.squareLength);
      if (this.options.grid) {
        this.drawSquareBorder(context, x * this.squareLength, y * this.squareLength, this.squareLength);
      }
    }
    // spritesheet source clipping - sx,sy,sw,sh: sourceX, sourceY, sourceWidth, sourceHeight

  }, {
    key: 'drawPlayer',
    value: function drawPlayer(context, sx, sy, sw, sh, playerX, playerY, playerWidth, playerHeight) {
      context.drawImage(this.playerImage, sx, sy, sw, sh, playerX, playerY, playerWidth, playerHeight);
    }
  }, {
    key: 'render',
    value: function render() {
      this.mainCtx.drawImage(this.tempCanvas, 0, 0);
      if (this.now - this.startTime > this.timestep) {
        this.startTime = Date.now();
        if (this.player.velX === 0 && this.player.velY === 0) {
          if (this.player.direction === 'up') {
            this.player.spriteX = 1;
            this.player.spriteY = 3;
          } else if (this.player.direction === 'right') {
            this.player.spriteX = 1;
            this.player.spriteY = 1;
          } else if (this.player.direction === 'down') {
            this.player.spriteX = 1;
            this.player.spriteY = 0;
          } else if (this.player.direction === 'left') {
            this.player.spriteX = 0;
            this.player.spriteY = 2;
          }
        } else {
          this.player.spriteX++;
          if (this.player.spriteX > this.options.spritesheet.framesX - 1) {
            this.player.spriteX = 0;
          }
          if (this.player.velX > 0) {
            this.player.spriteY = 1;
          } else if (this.player.velX < 0) {
            this.player.spriteY = 2;
          } else if (this.player.velY > 0) {
            this.player.spriteY = 0;
          } else if (this.player.velY < 0) {
            this.player.spriteY = 3;
          }
        }
      }
      this.drawPlayer(this.mainCtx, this.player.spriteX * this.options.spritesheet.frame.width, this.player.spriteY * this.options.spritesheet.frame.height, this.options.spritesheet.frame.width, this.options.spritesheet.frame.height, this.player.x, this.player.y, this.player.sizeX, this.player.sizeY);
    }
  }, {
    key: 'updatePlayer',
    value: function updatePlayer() {
      this.checkCollisions();
      this.player.x += this.player.velX;
      this.player.y += this.player.velY;
    }
  }, {
    key: 'incrementScore',
    value: function incrementScore() {
      this.gameState.score++;
      this.scoreBoard.innerHTML = 'Score: ' + this.gameState.score;

      if (this.gameState.score >= this.numTargets) {
        this.gameState.ended = true;
      }
    }
  }, {
    key: 'getGridPiece',
    value: function getGridPiece(x, y) {
      var i = void 0,
          j = void 0;

      i = Math.floor(x / this.mainCanvas.width * this.options.mazeLayout[0].length);
      j = Math.floor(y / this.mainCanvas.height * this.options.mazeLayout.length);

      if (i < 0) {
        i = 0;
      } else if (i >= this.options.mazeLayout[0].length) {
        i = this.options.mazeLayout[0].length - 1;
      }

      if (j < 0) {
        j = 0;
      } else if (j >= this.options.mazeLayout.length) {
        j = this.options.mazeLayout.length - 1;
      }
      return { i: i, j: j };
    }
  }, {
    key: 'checkCollisions',
    value: function checkCollisions() {
      // console.log(Math.floor(this.getGridPiece(this.player.x+this.player.sizeX/2, this.player.y+this.player.sizeY/2,0).i));
      // console.log(Math.floor(this.getGridPiece(this.player.x+this.player.sizeX/2, this.player.y+this.player.sizeY/2,0).j));
      var playerMidX = this.player.x + this.player.sizeX / 2;
      var playerMidY = this.player.y + this.player.sizeY / 2;

      // edges of canvas
      if (this.player.x + this.player.sizeX > this.mainCanvas.width) {
        this.player.velX = 0;
        this.player.x = this.mainCanvas.width - this.player.sizeX;
      } else if (this.player.x < 0) {
        this.player.velX = 0;
        this.player.x = 0;
      }
      if (this.player.y + this.player.sizeY > this.mainCanvas.height) {
        this.player.velY = 0;
        this.player.y = this.mainCanvas.height - this.player.sizeY;
      } else if (this.player.y < 0) {
        this.player.velY = 0;
        this.player.y = 0;
      }

      var playerRightArrayPos = this.getGridPiece(playerMidX + this.player.hitbox.x, playerMidY);
      var playerLeftArrayPos = this.getGridPiece(playerMidX - this.player.hitbox.x, playerMidY);
      var playerDownArrayPos = this.getGridPiece(playerMidX, playerMidY + this.player.hitbox.y);
      var playerUpArrayPos = this.getGridPiece(playerMidX, playerMidY - this.player.hitbox.y);

      var playerUpRightArrayPos = this.getGridPiece(playerMidX + this.player.hitbox.x, playerMidY - this.player.hitbox.y);
      var playerUpLeftArrayPos = this.getGridPiece(playerMidX - this.player.hitbox.x, playerMidY - this.player.hitbox.y);

      var playerDownRightArrayPos = this.getGridPiece(playerMidX + this.player.hitbox.x, playerMidY + this.player.hitbox.y);
      var playerDownLeftArrayPos = this.getGridPiece(playerMidX - this.player.hitbox.x, playerMidY + this.player.hitbox.y);

      // checking for contact with walls
      if (this.player.velX > 0 && (this.options.mazeLayout[playerRightArrayPos.j][playerRightArrayPos.i] === 3 || this.options.mazeLayout[playerUpRightArrayPos.j][playerUpRightArrayPos.i] === 3 || this.options.mazeLayout[playerDownRightArrayPos.j][playerDownRightArrayPos.i] === 3)) {

        this.player.velX = 0;
        this.player.x -= this.player.bounceDistance;
      } else if (this.player.velX < 0 && (this.options.mazeLayout[playerLeftArrayPos.j][playerLeftArrayPos.i] === 3 || this.options.mazeLayout[playerUpLeftArrayPos.j][playerUpLeftArrayPos.i] === 3 || this.options.mazeLayout[playerDownLeftArrayPos.j][playerDownLeftArrayPos.i] === 3)) {

        this.player.velX = 0;
        this.player.x += this.player.bounceDistance;
      } else if (this.player.velY > 0 && (this.options.mazeLayout[playerDownArrayPos.j][playerDownArrayPos.i] === 3 || this.options.mazeLayout[playerDownRightArrayPos.j][playerDownRightArrayPos.i] === 3 || this.options.mazeLayout[playerDownLeftArrayPos.j][playerDownLeftArrayPos.i] === 3)) {

        this.player.velY = 0;
        this.player.y -= this.player.bounceDistance;
      } else if (this.player.velY < 0 && (this.options.mazeLayout[playerUpArrayPos.j][playerUpArrayPos.i] === 3 || this.options.mazeLayout[playerUpLeftArrayPos.j][playerUpLeftArrayPos.i] === 3 || this.options.mazeLayout[playerUpRightArrayPos.j][playerUpRightArrayPos.i] === 3)) {

        this.player.velY = 0;
        this.player.y += this.player.bounceDistance;
      }

      // collecting targets
      if (this.options.mazeLayout[playerRightArrayPos.j][playerRightArrayPos.i] === 2) {
        this.options.mazeLayout[playerRightArrayPos.j][playerRightArrayPos.i] = 0;
        this.incrementScore();
        this.clearSquare(this.tempCtx, playerRightArrayPos.i, playerRightArrayPos.j);
      } else if (this.options.mazeLayout[playerLeftArrayPos.j][playerLeftArrayPos.i] === 2) {
        this.options.mazeLayout[playerLeftArrayPos.j][playerLeftArrayPos.i] = 0;
        this.incrementScore();
        this.clearSquare(this.tempCtx, playerLeftArrayPos.i, playerLeftArrayPos.j);
      } else if (this.options.mazeLayout[playerUpArrayPos.j][playerUpArrayPos.i] === 2) {
        this.options.mazeLayout[playerUpArrayPos.j][playerUpArrayPos.i] = 0;
        this.incrementScore();
        this.clearSquare(this.tempCtx, playerUpArrayPos.i, playerUpArrayPos.j);
      } else if (this.options.mazeLayout[playerDownArrayPos.j][playerDownArrayPos.i] === 2) {
        this.options.mazeLayout[playerDownArrayPos.j][playerDownArrayPos.i] = 0;
        this.incrementScore();
        this.clearSquare(this.tempCtx, playerDownArrayPos.i, playerDownArrayPos.j);
      }
    }
  }, {
    key: 'sizeCanvas',
    value: function sizeCanvas() {
      if (window.innerWidth > window.innerHeight) {
        // use height as limit
        this.tempCanvas.width = this.mainCanvas.width = Math.round(this.options.canvasSize * window.innerHeight);
      } else {
        // use width as limit
        this.tempCanvas.width = this.mainCanvas.width = Math.round(this.options.canvasSize * window.innerWidth);
        console.log(this);
      }
    }
  }, {
    key: 'resizeCanvas',
    value: function resizeCanvas() {
      this.gameState.paused = true;
      if (window.innerWidth > window.innerHeight) {
        // use height as limit
        this.tempCanvas.width = this.mainCanvas.width = Math.round(this.options.canvasSize * window.innerHeight);
      } else {
        // use width as limit
        this.tempCanvas.width = this.mainCanvas.width = Math.round(this.options.canvasSize * window.innerWidth);
      }

      this.squareLength = Math.round(this.mainCanvas.width / this.options.mazeLayout[0].length);
      this.tempCanvas.height = this.mainCanvas.height = this.squareLength * this.options.mazeLayout.length;

      this.preRenderMaze();
      this.setPlayer();
      this.gameState.paused = false;
    }
  }, {
    key: 'loop',
    value: function loop() {
      if (!this.gameState.ended && !this.gameState.paused) {
        requestAnimationFrame(this.loop.bind(this));

        this.now = Date.now();
        this.updatePlayer();
        this.render();
      }
    }
  }]);

  return Maze;
}();

var mazeGame = new Maze({
  mazeContainer: document.getElementById('maze-container'),
  canvasSize: 0.8,
  grid: true,
  lineColour: '#000',
  lineWidth: 2,
  wallColour: 'midnightblue',
  playerColour: '#F00',
  backgroundColour: '#9f9a9a',
  imgs: {
    playerImageUrl: 'build/images/spritesheet.png',
    tokenImageUrl: 'build/images/coin.png'
  },
  spritesheet: {
    width: 1841,
    height: 2400,
    framesX: 4,
    framesY: 4,
    spriteAnimFreq: 0.8,
    frame: {}
  },
  mazeLayout: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0, 3, 0, 0], [0, 0, 2, 0, 2, 0, 0, 3, 0, 0], [0, 0, 0, 0, 3, 0, 0, 3, 0, 0], [0, 2, 0, 3, 3, 0, 0, 2, 0, 0], [0, 0, 0, 3, 3, 0, 0, 2, 0, 0], [0, 0, 0, 3, 3, 0, 0, 3, 0, 0], [0, 0, 0, 3, 3, 0, 3, 3, 3, 0], [0, 0, 0, 3, 3, 0, 0, 3, 0, 0], [0, 2, 0, 3, 3, 0, 0, 0, 0, 0]],
  playerSpeed: 3,
  hitbox: {
    x: 0.42,
    y: 0.45
  }
});