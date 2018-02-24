/**
* @Author: Thomas Foucault
* @Date:   2017-12-04T21:36:01+01:00
* @Filename: genetic_alg.js
 * @Last modified by:   Thomas Foucault
 * @Last modified time: 2018-02-24T12:26:00+01:00
*/

const FIT_COEF = 10;

var popSize;
var resolution;
var mazeSize;
var mutationRate;
var population;
var mazeCanvasList = [];
var fitnessChart;
var populations = [];
var fittestOfAllTime;
var maxFit = 0;

var continueUpdatingStatus = true;

//var genFrequence = 50;
var interval = 0;

var Crossover = {
  SINGLE_POINT: 1,
  UNIFORM: 2
}

launch = function(){
  popSize = 50;
  resolution = 200;
  mazeSize = 15;
  mutationRate = 0.001;
  crossoverRate = 1;

  for(var i = 0; i < 4; i++) {
    mazeCanvasList[i] = new MazeCanvas("maze" + i, resolution, mazeSize);
  }

  fitnessChart = new MazeChart("fitnessChart", "Average Fitness");
  population = new Population(mazeSize, mutationRate, crossoverRate, popSize);
  //population.crossoverMethod = Crossover.SINGLE_POINT;
  updateMazeStatus();
}

nextGen = function() {
  population.generateNewPopulation();
  populations[population.generationCounter] = population; //Save the pops

  //Calculate the bests
  if(maxFit < population.fittestMaze.fitness){
    maxFit = population.fittestMaze.fitness;
    fittestOfAllTime = population.fittestMaze;
  }
  fitnessChart.addData(population.averageFitness, "Gen " + population.generationCounter);

  mazeCanvasList[0].drawMaze(fittestOfAllTime.maze);
  mazeCanvasList[1].drawMaze(population.worstMaze.maze);
  mazeCanvasList[2].drawMaze(population.fittestMaze.maze);
  mazeCanvasList[3].drawMaze(population.pop[popSize/2].maze);

  if(continueUpdatingStatus){
    var stage = Math.floor(getBaseLog(FIT_COEF, population.averageFitness))
    updateMazeStatus(stage, population.generationCounter);
    if(stage == 4) {
      continueUpdatingStatus = false;
      stop();
    }
  }
}

getBaseLog = function(x, y) {
    return Math.log(y) / Math.log(x);
}

automaticGen = function(genFrequence) {
  stop();
  nextGen();
  interval = setInterval(nextGen, genFrequence);
}

play = function() {
  automaticGen(500);
}

forward = function() {
  automaticGen(50);
}

stop = function() {
  clearInterval(interval);
}
