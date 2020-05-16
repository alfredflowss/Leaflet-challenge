//store API endpoint inside querlurl 
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//perform get request 
d3.json(url, function(data){
    createpopup(data.features)
});

function createpopup(data) {
    
    //create popup on hoover 
    function onEachhoover(feature, layer) {
        layer.bindPopup("<h3>" + features.properties.place + "</h3><br><p>" 
        + new Date(features.properties.time) + "</p>");
    };

    //run the on each hoover for each iarray
    var earthquakes =  L.geoJSON(data, {
        onEachFeature : onEachhoover 
    });    

    createmap(data);
};

function createmap