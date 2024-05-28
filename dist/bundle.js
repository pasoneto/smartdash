(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SmartDasher = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {extractCategoriesAndOptions, generateCheckBoxes, showBoxSelector, checkedValuesObjectGenerator, verifyCheckedBoxes, mergeVerifyCheckedBoxes, removeChecksExceptCurrent, onlyOne, onlyOneEnforcer, allOK, checkBoxVerificationSystem, dragElement, multiCheck, singleCheck, targetCheck, simulateSelection, pickMultiClassClassifiers, verifyAllClassifiersChecked } = require("./checkBoxSelectors.js")
const {filterDataByCheckBox, _filterNull, _removeNullColumns, nullsOut, onlyUnique, separateDataInGroups} = require('./dataProcessUtils.js')
const {documentAppender, renderGraphBoxes, generatePieChartsContainers, initiateDashboard} = require('./generateHTMLstructure.js')
const {_randomNoRepeats, colorGenerator, _convertToOpacity, _dataGenerator, graphCustom, graphCustomPie, singleLabelExtractor, displayNonGraphs, shortenLabel, wrapGraph, nextDependent } = require('./graphFunctions.js')
const { styleGen, loadArea, showUnderliningMap, drawMap } = require('./leafLetFunctions.js')
const { sankeyControls, verifySankeyOrder, connectionGenerator } = require('./sankeyFunctions.js')
const { copyText, shareDashboard, checkBoxesFromUrl, hideSelectors } = require('./shareFunctions.js')

module.exports = { extractCategoriesAndOptions, generateCheckBoxes, showBoxSelector, checkedValuesObjectGenerator, verifyCheckedBoxes, mergeVerifyCheckedBoxes, removeChecksExceptCurrent, onlyOne, onlyOneEnforcer, allOK, checkBoxVerificationSystem, dragElement, multiCheck, singleCheck, targetCheck, simulateSelection, pickMultiClassClassifiers, verifyAllClassifiersChecked, filterDataByCheckBox, _filterNull, _removeNullColumns, nullsOut, onlyUnique, separateDataInGroups, documentAppender, renderGraphBoxes, generatePieChartsContainers, initiateDashboard, _randomNoRepeats, colorGenerator, _convertToOpacity, _dataGenerator, graphCustom, graphCustomPie, singleLabelExtractor, displayNonGraphs, shortenLabel, wrapGraph, nextDependent, styleGen, loadArea, showUnderliningMap, drawMap, sankeyControls, verifySankeyOrder, connectionGenerator, copyText, shareDashboard, checkBoxesFromUrl, hideSelectors }

},{"./checkBoxSelectors.js":2,"./dataProcessUtils.js":3,"./generateHTMLstructure.js":4,"./graphFunctions.js":5,"./leafLetFunctions.js":6,"./sankeyFunctions.js":7,"./shareFunctions.js":8}],2:[function(require,module,exports){
//Function extracts options associated with each category within the data
function extractCategoriesAndOptions(data, dependentVariableName){

  var classifiers = Object.keys(data[0]) //Extract classifier names (e.g., year, size, etc...)
  var classifiers = classifiers.filter(i => i !== dependentVariableName) //Remove value, which is what we want to plot

  function _onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  var options = []
  for(k in classifiers){
    var a = data.map(i=>i[classifiers[k]])
    var a = a.filter(_onlyUnique)
    options.push(a)
  }
  var options = options.filter(i=> i[0] !== undefined)
  return [classifiers, options]
}

//Generates checkboxes for dimension selection
function generateCheckBoxes(classifiers, options, data, dependentVariable, labels = null, textTranslations = null, language, wrapGraphFunction){
  var boxTop = document.getElementById("boxTop")

  var header = document.createElement('div');
  header.setAttribute('id', 'categorySelectorHeader');

  var btnDimensionSelector = document.createElement('button');
  btnDimensionSelector.setAttribute('id', 'buttonDimensionSelector2');
  var paragraphHeader = document.createElement('p');
  if(textTranslations !== null){
    var textHeader = textTranslations['checkboxes']['categorySelector'][language] //Header of category selector
    var buttonText = textTranslations['checkboxes']['renderGraphs'][language]
  } else {
    var textHeader = 'Category selector';
    var buttonText = 'Render graphs</button>';
  }

  paragraphHeader.innerHTML = textHeader
  btnDimensionSelector.innerHTML = buttonText
  header.appendChild(paragraphHeader)
  boxTop.appendChild(header)
  boxTop.appendChild(btnDimensionSelector)

  var checkBoxListContainer = document.createElement('div');
  checkBoxListContainer.setAttribute('id', 'checkBoxListContainer');

  for(category in classifiers){

    var classifierCode = classifiers[category]
    
    //Create label (title) of checkbox
    var labelClassifiers = document.createElement('label');
    var labelClassifierID = classifierCode + 'Label'
    labelClassifiers.setAttribute('id', labelClassifierID);
    
    //Add singleMultiple text to label (title) of checkbox
    var singleMultipleDiv = document.createElement("div");
    var singleMultipleDivID = classifierCode + "LabelSingleMultiple"
    singleMultipleDiv.setAttribute('id', singleMultipleDivID);

    if(labels && classifierCode !== dependentVariable){
      var labelText = labels[0]['classifiers'][classifierCode]
    } else {
      var labelText = classifierCode
    }
    
    //Add text and singleMultiple div to label (title)
    labelClassifiers.innerHTML = labelText
    labelClassifiers.appendChild(singleMultipleDiv)

    //Append label (title)
    checkBoxListContainer.appendChild(labelClassifiers)

    var ulElement = document.createElement('ul')
    ulElement.setAttribute('id', classifierCode)

    for(option in options[category]){ 
      //Code of currentOption
      var currentOption = options[category][option]
      var currentOptionId = currentOption + classifierCode

      var linkElement = document.createElement('li')
      var inputElement = document.createElement('input')
      inputElement.setAttribute('type', 'checkbox')
      inputElement.setAttribute('id', currentOptionId)

      linkElement.appendChild(inputElement) 

      //if labels are provided, rendered checkbox will show their names
      if(labels){
        var catItem = options[category][option].toString()
        if(labels[0]['subLabels'][classifiers[category]]){
          var allCats = Object.keys(labels[0]['subLabels'][classifiers[category]])
          var allCats = allCats.map(i=> i.toString())
        } else {
          var allCats = [{}];
        }
        if(allCats.includes(catItem)){ 
          var currentOptionText = labels[0]['subLabels'][classifierCode][currentOption]
        } else {
          var currentOptionText = currentOption 
        }
      } else {
        var currentOptionText = currentOption
      }

      //Add text inside label
      var textLabelElement = document.createElement('label')
      textLabelElement.setAttribute('for', currentOptionId)
      var currentOptionText = document.createTextNode(currentOptionText)
      textLabelElement.appendChild(currentOptionText)

      linkElement.appendChild(inputElement) 
      linkElement.appendChild(textLabelElement)
      ulElement.appendChild(linkElement)
    }

    checkBoxListContainer.appendChild(ulElement)
  }
  
  //Append all check boxes options and titles to boxTop
  boxTop.appendChild(checkBoxListContainer)

  //Add render button at the bottom of boxTop
  var buttonDimensionSelector = document.createElement('button')
  buttonDimensionSelector.setAttribute('id', 'buttonDimensionSelector')
  if(textTranslations !== null){
    var buttonText = textTranslations['checkboxes']['renderGraphs'][language]
  } else {
    var buttonText = 'Render graphs'
  }

  var buttonText = document.createTextNode(buttonText)
  buttonDimensionSelector.appendChild(buttonText)
  boxTop.appendChild(buttonDimensionSelector)

  //Once data has been fetched and checkboxes created, Select dimension button will receive the following functions
  var buttonsRenderGraph = document.querySelectorAll(`[id^="buttonDimensionSelector"]`)
  //Applying render function to these buttons
  for(k in buttonsRenderGraph){
    buttonsRenderGraph[k].onclick = function(){
      wrapGraphFunction() 
      showBoxSelector("boxTop")
      showBoxSelector("dimmer")
    }
  }

  var boxSelector = document.getElementById("boxTop")
  var headerSelector = document.getElementById("categorySelectorHeader")
  dragElement(boxSelector, headerSelector);

}

//Changes style of checkBox container. Now it appears in front of everything
function showBoxSelector(id){
  var divToChange = document.getElementById(id)
  if(divToChange.style.display == '') {
    divToChange.style.display = 'block';
  } else {
    divToChange.style.display = '';
  }
}

//Generates object with keys corresponding to the classifiers. Values are empty list, and will receive values when checkboxes are clicked
function checkedValuesObjectGenerator(classifiers){
  var checkedValues = {} //Creates empty object with category keys
  for(k in classifiers){
    checkedValues[classifiers[k]] = []
  }
  return(checkedValues)
}

//Checks what values were selected by the ID of the selector
function verifyCheckedBoxes(category){
  var json = {}
  var ul = document.getElementById(category)
  var items = ul.getElementsByTagName("input") 
  var checkedValues = []
  for(k in items){
    if(items[k].checked){
      //Removing name of classifier from ID
      var currentSize = items[k].id.length
      var categorySize = category.length
      var originalSize = currentSize - categorySize
      var originalCode = items[k].id.slice(0, originalSize)
      checkedValues.push(originalCode)
    }
  }
  json[category] = checkedValues
  return(json)
}

//Runs function verifyCheckedBoxes across all classifiers, and returns a single object with selections
function mergeVerifyCheckedBoxes(classifiers){
  var allChecks = {}
  for(k in classifiers){
    var a = verifyCheckedBoxes(classifiers[k])
    Object.assign(allChecks, a)
  }
  window.checkedValues = allChecks
  return(allChecks)
}

//Function prevents the selection of more than one category with more than one value
function removeChecksExceptCurrent(checkBoxes, current) {
  for(k in checkBoxes){
    if(checkBoxes[k].id !== current.id){
      checkBoxes[k].checked = false
    }
  }
}

//Functions applies the onlyOne function to all elements of a category ID
function onlyOne(category, checkedValues, classifiers, data, filterFunction){
  var a = document.getElementById(category)
  var b = a.getElementsByTagName('input')
  for(j in b){
    b[j].onclick = function(){
      removeChecksExceptCurrent(b, this)
      checkedValues = mergeVerifyCheckedBoxes(classifiers)
      //Filters data on every click
      window.filteredData = filterFunction(classifiers, data, window.checkedValues)
    }
  }
}

//Checks number of selected boxes per category. If one category has more than 1 checks, 
//applies onlyOne to all except that category.
function onlyOneEnforcer(classifiers, checkedValues, data, filterFunction, textTranslations, howToFunction){
  var multipleCheckCategories = []
  for(k in classifiers){
    var nCheckedByCategory = checkedValues[classifiers[k]].length
    if((nCheckedByCategory > 1) && (multipleCheckCategories.indexOf(classifiers[k]) == -1)){
      multipleCheckCategories.push(classifiers[k])
    }
  }
  if(multipleCheckCategories.length == 2){ //If there are two multiple checks
    for(k in classifiers){
        //document.getElementById(classifiers[k] + 'Label' + "SingleMultiple").innerHTML = classifiers[k] + '<font color="blue"> (Multiple selector)</font>' //Add text saying that this category is multiple selector
        var notMultiple = multipleCheckCategories.indexOf(classifiers[k]) !== -1
        if(!notMultiple){
          if(textTranslations !== null){
            document.getElementById(classifiers[k] + 'Label' + "SingleMultiple").innerHTML = '<font color="blue"> (' + textTranslations['checkboxes']['singleSelector'][language] + ') <button id="howToButton" onclick=howToFunction()><i class="fa fa-question-circle" aria-hidden="true"></i></button> </font>' //Add text saying that this category is multiple selector
          } else {
            document.getElementById(classifiers[k] + 'Label' + "SingleMultiple").innerHTML = '<font color="blue"> (Single selector) <button id="howToButton" onclick=><i class="fa fa-question-circle" aria-hidden="true"></i></button> </font>' //Add text saying that this category is multiple selector
          }
          onlyOne(classifiers[k], checkedValues, classifiers, data, filterFunction, textTranslations)
      }
    }
  }
}

//Function returns true if ALL classifiers have up to 1 checkbox selected
function allOK(classifiers, checkedValues){
  var classifiersWithMultiple = []
  for(k in classifiers){
    var multipleCategoryMarked = classifiersWithMultiple.indexOf(classifiers[k]) !== -1 
    var multipleCategory = checkedValues[classifiers[k]].length > 1
    if( (!multipleCategoryMarked) && ( multipleCategory ) ){
      classifiersWithMultiple.push(classifiers[k]) 
    }
  }
  var notManyChecked = classifiersWithMultiple.length < 2
  return(notManyChecked)
}

//If no category has more than 1 check, initial function state is established (multiple selection allowed)
function checkBoxVerificationSystem(classifiers, checkedValues, data, filterFunction, exception = null, textTranslations = null, howToFunction){

  var allCheckBoxes = document.querySelectorAll('input');

  if(exception){
    onlyOne(exception, checkedValues, classifiers, data, filterFunction)
    //Establishes that exception category will only be single selector
    if(textTranslations !== null){
      document.getElementById(exception + 'Label' + "SingleMultiple").innerHTML = '<font color="blue"> (' + textTranslations['checkboxes']['singleSelector'][language] + ')</font>' //Add text saying that this category is multiple selector
    } else {
      document.getElementById(exception + 'Label' + "SingleMultiple").innerHTML = '<font color="blue"> (Single selector)</font>' //Add text saying that this category is multiple selector
    }
  }

  var notMany = allOK(classifiers, checkedValues)
  if(notMany){ //Removes OnlyOne
    for(k in classifiers){
      if(classifiers[k] !== exception){
        if(textTranslations !== null){
          document.getElementById(classifiers[k] + 'Label' + "SingleMultiple").innerHTML = '<font color="blue"> (' + textTranslations['checkboxes']['multipleSelector'][language] + ') </font><p><input type="checkbox" id="selectAll" onclick=SmartDasher.multiCheck("' + classifiers[k] + '")></input><div id="selectAllText">' + textTranslations['checkboxes']['all'][language] + ' <i class="fa fa-arrow-right" aria-hidden="true"></i></div></p>' //Add text saying that this category is multiple selector
        } else {
          document.getElementById(classifiers[k] + 'Label' + "SingleMultiple").innerHTML = '<font color="blue"> (Multiple selector) </font><p><input type="checkbox" id="selectAll" onclick=SmartDasher.multiCheck("' + classifiers[k] + '")></input><div id="selectAllText">All <i class="fa fa-arrow-right" aria-hidden="true"></i></div></p>' //Add text saying that this category is multiple selector
        }
      }
    }
    for(j in allCheckBoxes){
      allCheckBoxes[j].onclick = function(){
        checkedValues = mergeVerifyCheckedBoxes(classifiers)
        onlyOneEnforcer(classifiers, checkedValues, data, filterFunction, textTranslations, howToFunction)
        checkBoxVerificationSystem(classifiers, checkedValues, data, filterFunction, exception, textTranslations, howToFunction)
        
        //Filters data on every click
        window.filteredData = filterFunction(classifiers, data, window.checkedValues)

      }
    }
  }
  if(exception){
    onlyOne(exception, checkedValues, classifiers, data, filterFunction) //Puts back the single check in a particular category
  }
};

function dragElement(elmnt, headerElmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    headerElmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

//Simulate checkbox selection and automates generation of dashboard
function multiCheck(categoryName){
  var a = document.getElementById(categoryName)
  var a = Array.from(a.getElementsByTagName("input"))
  for(k in a){
    a[k].click()
  }
}

function singleCheck(categoryName, indexToClick = null){
  var a = document.getElementById(categoryName)
  var a = Array.from(a.getElementsByTagName("input"))
  if(indexToClick === null){
    var randomIndex = Math.floor(Math.random() * a.length);
    a[randomIndex].click()
  } else {
    a[indexToClick].click()
  }
}

function targetCheck(categoryName, options){
  var a = document.getElementById(categoryName)
  var a = Array.from(a.getElementsByTagName("input"))
  function clickIf(i){ if(options.includes(i.id)){i.click()} }
  a.map(i=> clickIf(i))
}

async function simulateSelection(multi, single){
  while (true) {
    console.log("Trying:")
    console.log(multi)
    console.log(single)
    multi.map(i => multiCheck(i))
    single.map(i => singleCheck(i))
    
    var allNull = filteredData.filter(i=> i.value !== null && i.value !== 0 && i.value !== '..')

    if(allNull.length <= 5){
      var allCheckBoxes = Array.from(document.querySelectorAll('input[type="checkbox"]'))
      for(i in allCheckBoxes){
        if(allCheckBoxes[i].checked === true){
          allCheckBoxes[i].click()
        }
      }
    }

    if(allNull.length > 5){            
        break;
    } 
  }
}

//Selects only categories which received 2 or more checks in checkboxes
function pickMultiClassClassifiers(checkedValues, categories){
  window.multiClassClassifiers = []
  for(k in categories){
    var nChecks = window.checkedValues[categories[k]].length
    if(nChecks > 1){
      window.multiClassClassifiers.push(categories[k])
    }
  }
}

//Verifies if user chose at least one option for each classifier. If not calls function singleCheck() with classifier name as parameter
function verifyAllClassifiersChecked(checkedValues){
  var checkedClassifiers = Object.keys(checkedValues)
  for(k in checkedClassifiers){
    var nChecked = checkedValues[checkedClassifiers[k]].length
    if(nChecked < 1){
      if(labels !== null){
        //Swal.fire("You did not select any value for " + labels[0]['classifiers'][checkedClassifiers[k]] + ", so we picked one for you.")
      } else {
        //Swal.fire("You did not select any value for " + checkedClassifiers[k] + ", so we picked one for you.")
      }
      singleCheck(checkedClassifiers[k], 0)
    }
  }
}

module.exports = {
  extractCategoriesAndOptions,
  generateCheckBoxes,
  showBoxSelector,
  checkedValuesObjectGenerator,
  verifyCheckedBoxes,
  mergeVerifyCheckedBoxes,
  removeChecksExceptCurrent,
  onlyOne,
  onlyOneEnforcer,
  allOK,
  checkBoxVerificationSystem,
  dragElement,
  multiCheck,
  singleCheck,
  targetCheck,
  simulateSelection,
  pickMultiClassClassifiers, 
  verifyAllClassifiersChecked
}

},{}],3:[function(require,module,exports){
//Filter values from reshapedJSON output to match only checked values from checkboxes
function filterDataByCheckBox(classifiers, data, checkedValues){
  var filteredData = data
  for(k in classifiers){
    for(i in filteredData){
    }
    var selectedCategories = window.checkedValues[classifiers[k]]
    if(selectedCategories.length > 0){
      var filteredData = filteredData.filter(i => selectedCategories.indexOf(i[classifiers[k]].toString()) !== -1)
    }
  }
  return(filteredData)
}

//Filter out group with only missing values
function _filterNull(yAxis, labels){
  
  //Removes category with only missing values
  var newY = []
  var newL = []
  for(t in yAxis){
    var all0 = yAxis[t].every(i => isNaN(i) || i === null)
    if(all0 === false){
      newY.push(yAxis[t])
      newL.push(labels[t])
    }
  } 
     
  return [newY, newL]
}

//Removes x Axis and labels with only missing values
function _removeNullColumns(yAxis, xAxis, labels){
  
  //Identifies which columns have only 0 values
  var columns = []
  for(a in yAxis[0]){
    var column = []
    for(t in yAxis){
      column.push(yAxis[t][a])
    }
    columns.push(column)
  }

  var columnsToKeep = []
  for(k in columns){
    var all0 = columns[k].every(l => isNaN(l) || l === null)
    if(all0 === false){
      columnsToKeep.push(Number(k))
    }
  }
  
  for(k in yAxis){
    yAxis[k] = columnsToKeep.map((item) => yAxis[k][item])
  }

  xAxis = columnsToKeep.map((item) => xAxis[item])

  return [yAxis, xAxis, labels]
}

function nullsOut(yAxis, xAxis, labels){
    var [yAxis, labels] = _filterNull(yAxis, labels)
    var [yAxis, xAxis, labels] = _removeNullColumns(yAxis, xAxis, labels)
    return [yAxis, xAxis, labels]
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

//Receives filtered (by checkbox selector) data and returns list of lists
//where each list contains values of yAxis separated. Group selected
//determines what category will be used to separate yAxis
function separateDataInGroups(filteredData, groupSelected, checkedValues){
  var yAxis = []
  var labels = []
  for(k in window.checkedValues[groupSelected]){
    var group = filteredData.filter(i => i[groupSelected] == window.checkedValues[groupSelected][k])
    var y = [group.map(i => i.value)]
    yAxis.push(y[0])
    labels.push(window.checkedValues[groupSelected][k])
  }
  return [yAxis, labels];
}

module.exports = {
  filterDataByCheckBox,
  _filterNull,
  _removeNullColumns,
  nullsOut,
  onlyUnique,
  separateDataInGroups
}

},{}],4:[function(require,module,exports){
function documentAppender(element, html){
	var div = document.createElement('div');
	div.innerHTML = html;
	while (div.children.length > 0) {
	    element.appendChild(div.children[0]);
	}
}

//nMulticlassClassifiers is the length of the output from function pickMultiClassCategories
//Function renders spaces for 3 graphs if multiclass, and space for 1 graph if single class
function renderGraphBoxes(nMulticlassClassifiers, map=true){
  var html = ''
  if(nMulticlassClassifiers == 2){
    html += '<div class="row" id="mainGraphs">'+
             '<div class="column graphBox" id="box">'+
               '<canvas id="myChart"></canvas>'+
               '<button id="downloadButton"><i class="fa fa-download" aria-hidden="true"></i></button>'+
              '</div>'+
              '<div class="column graphBox" id="box1">'+
               '<canvas id="myChart1"></canvas>'+
               '<button id="downloadButton"><i class="fa fa-download" aria-hidden="true"></i></button>'+
              '</div>'+
           '</div>'+
           '<div class="row" id="pieChartsContainer">'+
           '<div class="column graphBox3" id="box2">'+
              '<button id="downloadButton"><i class="fa fa-download" aria-hidden="true"></i></button>'+
           '</div>'+
           '<div class="column graphBox3" id="box3">'+
              '<button id="downloadButton"><i class="fa fa-download" aria-hidden="true"></i></button>'+
           '</div>'+
           '<div class="column graphBox3" id="box4">'+
              '<button id="downloadButton"><i class="fa fa-download" aria-hidden="true"></i></button>'+
           '</div>'+
           '</div>'+
           '</div>'
  } 
  if(nMulticlassClassifiers == 1){
    html += '<div class="row" id="mainGraphs">'+
               /*Locally changing width to 100%. Think of more general solution*/
               '<div class="column graphBox" id="box" style="width: 100%; height: 100%">'+
                  '<canvas id="myChart"></canvas>'+
                  '<button id="downloadButton"><i class="fa fa-download" aria-hidden="true"></i></button>'+
               '</div>'+
             '</div>'+
             '<div class="row" id="pieChartsContainer">'+
                '<div class="column graphBox3" id="box2">'+
                  '<button id="downloadButton"><i class="fa fa-download" aria-hidden="true"></i></button>'+
                '</div>'+
                '<div class="column graphBox3" id="box3">'+
                  '<button id="downloadButton"><i class="fa fa-download" aria-hidden="true"></i></button>'+
                '</div>'+
                '<div class="column graphBox3" id="box4">'+
                  '<button id="downloadButton"><i class="fa fa-download" aria-hidden="true"></i></button>'+
                '</div>'+
             '</div>'+
             '</div>'
  }
  if(nMulticlassClassifiers < 1) {
    html = '<div class="row">'+
              '<div class="graphSingleBox" id="box">'+
              '<canvas id="myChart"></canvas>'+
              '<div id="downloadButton"><i class="fa fa-downlad" aria-hidden="true"></i></div>'+
              '</div>'+
           '</div>'
  }
  document.getElementById("graphsContainer").innerHTML = html
}

function generatePieChartsContainers(nPieCharts){
  var htmlPieCharts = '';
  for (var i = 2; i < nPieCharts+2; i++){
    htmlPieCharts += '<div class="column graphBox3" id="box' + i + '">'+
                     '<canvas id="myChart' + i + '"></canvas>'+
                     '<button id="downloadButton"><i class="fa fa-download" aria-hidden="true"></i></button>'+
                     '</div>'
  }
  document.getElementById("pieChartsContainer").innerHTML = htmlPieCharts
}

//Initiate html of TT
async function initiateDashboard(title, logo, renderMap = false, flipperButton = false, textTranslations, language){

  var bodyHTML = '<body>'+
      '<div id="dimmer"></div>'+
      '<div class="header" id="header">'+
        '<img id="logo" src="' + logo + '">'+
        '<div id="title">' + title + '</div>'+
      '</div>'+

      '<!-- Box on top of everything. Selects classifiers -->'+
      '<div id="boxTop">'+
      '</div>'+
      '<!-- Box on top of everything. Selects classifiers -->'

  if(renderMap){
    bodyHTML += '<!-- Box on top of everything. Shows graph based on map hover -->'+
      '<div id="boxTopMap">'+
      '</div>'+
      '<div id="tip-container">'+
        '<div id="popup-tip"></div>'+
      '</div>'+
      '<!-- Box on top of everything. Shows graph based on map hover -->'+

      '<div class="row">'
        //'<div class="column statisticsSelector" id="statisticsSelector">'+
            //'<div class="dropdown">'+
              //'<button class="dropbtn">Select year</button>'+
              //'<div id="dropdown-content"></div>'+
            //'</div>'+
            //'<div id="showRegionHover"></div>'+
        //'<div id="selector-map"></div>'+
        //'</div>'
  }
  if(textTranslations){
    bodyHTML += 
      '<div id="mapAndGraphWrap">'+
      '<div class="column dimensionSelector" id="dimensionSelector">'+
      '<button class="displayBoxButton" id="selectDimensionButton"><i class="fa fa-filter" aria-hidden="true"></i> ' + textTranslations['selectors']['filter'][language] + '</button>'
  } else {
    bodyHTML += '<div class="column dimensionSelector" id="dimensionSelector">'+
      '<button class="displayBoxButton" id="selectDimensionButton"><i class="fa fa-filter" aria-hidden="true"></i> Filter</button>'
  }

  if(flipperButton){
    if(textTranslations){
      bodyHTML += '<button id="previousDependent"><i class="fa fa-arrow-circle-left"></i> ' + textTranslations['selectors']['previous'][language] + '</button>'+
                  '<button id="nextDependent">' + textTranslations['selectors']['next'][language] + ' <i class="fa fa-arrow-circle-right"></i></button>'
    } else {
      bodyHTML += '<button id="previousDependent"><i class="fa fa-arrow-circle-left"></i>Previous</button>'+
                  '<button id="nextDependent">Next<i class="fa fa-arrow-circle-right"></i></button>'
    }
  }
  
  if(textTranslations){
    bodyHTML += '<button id="shareDashboardButton" onclick=SmartDasher.shareDashboard("url")>' + textTranslations['selectors']['shareURL'][language] + ' <i class="fa fa-share-alt" aria-hidden="true"></i></button>'+
                '<button id="embed" onclick=SmartDasher.shareDashboard("embed")>' + textTranslations['selectors']['embedURL'][language] + ' <i class="fa fa-share-alt" aria-hidden="true"></i></button>'+
                '<button id="goBackSelection">' + textTranslations['selectors']['backToSelection'][language] + ' <i class="fa fa-hand-o-left" aria-hidden="true"></i></button>'+
                '</div>'
  } else {
    bodyHTML += '<button id="shareDashboardButton" onclick=SmartDasher.shareDashboard("url")>Share URL <i class="fa fa-share-alt" aria-hidden="true"></i></button>'+
                '<button onclick=SmartDasher.shareDashboard("embed")>Embed URL <i class="fa fa-share-alt" aria-hidden="true"></i></button>'+
                '<button id="goBackSelection">Back to selection <i class="fa fa-hand-o-left" aria-hidden="true"></i></button>'+
                '</div>'
  }

  if(renderMap){
    bodyHTML += '<div id="graphMapBoxes">'
    bodyHTML += '<div id="mapBox"></div>'
  }
  bodyHTML += '<div id="selectedVariables"></div>'
  bodyHTML += '<div class="column graphsBox" id="graphsContainer">Graphs</div>'
  bodyHTML += '</div>' //Close graphMapBoxes
  if(renderMap){
    bodyHTML += '</div>' //Close mapAndGraphWrap
  }
  bodyHTML += '</div>'

  if(textTranslations){
    //bodyHTML += '<div id="footer"><div id="footerText">' + textTranslations['source']['source'][language] + '</div></div>'
  } else {
    //bodyHTML += '<div id="footer"><div id="footerText">Source:</div></div>'
  }

	documentAppender(document.body, bodyHTML)

  document.getElementById("selectDimensionButton").onclick = function(){
    SmartDasher.showBoxSelector("dimmer");
    SmartDasher.showBoxSelector("boxTop");
  }

  if(renderMap === false){
    document.getElementById("graphsContainer").style.width = '100vw'
    document.getElementById("dimensionSelector").style.width = '100vw'
    if(document.getElementById("graphSingleBox") !== null){
      document.getElementsByClassName("graphSingleBox").style.width = '100vw'
    }
  }
  console.log("Rendered all boxes")
}

module.exports = {
  documentAppender,
  renderGraphBoxes,
  generatePieChartsContainers,
  initiateDashboard
}




},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
function styleGen(feature, codesIn, regionDivision){
    var regionCode = feature.properties[regionDivision]
    var available = codesIn.indexOf(regionCode) == -1;
    if(feature.properties.data === undefined){
      return {fillColor: "gray",
              weight: 1}
    }
    if(available){
      return {fillColor: "#989898",
              weight: 1}
    }
}

async function loadArea(url) {
  const response = await fetch(url);
  const names = await response.json();
  return(names); 
} 

function showUnderliningMap(baseTile){
  if(baseTilePresent == false){
    baseTile.addTo(map);
    document.getElementById('selector-map').innerHTML = '<button id="showMap" onclick="showUnderliningMap(baseTile)">Hide underlining map</button>'
  } else {
    document.getElementById('selector-map').innerHTML = '<button id="showMap" onclick="showUnderliningMap(baseTile)">Show underlining map</button>'
    map.removeLayer(baseTile);
  }
  window.baseTilePresent = baseTilePresent == false  
}

async function drawMap(url, regionDivision, regionsIn, statistics, map, zoom = 4.7, labels = null){

  function hoverBox(e) { //Function generates box over each hovered region

      var hiddenDiv = document.getElementById("boxTopMap")

      var layer = e.target;
      var regionHovered = e.target.feature.properties[regionDivision] //Getting current hovered region code

      //Updating external box on hover
      var regionHovered = e.target.feature.properties['name'] //Getting current hovered region code
    
      //Data is accessible here. If map region not selected, code throws error
      var currentTarget = e.target.feature.properties['data']

      if(currentTarget !== undefined){
        var stat = currentTarget.map(i=>i.value)
        console.log("I am valid")
        showBoxSelector("boxTopMap")
        showBoxSelector("tip-container")
        hiddenDiv.innerHTML = stat

        var group1 = window.multiClassClassifiers[1]
        var xAxisName1 = window.multiClassClassifiers[0]

        var [yAxis1, labels1] = separateDataInGroups(currentTarget, group1, checkedValues)
        var xAxis1 = window.checkedValues[xAxisName1]

        var [yAxis1, xAxis1, labels1] = nullsOut(yAxis1, xAxis1, labels1)

        if(labels){
          var xAxis1 = xAxis1.map(i => labels[0]['subLabels'][xAxisName1][i])
          var labels1 = labels1.map(i => labels[0]['subLabels'][group1][i])
          var group1Label = labels[0]['classifiers'][group1]
        }

        var randomColors1 = colorGenerator(yAxis1);
        hiddenDiv.innerHTML = '<canvas id="box5"></canvas>'
        console.log(yAxis1)
        if(yAxis1[0].length <= 2){
          graphCustom(xAxis1, yAxis1, labels1, "box5", "bar", "Showing " + group1Label + " for " + regionHovered, randomColors1)
        } else {
          graphCustom(xAxis1, yAxis1, labels1, "box5", "line", "Showing " + group1Label + " for " + regionHovered, randomColors1)
        }
      }
      document.getElementById("mapInfo").innerHTML = regionHovered
      //End of updating external box on hover
  }
  
  function applyMousePositionToBox(e){
    var hiddenDiv = document.getElementById("boxTopMap")
    var tip = document.getElementById("tip-container")
    if(e.target.feature.properties.data){
      x = e.containerPoint['x']
      y = e.containerPoint['y']
      hiddenDiv.style.left = x - 8 + 'px'
      hiddenDiv.style.top = y - 180 + 'px'

      tip.style.left = x + 10 + 'px'
      tip.style.top = y + 96 + 'px'
    }
  }

  function resetHighlight(e) {
      tilesLayer.resetStyle(e.target);

      var currentTarget = e.target.feature.properties['data']
      if(currentTarget !== undefined){
        showBoxSelector("boxTopMap")
        showBoxSelector("tip-container")
      }
  }

  function onEachFeature(feature, layer) {
      layer.on({
        mouseover: hoverBox,
        mouseout: resetHighlight,
        mousemove: applyMousePositionToBox,
      });
       
  }
  
  //Rename TT region codes
  function renameOne(regionCode){
      if(regionCode < 10){
        return("0" + regionCode.toString())
      } else {
        return(regionCode.toString())
      }
  }

  function assignValueToGeoJsonObject(geoJSONObject, filteredDataForMap, regionDivision, regionsIn){
    for(i in regionsIn){
      try {
        var value = Object.values(filteredDataForMap).filter(k=> renameOne(k[regionDivision]) == regionsIn[i])
      }
      catch (e) {
        var value = Object.values(filteredDataForMap).filter(k=> k[regionDivision] == regionsIn[i])
      }
      for(k in Object.values(geoJSONObject.features)){
        var regionMatches = geoJSONObject.features[k].properties[regionDivision] == regionsIn[i]
        if(regionMatches){ //Assign statistics value
          geoJSONObject.features[k].properties['data'] = value // this should not be here, but a separate function instead
        }
      }
    }
    return(geoJSONObject)
  }

  if(window.map === undefined){
    console.log("initiating map")
    //Initiate base map
    window.map = L.map("mapBox", {zoomSnap: 0.1}).setView(centering, zoom);

    var baseTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })

    var baseTilePresent = false;
    window.map.options.minZoom = 4;

    var tilesLayer;
    if(typeof(url) === 'string'){
      var geoJSON = await loadArea(url);
    } else {
      var geoJSON = url
    }
    var geoJSON = assignValueToGeoJsonObject(geoJSON, statistics, regionDivision, regionsIn)
    console.log(geoJSON)
    var tilesLayer = L.geoJSON(geoJSON, {
          style: function(feature){ return( styleGen(feature, regionsIn, regionDivision) )},
          onEachFeature: onEachFeature
        }).addTo(window.map);
  } else {
    console.log("removing")
    window.map.remove()
    window.map = L.map("mapBox", {zoomSnap: 0.1}).setView(centering, zoom);

    var baseTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })

    var baseTilePresent = false;
    window.map.options.minZoom = 4;

    var tilesLayer;
    if(typeof(url) === 'string'){
      var geoJSON = await loadArea(url);
    } else {
      var geoJSON = url
    }
    var geoJSON = url
    var geoJSON = assignValueToGeoJsonObject(geoJSON, statistics, regionDivision, regionsIn)
    var tilesLayer = L.geoJSON(geoJSON, {
          style: function(feature){ return( styleGen(feature, regionsIn, regionDivision) )},
          onEachFeature: onEachFeature
        }).addTo(window.map);
  }

}

