/**
 * @Author: Thomas Foucault
 * @Date:   2017-12-04T21:36:01+01:00
 * @Filename: display.js
 * @Last modified by:   Thomas Foucault
 * @Last modified time: 2018-02-25T19:56:44+01:00
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

function updateMazeStatus(stage = -5, nbGen) {
  var str = "";
  switch(stage) {
    case -5:
      str = "Generation not started";
      break;
    case -4:
      str = "Maze generated in " + nbGen + ' generations<br/>Press <a onclick="play()"><i class="fa fa-play fa-lg"></i></a> or <a onclick="forward()"><i class="fa fa-forward fa-lg"></i></a> to continue generating';
      break;
    case -3:
      str = "Generation paused";
      break;
    case -2:
    case -1:
    case 0:
      str = "Searching for exits";
      break;
    case 1:
      str = "Connecting all paths";
      break;
    default:
      str = "Adding complexity";
      break;
  }
  document.getElementById("maze-status").innerHTML = str;
}
