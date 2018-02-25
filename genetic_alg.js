/**
* @Author: Thomas Foucault
* @Date:   2017-12-04T21:36:01+01:00
* @Filename: genetic_alg.js
 * @Last modified by:   Thomas Foucault
 * @Last modified time: 2018-02-25T19:55:05+01:00
*/

const FIT_COEF = 10;

var popSize;
var resolution;
var mazeSize;
var mutationRate;
var population;
var mazeCanvasList;
var fitnessChart;
var populations;
var fittestOfAllTime;
var maxFit;
var continueUpdatingStatus;

var interval;

var Crossover = {
  SINGLE_POINT: 1,
  UNIFORM: 2
}

launch = function(){
  //Init
  popSize = 50;
  resolution = 200;
  mazeSize = 15;
  mutationRate = 0.001;
  crossoverRate = 1;

  maxFit = 0;
  mazeCanvasList = [];
  populations = [];
  continueUpdatingStatus = true;

  for(var i = 0; i < 4; i++) {
    mazeCanvasList[i] = new MazeCanvas("maze" + i, resolution, mazeSize);
  }

  fitnessChart = new MazeChart("fitnessChart", "Average Fitness");
  population = new Population(mazeSize, mutationRate, crossoverRate, popSize);
  //population.crossoverMethod = Crossover.SINGLE_POINT;
  updateMazeStatus();
}

nextGen = function() {
  //var t0 = performance.now();
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
    var stage = getBaseLog(FIT_COEF, population.averageFitness);
    if(stage < 8.0) {
      stage = Math.floor(stage)
    }

    updateMazeStatus(stage);
    if(stage > 8.45) {
      continueUpdatingStatus = false;
      updateMazeStatus(-4, population.generationCounter);
      stop();
    }
  }
  //var t1 = performance.now();
  //console.log("New gen took " + (t1 - t0) + " milliseconds.")
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

pause = function() {
  if(continueUpdatingStatus) updateMazeStatus(-3);
  stop();
}

restart = function() {
  launch();
}
