const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;
document.getElementById('maze-container').appendChild(canvas);

const spriteSheetImg = document.createElement('img');
spriteSheetImg.onload = function() {
  loop();
};
spriteSheetImg.src = 'build/images/spritesheet.png';
const spriteSheetWidth = 1841;
const spriteSheetHeight = 2400;

var timestep = 120;

var startTime = Date.now();
let x = 0;
let y = 0;
function render(x,y) {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  // ctx.drawImage(spriteSheetImg, x*spriteSheetWidth/4, (y*spriteSheetHeight/4) + 10, spriteSheetWidth/4, (spriteSheetHeight/4) - 20, 0, 0, 100, 100);
  ctx.drawImage(spriteSheetImg, x*spriteSheetWidth/4, (2*spriteSheetHeight/4) + 10, spriteSheetWidth/4, (spriteSheetHeight/4) - 20, 0, 0, 100, 100);
}

function loop() {
  requestAnimationFrame(loop);
  const time = Date.now();

  if (time - startTime >= timestep) {
      render(x,y);
      startTime = Date.now();
      x++;
      y++;
      if (x > 3) {
        x = 0;
      }
      if (y > 3) {
        y = 0;
      }
  }

}
