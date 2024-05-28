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
          //backgroundColor: _convertToOpacity(randomColors[i], 0.3),
          backgroundColor: randomColors[i],
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
function graphCustom(xAxis, yAxis, labels, id, type, title, showLegend = true, fill = false, suggestedMin = null, position = 'bottom', yAxisTitle = "", thousandSeparator){
  var randomColors = colorGenerator(yAxis);
  var dataConstructor = _dataGenerator(yAxis, labels, randomColors, fill)
  var thisChart = new Chart(id, {
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
          minRotation: 0,
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
         callback: function(value, index, values) {
           return value.toLocaleString(thousandSeparator);
         }
        },
        scaleLabel: {
          display: true,
          labelString: yAxisTitle
        }
      }],
      }
    }
  });
  return(thisChart);
};

//Pie chart
function graphCustomPie(xAxis, yAxis, id, type, title, randomColors, legend = false, position = 'bottom'){
  var thisGraph = new Chart(id, {
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
  });
  return(thisGraph);
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

function shortenLabel(str, maxwidth){
  var sections = [];
  var words = str.split(" ");
  var temp = "";

  words.forEach(function(item, index){
    if(temp.length > 0)
    {
      var concat = temp + ' ' + item;

      if(concat.length > maxwidth){
        sections.push(temp);
        temp = "";
      }
      else{
        if(index == (words.length-1)) {
          sections.push(concat);
          return;
        }
        else {
          temp = concat;
          return;
        }
      }
    }

    if(index == (words.length-1)) {
      sections.push(item);
      return;
    }

    if(item.length < maxwidth) {
      temp = item;
    }
    else {
      sections.push(item);
    }

  });

  return sections;
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
  nextDependent
}
