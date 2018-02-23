/**
* @Author: Thomas Foucault
* @Date:   2017-12-04T21:35:46+01:00
* @Filename: maze.js
 * @Last modified by:   Thomas Foucault
 * @Last modified time: 2018-01-07T17:39:22+01:00
*/

// function succTab(pair, succ){
//   this.pair = pair;
//   this.succ = succ;
// }

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

  //How fit is the maze - Longest maze
  this.calcFitness = function() {
    this.fitness = 0;
    const FIT_COEF = 10;
    var fitMultiplier = 1;
    //TODO: implement graph algorithm

    //Test with fitness = the more walls you have
    // for(var i = 0; i < mazeSize; i++){
    //   for(var j = 0; j < mazeSize; j++){
    //     if(this.maze[i][j] === 1) {
    //       this.fitness++;
    //     }
    //   }
    // }
    // this.fitness = this.fitness / (mazeSize * mazeSize);

    var exit1 = [];
    var exit2 = [];
    var nbOfWantedExits = 2;
    var countExits = 0;
    for(var i = 0; i < mazeSize; i++){
      for(var j = 0; j < mazeSize; j++){
        //count how many exits the maze has
        if((i === 0 || i === mazeSize - 1 || j === 0 || j === mazeSize - 1) && this.maze[i][j] === 0){
          countExits++;
          if(countExits === 1){
            exit1 = [i, j];
          } else if(countExits === 2){
            exit2 = [i, j];
          }
        }
      }
    }
    //this.fitness = countExits / (mazeSize * 4 - 4)

    if(countExits !== nbOfWantedExits ) {
      this.fitness = 1/Math.abs(nbOfWantedExits - countExits);
    } else {
      this.fitness = fitMultiplier * FIT_COEF;
      fitMultiplier *= FIT_COEF * FIT_COEF;
      //this.fitness = 10;
      //Then we search if path is possible
      //this.convertToSuccTable();
      //Count connex component ammount

      //this.fitness = 2 + 1/Math.abs(this.succTable.length - (4 * 2 + ((mazeSize - 1) * 4 - 4) * 3 + ((mazeSize - 2) * (mazeSize - 2)) * 4));
      //this.fitness = Math.pow(this.succTable.length/ (4 * 2 + ((mazeSize - 1) * 4 - 4) * 3 + ((mazeSize - 2) * (mazeSize - 2)) * 4), 4) * 2;
      //Then we search how good is the path
      var graph = new Graph(this.maze);
      var CFCNb = countCFC(graph);
      var CFCquotient = Math.abs(Math.pow(mazeSize * mazeSize, 2) - CFCNb);
      // console.log(CFCNb + " " + CFCquotient);
      if(CFCNb !== 1){
        // console.log((1/CFCNb) + " " + ((1/CFCNb) * fitMultiplier));
        this.fitness += (1/CFCNb) * fitMultiplier;
      } else {
        this.fitness = fitMultiplier * FIT_COEF;
        fitMultiplier *= FIT_COEF * FIT_COEF;
        longestPath(graph, exit1, exit2);
        var wallCount = 0;
        for(var i = 1; i < mazeSize - 1; i++){
          for(var j = 1; j < mazeSize - 1; j++){
            if(this.maze[i][j] === 1) {
              wallCount++;
            }
          }
        }

        if(wallCount !== ((mazeSize-1) * (mazeSize-1)) / 2) {
          this.fitness += (1/Math.abs(wallCount - ((mazeSize-2) * (mazeSize-2)) / 2)) * fitMultiplier;
        } else {
        this.fitness = fitMultiplier * FIT_COEF;
        fitMultiplier *= FIT_COEF * FIT_COEF;
        }
        // this.fitness = Math.pow(this.fitness, 2);
      }
    }



    //this.fitness = this.fitness / (mazeSize * mazeSize);
    //this.fitness = Math.pow(this.fitness, 3);
    // if(this.fitness >= 1) {
    //   this.fitness = 0.9999;
    //   return;
    // }
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
