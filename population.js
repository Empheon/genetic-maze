/**
 * @Author: Thomas Foucault
 * @Date:   2017-12-04T21:35:46+01:00
 * @Filename: population.js
 * @Last modified by:   Thomas Foucault
 * @Last modified time: 2017-12-15T00:45:12+01:00
 */



function Population(mazeSize, mutationRate, crossoverRate, popSize) {
  this.pop = [];
  this.generationCounter = 0;
  this.averageFitness = 0;
  this.fittestMaze;
  this.worstMaze;
  this.crossoverMethod = Crossover.UNIFORM; //Default
  //this.mutationRate = mutationRate;
  //this.mazeSize = mazeSize;
  //this.popSize = popSize;

  for(var i = 0; i < popSize; i++){
    this.pop[i] = new Maze(mazeSize, this.crossoverMethod);
    this.pop[i].initRandom();
  }

  this.calcProportionalFitness = function(){
    var total = 0;
    for(var i = 0; i < popSize; i++){
      total += this.pop[i].fitness;
    }

    for(var i = 0; i < popSize; i++){
      this.pop[i].proportionalFitness = this.pop[i].fitness / total;
    }
  }

  this.calcFitness = function() {
    var maxFit = 0;
    var minFit = 1;
    for(var i = 0; i < popSize; i++){
      this.pop[i].calcFitness();
      this.averageFitness += this.pop[i].fitness;

      if(this.pop[i].fitness > maxFit){
        maxFit = this.pop[i].fitness;
        this.fittestMaze = this.pop[i];
      }
      if(this.pop[i].fitness < minFit){
        minFit = this.pop[i].fitness;
        this.worstMaze = this.pop[i];
      }
    }
    this.averageFitness /= popSize;

    this.calcProportionalFitness();
  }
  this.calcFitness();

  this.selectParent = function() {
    var i = 0;
    var r = Math.random();
    while(r > 0) {
      r -= this.pop[i].proportionalFitness;
      i++;
    }
    i--;
    return this.pop[i];
  }

  this.reproduce = function() {
    var newPop = [];
    for(var i = 0; i < popSize; i++){
      var parentA = this.selectParent();
      var parentB = this.selectParent();
      var child = parentA.crossover(parentB);
      child.mutate(mutationRate);
      newPop[i] = child;
    }
    this.pop = newPop;
    //console.log(this.pop);
  }

  this.generateNewPopulation = function() {
    this.reproduce();
    this.calcFitness();
    this.generationCounter++;
  }
}
