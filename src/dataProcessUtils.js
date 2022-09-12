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
