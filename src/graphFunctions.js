//Choose color to fill in graph
function _randomNoRepeats(array) {
  var copy = array.slice(0);
  return function() {
    if (copy.length < 1) { copy = array.slice(0); }
    var index = Math.floor(Math.random() * copy.length);
    var item = copy[index];
    copy.splice(index, 1);
    return item;
  };
}

function colorGenerator(yAxis){
  //rgba(red, green, blue, alpha)
  var choices = ['rgba(179,92,0)', 'rgba(204,0,130)', 'rgba(0,0,0)', 'rgba(255,130,0)', 'rgba(204,240,250)', 'rgba(227,242,209)', 'rgba(0,159,199)', 'rgba(84,88,90)', 'rgba(229,217,235)', 'rgba(204,214,237)', 'rgba(82,131,22)', 'rgba(0,123,154)', 'rgba(255,204,235)', 'rgba(127,63,152)', 'rgba(222,222,222)', 'rgba(120,190,32)', 'rgba(225,60,152)', 'rgba(224,116,0)', 'rgba(0,181,226)', 'rgba(101,161,27)', 'rgba(255,229,204)', 'rgba(0,51,160)']
  var randomColors = [];
  for (var i=0; i<yAxis.length; i++) {
    //var randomColor = _randomNoRepeats(choices);
    //randomColors.push(randomColor())
    randomColors.push(choices[i])
  }
  return randomColors
}

function _convertToOpacity(rgba, value){
  var rgba = rgba.slice(0, -1) + ',' + value + ')'
  return(rgba)
}

//Generates data object to feed into graph
function _dataGenerator(yAxis, labels, randomColors, fill){
  var dataConstructor = [];
  //Dinamically establish the size of strokes based on number of classifiers
  if(labels.length >= 10){
    var borderWidth = 1
    var pointRadius = 3
  } else {
    var borderWidth = 2
    var pointRadius = 4
    var fill = false
  }
  for (var i=0; i<yAxis.length; i++) {
      var label = labels[i]
      dataConstructor[i] = {
          label: label,
          tension: 0,
          data: yAxis[i],
          borderColor: randomColors[i],
          backgroundColor: _convertToOpacity(randomColors[i], 0.3),
          fill: fill,
          borderWidth: borderWidth,
          pointRadius: pointRadius,
          pointHoverRadius: 6,
      };
  }
  return dataConstructor
}

// Chart.defaults.global.defaultFontColor = "black";
//Generates graph and appends to given element by ID
function graphCustom(xAxis, yAxis, labels, id, type, title, showLegend = true, fill = false, suggestedMin = null, position = 'bottom'){
  var randomColors = colorGenerator(yAxis);
  var dataConstructor = _dataGenerator(yAxis, labels, randomColors, fill)
  new Chart(id, {
    type: type,
    data: {
      labels: xAxis,
      datasets: dataConstructor },
    options: {
      legend: {
        display: showLegend,
        position: position,
        labels: {
          fontSize: 10,
          boxWidth: 10
        }
      },
      title: {
        display: true,
        text: title
      },
      spanGaps: true, //Interpolates missing data
      maintainAspectRatio: false,
      scaleShowValues: true,
      scales: {
      xAxes: [{
        ticks: {
          autoSkip: false,
          minRotation: 45,
        },
        gridLines: {
          display: false,
        },
      }],
      yAxes: [{
        gridLines: {
          display: true,
        },
        ticks: {
          //suggestedMin: suggestedMin, //Uncoment to make y axis always show 0 value
        }
      }],
      }
    }
  });
};

//Pie chart
function graphCustomPie(xAxis, yAxis, id, type, title, randomColors, legend = false, position = 'bottom'){
  new Chart(id, {
    type: type,
    data: {
      labels: xAxis,
      datasets: [{
        backgroundColor: randomColors,
        data: yAxis
      }]
    },
    options: {
      legend: {
        display: legend,
        position: position,
        labels: {
          fontSize: 10,
          boxWidth: 10
        }
      },
      title: {
        display: true,
        text: title 
      },
      spanGaps: true, //Interpolates missing data
      maintainAspectRatio: false,
    }
  })
}

//Verifies which classifiers were selected as single-classifiers, and what were the options selected made
function singleLabelExtractor(checkedValues, labels = null){
  var selectedOptions = Object.values(checkedValues)
  var selectedClassifiers = Object.keys(checkedValues)
  json = {}
  if(labels){
    for(k in selectedOptions){
      if(selectedOptions[k].length == 1){ //Verify if it is single classifier
        json[labels[0]['classifiers'][selectedClassifiers[k]]] = labels[0]['subLabels'][selectedClassifiers[k]][selectedOptions[k]]
      }
    }
  } else {
    for(k in selectedOptions){
      if(selectedOptions[k].length == 1){ //Verify if it is single classifier
        json[selectedClassifiers[k]] = selectedOptions[k]
      }
    }
  }
  return(json)
}

