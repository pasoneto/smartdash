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
