'use strict';
class Maze {
  constructor(options) {
    this.options = {...options};
  }

  init() {
    console.log(this.options);
  }

}


const mazeGame = new Maze ({
        mazeContainer: document.getElementById('maze-container'),
        iGridLength: 10,
        jGridLength: 10,
        canvasWidth: 0.8 * window.innerWidth,
        canvasHeight: 0.8 * window.innerHeight,
        grid: true,
        numTargets : 4,
        lineWidth: 2,
        lineColour: 'black',
        wallColour: '#ADD8E6',
        targetColour: '#FF6103',
        playerColour: '#F00',
        backgroundColour: '#fff',
        playerImageUrl: '../../images/player.png',
        targetsImageUrl: '../../images/coin.png',
        mazeLayout: [
          [0,0,0,0,0,0,0,3,3,3],
          [0,0,0,2,3,0,0,0,3,3],
          [0,0,0,3,3,0,0,0,0,3],
          [0,0,0,0,3,0,0,3,0,0],
          [2,3,0,0,0,3,0,3,0,0],
          [3,3,3,0,2,0,3,0,0,0],
          [3,3,3,0,2,0,0,0,0,0],
          [3,3,3,0,3,0,0,0,0,0],
          [3,3,3,0,3,0,0,0,0,0],
          [3,3,3,0,3,0,0,0,0,0]
        ],
        player: {i: 0, j: 0},
        playerSpeed: 1.5,
        hitbox: 10
      });
      mazeGame.init();
