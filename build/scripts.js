'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Maze = function () {
  function Maze(options) {
    _classCallCheck(this, Maze);

    this.options = _extends({}, options);
  }

  _createClass(Maze, [{
    key: 'init',
    value: function init() {
      console.log(this.options);
    }
  }]);

  return Maze;
}();

var mazeGame = new Maze({
  mazeContainer: document.getElementById('maze-container'),
  iGridLength: 10,
  jGridLength: 10,
  canvasWidth: 0.8 * window.innerWidth,
  canvasHeight: 0.8 * window.innerHeight,
  grid: true,
  numTargets: 4,
  lineWidth: 2,
  lineColour: 'black',
  wallColour: '#ADD8E6',
  targetColour: '#FF6103',
  playerColour: '#F00',
  backgroundColour: '#fff',
  playerImageUrl: '../../images/player.png',
  targetsImageUrl: '../../images/coin.png',
  mazeLayout: [[0, 0, 0, 0, 0, 0, 0, 3, 3, 3], [0, 0, 0, 2, 3, 0, 0, 0, 3, 3], [0, 0, 0, 3, 3, 0, 0, 0, 0, 3], [0, 0, 0, 0, 3, 0, 0, 3, 0, 0], [2, 3, 0, 0, 0, 3, 0, 3, 0, 0], [3, 3, 3, 0, 2, 0, 3, 0, 0, 0], [3, 3, 3, 0, 2, 0, 0, 0, 0, 0], [3, 3, 3, 0, 3, 0, 0, 0, 0, 0], [3, 3, 3, 0, 3, 0, 0, 0, 0, 0], [3, 3, 3, 0, 3, 0, 0, 0, 0, 0]],
  player: { i: 0, j: 0 },
  playerSpeed: 1.5,
  hitbox: 10
});
mazeGame.init();