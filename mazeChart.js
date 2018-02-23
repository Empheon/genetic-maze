/**
 * @Author: Thomas Foucault
 * @Date:   2017-12-04T21:35:46+01:00
 * @Filename: mazeChart.js
 * @Last modified by:   Thomas Foucault
 * @Last modified time: 2017-12-15T00:19:50+01:00
 */
function MazeChart(id, label){
  this.dataSum = 0;
  this.dataCounter = 0;
  this.ctx = document.getElementById(id).getContext("2d");
  this.barChart = new Chart(this.ctx, {
    type: 'bar',
    data: {
      datasets: [{
        label: label,
        backgroundColor:'rgba(255, 99, 132, 0.2)',
        borderColor:'rgba(255,99,132,1)',
        borderWidth: 1
      }]
    }
  });

  this.addData = function(data, label) {
    this.barChart.data.labels.push(label);
    this.barChart.data.datasets[0].data.push(data);

    // this.dataSum += data;
    // this.dataCounter++;
    // var dataSize = this.barChart.data.datasets[0].data.length;
    // if(dataSize % ((dataSize.toString().length - 2) * 10) == 0){
    //   this.barChart.data.datasets[1].data.push(this.dataSum / this.dataCounter);
    //   this.dataCounter = 0;
    //   this.dataSum = 0;
    // }
    this.barChart.update();
  }

}
