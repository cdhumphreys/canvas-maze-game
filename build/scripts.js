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
  }

  _createClass(Maze, [{
    key: 'init',
    value: function init() {

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
        x: this.options.playerPosition[0] * this.squareLength,
        y: this.options.playerPosition[1] * this.squareLength,

        velX: 0,
        velY: 0,

        sizeX: this.squareLength,
        sizeY: this.squareLength
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
    }
  }, {
    key: 'clickHandler',
    value: function clickHandler(e) {
      console.log(e);
      if (Math.abs(e.clientX - this.player.x) > Math.abs(e.clientY - this.player.y)) {
        console.log('x');
      } else {
        console.log('y');
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
      for (var y = 0; y < ySquares; y++) {
        for (var x = 0; x < xSquares; x++) {
          if (this.options.mazeLayout[y][x] === 3) {
            context.fillRect(x * this.squareLength, y * this.squareLength, this.squareLength, this.squareLength);
          } else if (this.options.mazeLayout[y][x] === 2) {
            context.drawImage(this.tokenImage, x * this.squareLength, y * this.squareLength, this.squareLength, this.squareLength);
          }
        }
      }
    }
  }, {
    key: 'drawPlayer',
    value: function drawPlayer(context, x, y, xSize, ySize) {
      context.drawImage(this.playerImage, x, y, xSize, ySize);
    }
  }, {
    key: 'render',
    value: function render() {
      this.mainCtx.drawImage(this.tempCanvas, 0, 0);
      this.drawPlayer(this.mainCtx, this.player.x, this.player.y, this.player.sizeX, this.player.sizeY);
    }
  }, {
    key: 'updatePlayer',
    value: function updatePlayer() {

      checkCollisions();

      this.player.x += this.player.velX;
      this.player.y += this.player.velY;
    }
  }, {
    key: 'checkCollisions',
    value: function checkCollisions() {
      var playerMidX = this.player.x + this.player.sizeX / 2;
      var playerMidY = this.player.y + this.player.sizeY / 2;

      if (this.player.x + this.player.sizeX > this.mainCanvas.width) {
        this.player.x = this.mainCanvas - this.player.sizeX;
      } else if (this.player.x < 0) {
        this.player.x = 0;
      }

      if (this.player.y + this.player.sizeY > this.mainCanvas.height) {
        this.player.y = this.mainCanvas - this.player.sizeY;
      } else if (this.player.y < 0) {
        this.player.y = 0;
      }

      // travelling right
      if (this.player.velX > 0) {}
      // travelling left
      else if (this.player.velX < 0) {}
        // travelling up
        else if (this.player.velY < 0) {}
          //travelling down
          else if (this.player.velY > 0) {}
    }
  }, {
    key: 'loop',
    value: function (_loop) {
      function loop() {
        return _loop.apply(this, arguments);
      }

      loop.toString = function () {
        return _loop.toString();
      };

      return loop;
    }(function () {
      if (!this.gameState.ended) {
        requestAnimationFrame(loop);
        updatePlayer();
        render();
      }
    })
  }]);

  return Maze;
}();

var mazeGame = new Maze({
  mazeContainer: document.getElementById('maze-container'),
  canvasWidth: 0.8 * window.innerWidth,
  grid: true,
  wallColour: 'midnightblue',
  playerColour: '#F00',
  backgroundColour: '#9f9a9a',
  imgs: {
    playerImageUrl: 'build/images/player.png',
    tokenImageUrl: 'build/images/coin.png'
  },
  mazeLayout: [[0, 0, 0, 0, 0], [1, 0, 0, 0, 0], [0, 0, 2, 0, 2], [0, 0, 0, 0, 3], [0, 2, 0, 3, 3]],
  numTargets: 3,
  playerPosition: [0, 1],
  playerSpeed: 1.5,
  hitbox: 10
});