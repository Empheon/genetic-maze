/**
 * @Author: Thomas Foucault
 * @Date:   2017-12-04T21:36:01+01:00
 * @Filename: display.js
 * @Last modified by:   Thomas Foucault
 * @Last modified time: 2018-02-24T12:23:07+01:00
 */
function MazeCanvas(id, resolution, arrayLength) {
  this.ctx = document.getElementById(id).getContext("2d");
  this.cellSize = Math.floor(resolution / arrayLength);

  //Init canvas size;
  this.ctx.canvas.width = this.cellSize * arrayLength;
  this.ctx.canvas.height = this.cellSize * arrayLength;

  this.ctx.fillStyle = "rgb(255, 255, 255)";
  this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  this.drawMaze = function(array) {
    var size = array.length;
    for(var i = 0; i < size; i++){
      for(var j = 0; j < size; j++){
        if(array[i][j]){
          this.ctx.fillStyle = "rgb(255, 85, 85)";
        } else {
          this.ctx.fillStyle = "rgb(255, 255, 255)";
        }
        this.ctx.fillRect(j * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize);
      }
    }
  }
}

function updateMazeStatus(stage = -100, nbGen) {
  var str = "";
  switch(stage) {
    case -2:
    case -1:
    case 0:
      str = "Searching for exits";
      break;
    case 1:
      str = "Connecting all paths";
      break;
    case 2:
    case 3:
      str = "Adding complexity";
      break;
    case 4:
      str = "Maze generated in " + nbGen + " generations";
      break;
    case 10:
      str = "Generation paused";
      break;
    default:
      str = "Generation not started";
      break;
  }
  document.getElementById("maze-status").innerHTML = str;
}
