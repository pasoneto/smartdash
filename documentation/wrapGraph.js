//Wrap up graph functions for convenience
function wrapGraph(checkedValues, categories, filteredData){

  var multiClassClassifiers;  //Selects categories which will be used as group and xAxis  
  Smartdasher.pickMultiClassClassifiers(checkedValues, categories, multiClassClassifiers)

  var nMulticlassClassifiers = window.multiClassClassifiers.length
  console.log("Rendered boxes")

  //For when there are 2 multiclass classifier
  if(nMulticlassClassifiers == 2){

    Smartdasher.renderGraphBoxes(nMulticlassClassifiers)

    var group1 = window.multiClassClassifiers[1]
    var group2 = window.multiClassClassifiers[0]

    var xAxisName1 = window.multiClassClassifiers[0]
    var xAxisName2 = window.multiClassClassifiers[1]

    var [yAxis1, labels1] = Smartdasher.separateDataInGroups(window.filteredData, group1, checkedValues)
    var [yAxis2, labels2] = Smartdasher.separateDataInGroups(window.filteredData, group2, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]
    var xAxis2 = window.checkedValues[xAxisName2]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = Smartdasher.nullsOut(yAxis1, xAxis1, labels1)
    var [yAxis2, xAxis2, labels2] = Smartdasher.nullsOut(yAxis2, xAxis2, labels2)
    //End of filtering null and missing values
    
    Smartdasher.graphCustom(xAxis1, yAxis1, labels1, "myChart", "line", "Comparing by " + group1)
    Smartdasher.graphCustom(xAxis2, yAxis2, labels2, "myChart1", "bar", "Comparing by " + group2, showLegend = true)

    //Rendering up to 3 pieCharts
    var pieColors = Smartdasher.colorGenerator(xAxis1)
    var nPieCharts = Math.min(yAxis1.length, 3)
    Smartdasher.generatePieChartsContainers(nPieCharts)

    for (var i = 2; i < Math.min(yAxis1.length, 3)+2; i++){
      Smartdasher.graphCustomPie(xAxis1, yAxis1[i-2], "myChart" + i, "pie", labels1[i-2], pieColors)
    }

  console.log("Rendered graphs")
  } 
  ///////For when there is only 1 multiclass classifier
  if(nMulticlassClassifiers == 1) {

    Smartdasher.renderGraphBoxes(nMulticlassClassifiers)

    var group1 = window.multiClassClassifiers[0]
    var xAxisName1 = categories.filter(i=>i !== group1)[0]

    var [yAxis1, labels1] = Smartdasher.separateDataInGroups(window.filteredData, group1, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]

    Smartdasher.graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "Comparing by " + group1)
    
  } if(nMulticlassClassifiers < 1) {

    Smartdasher.renderGraphBoxes(1)

    var group1 = categories[0]
    var xAxisName1 = categories[1]

    var [yAxis1, labels1] = Smartdasher.separateDataInGroups(window.filteredData, group1, checkedValues)
    var xAxis1 = window.checkedValues[xAxisName1]

    Smartdasher.graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "Comparing by " + group1)
    
  }

}
