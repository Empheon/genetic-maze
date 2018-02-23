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
          this.ctx.fillStyle = "rgb(200, 0, 0)";
        } else {
          this.ctx.fillStyle = "rgb(255, 255, 255)";
        }
        this.ctx.fillRect(j * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize);
      }
    }
  }
}
