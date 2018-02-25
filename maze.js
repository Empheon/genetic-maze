/**
* @Author: Thomas Foucault
* @Date:   2017-12-04T21:35:46+01:00
* @Filename: maze.js
 * @Last modified by:   Thomas Foucault
 * @Last modified time: 2018-02-25T19:31:28+01:00
*/

function Maze(mazeSize, crossoverMethod) {
  this.fitness = 0;
  this.proportionalFitness = 0;
  this.maze = [];
  this.picked = 0;
  this.succTable = [];

  this.initRandom = function() {
    this.init(true);
  }

  this.initZero = function() {
    this.init(false);
  }

  this.init = function(randomize) {
    for(var i = 0; i < mazeSize; i++){
      var x = [];
      for(var j = 0; j < mazeSize; j++){
        var val = randomize ? Math.floor(Math.random() * 2) : 0;
        x[j] = val;
      }
      this.maze[i] = x;
    }
  }

  //How fit is the maze / how it matches a valid and complex maze
  this.calcFitness = function() {
    this.fitness = 0;
    var fitMultiplier = 1;

    var exits = [];
    var nbOfWantedExits = 2;
    var countExits = 0;
    for(var i = 0; i < mazeSize; i++){
      for(var j = 0; j < mazeSize; j++){
        //count how many exits the maze has
        if((i === 0 || i === mazeSize - 1 || j === 0 || j === mazeSize - 1) && this.maze[i][j] === 0){
          if(countExits < nbOfWantedExits){
            exits[countExits] = i + "," + j;
          }
          countExits++;
        }
      }
    }
    //this.fitness = countExits / (mazeSize * 4 - 4)

    if(countExits !== nbOfWantedExits) {
      this.fitness = 1/Math.abs(nbOfWantedExits - countExits);
    } else {
      this.fitness = fitMultiplier * FIT_COEF;
      fitMultiplier *= FIT_COEF * FIT_COEF;

      //Count connex component ammount

      var graph = new Graph(this.maze);
      var CFCNb = countCFC(graph);
      var CFCquotient = Math.abs(Math.pow(mazeSize * mazeSize, 2) - CFCNb);

      if(CFCNb !== 1){
        this.fitness += (1 / CFCNb) * fitMultiplier;
      } else {
        this.fitness = fitMultiplier * FIT_COEF;
        fitMultiplier *= FIT_COEF * FIT_COEF;


        /*var wallCount = 0;
        for(var i = 1; i < mazeSize - 1; i++){
          for(var j = 1; j < mazeSize - 1; j++){
            if(this.maze[i][j] === 1) {
              wallCount++;
            }
          }
        }

        if(wallCount !== ((mazeSize-1) * (mazeSize-1)) / 2) {
          this.fitness += (1/Math.abs(wallCount - ((mazeSize-2) * (mazeSize-2)) / 2)) * fitMultiplier;
        }*/

        var distBetweenExits = shortestPath(graph, exits[0], exits[1]).length;
        if(distBetweenExits !== ((mazeSize-1) * (mazeSize-1)) / 2) {
          this.fitness += Math.pow(distBetweenExits * fitMultiplier, 1.5);
        } else {
        this.fitness = fitMultiplier * FIT_COEF;
        fitMultiplier *= FIT_COEF * FIT_COEF;
        }
      }
    }
  }


  this.convertToSuccTable = function() {
    //var relationCount = 0;
    for(var i = 0; i < mazeSize; i++){
      for(var j = 0; j < mazeSize; j++){
        if(this.maze[i][j] === 0) {
          if(i !== 0 && this.maze[i - 1][j] === 0){
            this.succTable.push(new succTab([i, j], [i - 1, j]));
          }
          if(i !== mazeSize - 1 && this.maze[i + 1][j] === 0){
            this.succTable.push(new succTab([i, j], [i + 1, j]));
          }
          if(j !== 0 && this.maze[i][j - 1] === 0){
            this.succTable.push(new succTab([i, j], [i, j - 1]));
          }
          if(j !== mazeSize - 1 && this.maze[i][j + 1] === 0){
            this.succTable.push(new succTab([i, j], [i, j + 1]));
          }
        }
      }
    }
  }


  //Crossover methods
  switch(crossoverMethod){
    case Crossover.SINGLE_POINT:
    this.crossover = function(parentB) {
      var child = new Maze(mazeSize, crossoverMethod);
      child.initZero();
      var midpoint = Math.floor(Math.random() * mazeSize);
      if(Math.random() < crossoverRate) {
        for(var i = 0; i < mazeSize; i++){
          for(var j = 0; j < mazeSize; j++){
            if(j < midpoint) {
              child.maze[i][j] = this.maze[i][j];
            } else {
              child.maze[i][j] = parentB.maze[i][j];
            }
          }
        }
      } else {
        child.maze = Math.random() < 0.5 ? this.maze : parentB.maze;
      }
      return child;
    }
    break;
    case Crossover.UNIFORM:
    default:
    this.crossover = function(parentB) {
      var child = new Maze(mazeSize);
      child.initZero();
      var r = Math.random();
      if(Math.random() < crossoverRate) {
        for(var i = 0; i < mazeSize; i++){
          for(var j = 0; j < mazeSize; j++){
            child.maze[i][j] = Math.random() < r ? this.maze[i][j] : parentB.maze[i][j];
          }
        }
      } else {
        child.maze = Math.random() < 0.5 ? this.maze : parentB.maze;
      }
      return child;
    }
    break;
  }

  this.mutate = function(mutationRate) {
    for(var i = 0; i < mazeSize; i++){
      for(var j = 0; j < mazeSize; j++){
        if(Math.random() < mutationRate) {
          this.maze[i][j] = this.maze[i][j] === 0 ? 1 : 0;
        }
      }
    }
  }
}