module.exports = {
  styleGen,
  loadArea,
  showUnderliningMap,
  drawMap
}

},{}],7:[function(require,module,exports){
//Creates dropdown selectors for order of Sankey nodes. Classifiers are the available classifiers (vuosi_, tuotantosunta, etc...)
function sankeyControls(classifiers){
    Number.prototype.mod = function (n) {
      return ((this % n) + n) % n;
    };
    var html = '' 
    for(j in classifiers){
      html +=  '<select class="dropdown-btn" id="dropdown-btn' + j + '" onchange="verifySankeyOrder(orderClassifiers)">'
      html += '<option value="' + classifiers[j] + '">' + classifiers[j] + '</option>'
      var firstOption = classifiers[j]
      for(k in classifiers){
        var classifierIndex = Number(Number(k)+1)
        if(classifiers[classifierIndex.mod(3)] !== firstOption){
          html += '<option value="' + classifiers[classifierIndex.mod(3)] + '">' + classifiers[classifierIndex.mod(3)] + '</option>'
        }
      }
      html += '</select>'
    }
    document.getElementById("dimensionSelector").innerHTML += '<div id="sankeyControler"></div>'
    document.getElementById("sankeyControler").innerHTML = html
}

//Verifies which values were selected and assigns it to the global variable orderClassifiers
function verifySankeyOrder(orderClassifiers) {
  var zero = document.getElementById("dropdown-btn0");
  var one = document.getElementById("dropdown-btn1");
  var two = document.getElementById("dropdown-btn2");

  window.orderClassifiers = [zero.options[zero.selectedIndex].value, one.options[one.selectedIndex].value, two.options[two.selectedIndex].value]
}

//Generates connection data for sankey graphs. dependentName is the name of dependent variable ('dependentVariable'). 
//LevelsDependent are the subClassifier levels of the dependent varialbe (income, expenditure). Value field is the json key holding the value to be plotted
//From is the name of the selected classifier (e.g., vuosi_)

//IMPORTANT: Function works, but it assumes that, for each level of the dependentVariable (the expenditure names will be different)
//For instance, income (venda de gado, venda de galinha), outcome (racao de gado, racao de galinha). Isso não é o caso nesse report
//de agora, porque precisamos juntar dois reports from ED.
function connectionGenerator(dependentName, levelsDependent, from, valueField, labels)  {
  var filteredData1 = data.filter(i=> i[dependentName] == levelsDependent[0])
  if(labels){
    var filteredData1 = filteredData1.map(i=> ({'from': labels[0]['subLabels'][from][i[from]], 'to': i[dependentName], 'weight': i[valueField] }))
  } else {
    var filteredData1 = filteredData1.map(i=> ({'from': i[from], 'to': i[dependentName], 'weight': i[valueField] }))
  }
  if(levelsDependent.length == 2){
    var filteredData2 = data.filter(i=> i[dependentName] == levelsDependent[1])
    if(labels){
      var filteredData2 = filteredData2.map(i=> ({'from': levelsDependent[0], 'to': labels[0]['subLabels'][from][i[from]] + ' ' + levelsDependent[1], 'weight': i[valueField] }))
    } else {
      var filteredData2 = filteredData2.map(i=> ({'from': levelsDependent[0], 'to': i[from], 'weight': i[valueField] }))
    }
    filteredData1 = filteredData1.concat(filteredData2)
  }
  return(filteredData1)
}

module.exports = {
  sankeyControls,
  verifySankeyOrder,
  connectionGenerator
}

},{}],8:[function(require,module,exports){
function copyText(text){
  const cb = navigator.clipboard;
  cb.writeText(text).then(() => alert('Copied to clipboard'));
}

function shareDashboard(which){
  var url = new URL(location.href)  
  var checkedString = '?set=' + JSON.stringify(checkedValues) //bug here. Parameters stacking together
  var url = url + checkedString
  if(which === 'embed'){
    var embedURL = '<iframe type="text/html" style="resize: both" src=' + url + '&embed=true' + '></iframe>'
    copyText(embedURL)
  } else {
    copyText(url)
  }
}

function checkBoxesFromUrl(){
  var urlParameters = window.location.search
  var searchObject = new URLSearchParams(urlParameters);
  var hasParameters = searchObject.has('set')
  if(hasParameters){
    var checkedValues = searchObject.get('set')
    return JSON.parse(checkedValues)
  } else {
    return false
  }
}

//Hides header and selectors for embedded URL
function hideSelectors(){
  var urlParameters = window.location.search
  var searchObject = new URLSearchParams(urlParameters);
  var toEmbed = searchObject.has('embed')
  if(toEmbed){
    document.getElementById("dimensionSelector").style.display = "none"
    document.getElementById("header").style.display = "none"
    document.getElementById("graphsContainer").style.height = '100vh'
    var mainCharts = Array.from(document.getElementsByClassName("graphBox"))
    var pieCharts = Array.from(document.getElementsByClassName("graphBox3"))
    mainCharts.map(i=>i.style.height = '50vh')
    pieCharts.map(i=>i.style.height = '40vh')
  }
}

module.exports = {
  copyText,
  shareDashboard,
  checkBoxesFromUrl,
  hideSelectors
}

},{}]},{},[1])(1)
});
