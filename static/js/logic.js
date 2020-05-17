//store API endpoint inside querlurl 
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//perform get request 
d3.json(url, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createpopup(data.features);
  });

function createpopup(data) {
    
    //create popup on hoover 
    function onEachhoover(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><br><p>" 
        + new Date(feature.properties.time) + "</p>");
    };

    //select color based of magnitude 
    function switchcolor(mag) {
        switch (true) {
        case (mag < 1):
          return "green";
        case (mag < 2):
            return "lime";
        case (mag < 3):
            return "yellow";
        case (mag < 4):
            return "orange";
        case (mag < 5):
            return "red";
        default:
          return "red";
        };
    }; 

    //create circles func
    function createCircleMarker(feature,latlng){
        let options = {
            radius:feature.properties.mag*5,
            fillColor: switchcolor(feature.properties.mag),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
        }
        // console.log(latlng);
        return L.circleMarker(latlng, options);

    }

    var data =  L.geoJSON(data, {
        onEachFeature : onEachhoover,
        pointToLayer: createCircleMarker

    });    

    console.log(data); 
    createmap(data);
};

function createmap(data) {
    //adding street maps
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
      });

      var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
      });

      var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
      };
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: data
    };
    //console.log(data)
    var myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, data]
      });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Set up the legend
    var limits = ["0-1","1-2","2-3","3-4","5+"]
    var colors =["green","lime","yellow","orange","red"]
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var labels = [];

        // Add legend header
        var legendInfo = "<h1>Magnitude</h1>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " 
                + colors[index] + "\">" +"Mag " + limits[index] + "</li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);
    };