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
