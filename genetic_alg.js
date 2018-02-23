/**
* @Author: Thomas Foucault
* @Date:   2017-12-04T21:36:01+01:00
* @Filename: genetic_alg.js
 * @Last modified by:   Thomas Foucault
 * @Last modified time: 2018-01-07T17:17:29+01:00
*/



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

var autoGen = false;
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
}

automaticGen = function(genFrequence) {
  stop();
  autoGen = true;
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
  autoGen = false;
  clearInterval(interval);
}
