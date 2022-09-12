//Function extracts options associated with each category within the data
function extractCategoriesAndOptions(data, dependentVariableName){

  var classifiers = Object.keys(data[0]) //Extract classifier names (e.g., year, size, etc...)
  var classifiers = classifiers.filter(i => i !== dependentVariableName) //Remove value, which is what we want to plot

  var options = []
  for(k in classifiers){
    var a = data.map(i=>i[classifiers[k]])
    var a = a.filter(onlyUnique)
    options.push(a)
  }
  var options = options.filter(i=> i[0] !== undefined)
  return [classifiers, options]
}

//Generates checkboxes for dimension selection
function generateCheckBoxes(classifiers, options, data, dependentVariable, labels = null, textTranslations = null, language, whereAppend = 'boxTop'){
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

  var boxSelector = document.getElementById("boxTop")
  var headerSelector = document.getElementById("categorySelectorHeader")
  dragElement(boxSelector, headerSelector);

}

//Changes style of checkBox container. Now it appears in front of everything
function showBoxSelector(id){
  var divToChange = document.getElementById(id)
  console.log(divToChange)
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
function onlyOneEnforcer(classifiers, checkedValues, data, filterFunction, textTranslations){
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
            document.getElementById(classifiers[k] + 'Label' + "SingleMultiple").innerHTML = '<font color="blue"> (' + textTranslations['checkboxes']['singleSelector'][language] + ') <button id="howToButton"><i class="fa fa-question-circle" aria-hidden="true"></i></button> </font>' //Add text saying that this category is multiple selector
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
function checkBoxVerificationSystem(classifiers, checkedValues, data, filterFunction, exception = null, textTranslations = null){

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
          document.getElementById(classifiers[k] + 'Label' + "SingleMultiple").innerHTML = '<font color="blue"> (' + textTranslations['checkboxes']['multipleSelector'][language] + ') </font><p><input type="checkbox" id="selectAll" onclick=multiCheck("' + classifiers[k] + '")></input><div id="selectAllText">' + textTranslations['checkboxes']['all'][language] + ' <i class="fa fa-arrow-right" aria-hidden="true"></i></div></p>' //Add text saying that this category is multiple selector
        } else {
          document.getElementById(classifiers[k] + 'Label' + "SingleMultiple").innerHTML = '<font color="blue"> (Multiple selector) </font><p><input type="checkbox" id="selectAll" onclick=multiCheck("' + classifiers[k] + '")></input><div id="selectAllText">All <i class="fa fa-arrow-right" aria-hidden="true"></i></div></p>' //Add text saying that this category is multiple selector
        }
      }
    }
    for(j in allCheckBoxes){
      allCheckBoxes[j].onclick = function(){
        checkedValues = mergeVerifyCheckedBoxes(classifiers)
        onlyOneEnforcer(classifiers, checkedValues, data, filterFunction, textTranslations)
        checkBoxVerificationSystem(classifiers, checkedValues, data, filterFunction, exception, textTranslations)
        
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
    multi.map(i => multiCheck(i))
    single.map(i => singleCheck(i))
    
    var allNull = filteredData.filter(i=> i.value !== null && i.value !== 0)

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
