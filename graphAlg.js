/**
* @Author: Thomas Foucault
* @Date:   2017-12-15T13:14:29+01:00
* @Filename: graphAlg.js
 * @Last modified by:   Thomas Foucault
 * @Last modified time: 2018-02-24T15:16:34+01:00
*/

function Graph(maze){
  this.vertexes = [];
  this.edges = [];

  for(var i = 0; i < maze.length; i++){
    for(var j = 0; j < maze.length; j++){
      if(maze[i][j] === 0) {
        this.vertexes[i + "," + j] = [i, j];
        this.edges[i + "," + j] = [];
      }
    }
  }

  for(var i = 0; i < maze.length; i++){
    for(var j = 0; j < maze.length; j++){
      if(maze[i][j] === 0) {
        if(i !== 0 && maze[i - 1][j] === 0){
          this.edges[i + "," + j].push((i - 1) + "," + j);
          //this.edges.push(new succTab([i, j], [i - 1, j]));
        }
        if(i !== maze.length - 1 && maze[i + 1][j] === 0){
          this.edges[i + "," + j].push((i + 1) + "," + j);
          //this.edges.push(new succTab([i, j], [i + 1, j]));
        }
        if(j !== 0 && maze[i][j - 1] === 0){
          this.edges[i + "," + j].push(i + "," + (j - 1));
          //this.edges.push(new succTab([i, j], [i, j - 1]));
        }
        if(j !== maze.length - 1 && maze[i][j + 1] === 0){
          this.edges[i + "," + j].push(i + "," + (j + 1));
          //this.edges.push(new succTab([i, j], [i, j + 1]));
        }
      }
    }
  }
  // console.log("v");
  // console.log(this.vertexes);
  // console.log("e");
  // console.log(this.edges);


  var map = [];
  var subMap;
  for(v in this.vertexes) {
    subMap = [];
    for(u in this.edges[v]) {
      subMap[this.edges[v][u]] = 1;
    }
    map[v] = subMap;
  }

  this.dijkstraGraph = new DijkstraGraph(map);
}

function shortestPath(graph, v1, v2) {
  return graph.dijkstraGraph.findShortestPath(v1, v2);
}

var clock = 1;
var visited = [];
//var out = [];
function countCFC(graph) {
  var CFCcounter = 0;
  clock = 1;
  visited = [];
  //out = [];
  for(v in graph.vertexes) {
    visited[v] = false;
  }
  for(v in graph.vertexes) {
    if(!visited[v]) {
      CFCcounter++;
      explore(graph, v);
    }
  }
  return CFCcounter;
}

function explore(graph, v) {
  visited[v] = true;
  //previsit(v);
  for(u in graph.edges[v]) {
    // console.log("EDGE FROM VERTEX " + v);
    // console.log(graph.edges[v]);
    // console.log(graph.edges[v][u]);
    // console.log("visited ? " + visited[graph.edges[v][u]]);
    if(!visited[graph.edges[v][u]]) {
      explore(graph, graph.edges[v][u]);
    }
  }
  //postvisit(v);
}

function previsit(v) {
  visited[v] = true;
  clock++;
}

function postvisit(v) {
  clock++;
}

var longDist = 0;
function longestPath(graph, v1, v2) {
  visited = [];
  longDist = 0;
  for(v in graph.vertexes) {
    visited[v] = false;
  }
  exploreLongestP(graph, v1, v2, 0);
  return longDist;
}

function exploreLongestP(graph, v1, v2, dist) {
  //console.log("longest " + v1 + " " + v2 + " dist " + dist);
  visited[v1] = true;
  if(v1[0] === v2[0] && v1[1] === v2[1]) {
    console.log("Path found! " + dist + " " + longDist);
    if(dist > longDist) {
      longDist = dist;
    }
  }
  //previsit(v);
  for(u in graph.edges[v1]) {
    //console.log("-----------");
    //   console.log("EDGE FROM VERTEX " + v1);
     //console.log(graph.edges[v1]);
    // console.log(graph.edges[v1][u]);
    // console.log("***************");
    // console.log("visited ? " + visited[graph.edges[v][u]]);
    if(!visited[graph.edges[v1][u]]) {
      exploreLongestP(graph, graph.edges[v1][u], v2, dist++);
    }
  }
}
