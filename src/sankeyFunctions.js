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