function displaySelectedSingleVariables(checkedValues, exception = null, labels = null){
  var cV = _singleLabelExtractor(checkedValues, exception, labels)
  document.getElementById("selectedVariables").innerHTML = cV
}

function displayNonGraphs(filteredData, whereToAppend, textTranslations, language){
  var noDisplay = Object.values(filteredData).every(i => i.value === 0 || i.value === null || isNaN(i.value))
  if(noDisplay){
    document.getElementById("graphsContainer").innerHTML = "<div id='noGraphContainer'><div id='noGraph'><div id='textNoGraph'><p><i class='fa fa-info-circle' aria-hidden='true'></i></i>  " + textTranslations['noGraphs']['sorryNoData'][language] + "</p><p id='textNoGraph2'>" + textTranslations['noGraphs']['pleaseTryDifferent'][language] + "</div></p></div></div>"
  }
}

//Shorten label
function shortenLabel(text, max){
  if(text.length > max){
    var text = text.slice(0, max) + '...'
    return text
  } else {
    return text
  }
}

//Wrap up graph functions for convenience
function wrapGraph(checkedValues, categories, filteredData){

  var multiClassClassifiers;  //Selects categories which will be used as group and xAxis  
  pickMultiClassClassifiers(checkedValues, categories, multiClassClassifiers)

  var nMulticlassClassifiers = window.multiClassClassifiers.length
  console.log("Rendered boxes")

  //For when there are 2 multiclass classifier
  if(nMulticlassClassifiers == 2){

    renderGraphBoxes(nMulticlassClassifiers)

    var group1 = window.multiClassClassifiers[1]
    var group2 = window.multiClassClassifiers[0]

    var xAxisName1 = window.multiClassClassifiers[0]
    var xAxisName2 = window.multiClassClassifiers[1]

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)
    var [yAxis2, labels2] = separateDataInGroups(window.filteredData, group2, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]
    var xAxis2 = window.checkedValues[xAxisName2]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = nullsOut(yAxis1, xAxis1, labels1)
    var [yAxis2, xAxis2, labels2] = nullsOut(yAxis2, xAxis2, labels2)
    //End of filtering null and missing values
    
    graphCustom(xAxis1, yAxis1, labels1, "myChart", "line", "Comparing by " + group1)
    graphCustom(xAxis2, yAxis2, labels2, "myChart1", "bar", "Comparing by " + group2, showLegend = true)

    //Rendering up to 3 pieCharts
    var pieColors = colorGenerator(xAxis1)
    var nPieCharts = Math.min(yAxis1.length, 3)
    generatePieChartsContainers(nPieCharts)

    for (var i = 2; i < Math.min(yAxis1.length, 3)+2; i++){
      graphCustomPie(xAxis1, yAxis1[i-2], "myChart" + i, "pie", labels1[i-2], pieColors)
    }

  console.log("Rendered graphs")
  } 
  ///////For when there is only 1 multiclass classifier
  if(nMulticlassClassifiers == 1) {

    renderGraphBoxes(nMulticlassClassifiers)

    var group1 = window.multiClassClassifiers[0]
    var xAxisName1 = categories.filter(i=>i !== group1)[0]

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]

    graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "Comparing by " + group1)
    
  } if(nMulticlassClassifiers < 1) {

    renderGraphBoxes(1)

    var group1 = categories[0]
    var xAxisName1 = categories[1]

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)
    var xAxis1 = window.checkedValues[xAxisName1]

    graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "Comparing by " + group1)
    
  }

}

function nextDependent(categoriesAndOptions, plus, dependentIndex, dependentName){
  Number.prototype.mod = function (n) {
    return ((this % n) + n) % n;
  };
  if(plus){
    var dependentOptions = categoriesAndOptions[dependentName]
    window.dependentIndex = dependentIndex + 1
    var ticks = document.getElementById(dependentName)
    var ticks = ticks.getElementsByTagName("input")
    ticks[window.dependentIndex.mod(dependentOptions.length)].click()
  } else {
    var dependentOptions = categoriesAndOptions[dependentName]
    window.dependentIndex = dependentIndex - 1
    var ticks = document.getElementById(dependentName)
    var ticks = ticks.getElementsByTagName("input")
    ticks[window.dependentIndex.mod(dependentOptions.length)].click()
  }
}

module.exports = {
  _randomNoRepeats, 
  colorGenerator,
  _convertToOpacity,
  _dataGenerator,
  graphCustom,
  graphCustomPie,
  singleLabelExtractor,
  displayNonGraphs,
  shortenLabel,
  wrapGraph,
  nextDependent
}
