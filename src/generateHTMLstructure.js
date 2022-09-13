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
               '</div>'+
               '<div class="column graphBox" id="box1">'+
               '<canvas id="myChart1"></canvas>'+
               '</div>'+
           '</div>'+
           '<div class="row" id="pieChartsContainer">'+
             '<div class="column graphBox3" id="box2"></div>'+
             '<div class="column graphBox3" id="box3"></div>'+
             '<div class="column graphBox3" id="box4"></div>'+
           '</div>'+
           '</div>'
  } 
  if(nMulticlassClassifiers == 1){
    html += '<div class="row" id="mainGraphs">'+
               /*Locally changing width to 100%. Think of more general solution*/
               '<div class="column graphBox" id="box" style="width: 100%">'+
                 '<canvas id="myChart"></canvas>'+
               '</div>'+
             '</div>'+
             '<div class="row" id="pieChartsContainer">'+
               '<div class="column graphBox3" id="box2"></div>'+
               '<div class="column graphBox3" id="box3"></div>'+
               '<div class="column graphBox3" id="box4"></div>'+
             '</div>'+
             '</div>'
  }
  if(nMulticlassClassifiers < 1) {
    html = '<div class="row">'+
              '<div class="graphSingleBox" id="box">'+
              '<canvas id="myChart"></canvas>'+
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

      '<div class="row">'+
        '<div class="column statisticsSelector" id="statisticsSelector">'+
            '<div class="dropdown">'+
              '<button class="dropbtn">Select year</button>'+
              '<div id="dropdown-content"></div>'+
            '</div>'+
            '<div id="showRegionHover"></div>'+
      //'<div id="selector-map"></div>'+
      '</div>'
  }
  if(textTranslations){
    bodyHTML += '<div class="column dimensionSelector" id="dimensionSelector">'+
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
    bodyHTML += '<button id="shareDashboardButton" onclick=Smartdasher.shareDashboard("url")>' + textTranslations['selectors']['shareURL'][language] + ' <i class="fa fa-share-alt" aria-hidden="true"></i></button>'+
                '<button id="embed" onclick=Smartdasher.shareDashboard("embed")>' + textTranslations['selectors']['embedURL'][language] + ' <i class="fa fa-share-alt" aria-hidden="true"></i></button>'+
                '<button id="goBackSelection">' + textTranslations['selectors']['backToSelection'][language] + ' <i class="fa fa-hand-o-left" aria-hidden="true"></i></button>'+
                '</div>'
  } else {
    bodyHTML += '<button id="shareDashboardButton" onclick=Smartdasher.shareDashboard("url")>Share URL <i class="fa fa-share-alt" aria-hidden="true"></i></button>'+
                '<button onclick=Smartdasher.shareDashboard("embed")>Embed URL <i class="fa fa-share-alt" aria-hidden="true"></i></button>'+
                '<button id="goBackSelection">Back to selection <i class="fa fa-hand-o-left" aria-hidden="true"></i></button>'+
                '</div>'
  }

  if(renderMap){
    bodyHTML += '<div class="column mapBox" id="mapBox">'+
                '</div>'
  }
  bodyHTML += '<div id="selectedVariables"></div>'
  bodyHTML += '<div class="column graphsBox" id="graphsContainer">'+
          'Graphs'+
        '</div>'+
      '</div>'

  if(textTranslations){
    bodyHTML += '<div id="footer"><div id="footerText">' + textTranslations['source']['source'][language] + '</div></div>'
  } else {
    bodyHTML += '<div id="footer"><div id="footerText">Source:</div></div>'
  }

	documentAppender(document.body, bodyHTML)

  document.getElementById("selectDimensionButton").onclick = function(){
    Smartdasher.showBoxSelector("dimmer");
    Smartdasher.showBoxSelector("boxTop");
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
