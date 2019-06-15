var myMap = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 5
});


L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  }).addTo(myMap);

  var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  function colorPicker(magnitude) {
    if (magnitude > 5) {
        return '#ff0000';
    }
    else if (magnitude >= 4 && magnitude <= 5) {
        return '#ff4500'    
    }
    else if (magnitude >= 3 && magnitude <= 4) {
        return '#ffa500'    
    }
    else if (magnitude >= 2 && magnitude <= 3) {
        return '#ffd700'    
    }
    else if (magnitude >= 1 && magnitude <= 2) {
        return '#ffff00'    
    }
    else if (magnitude >= 0 && magnitude <= 1) {
        return '#00ff00'    
    }
    else {
        return '#ffffff'
    }
  }

    // Function to adjust marker radius based on magnitude value 

    function markerSize(magnitude) {
        return magnitude * 25000;
    }

    // Grab the data with d3

    d3.json(link, function(data){
        var features = data.features;

        for(var i = 0; i < features.length; i++) {

            L.circle([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]], {
                fillOpacity: 0.75,
                color: "#404040",
                weight: 0.5,
                fillColor: colorPicker(features[i].properties.mag),
                radius: markerSize(features[i].properties.mag),
            }).bindPopup("<h3>" + features[i].properties.title + "</h3><hr><h3><center>" + features[i].properties.mag + " ML</center></h3>").addTo(myMap);
        }

        // Create a legend and add it to the map
        var legend = L.control({position: "bottomright"});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
              grades = [0, 1, 2, 3, 4, 5],
              labels = [];
       
            // Loop through our magnitude intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                  '<i style="background:' +  colorPicker(grades[i]) + '"></i> ' +
                  grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
       
            return div;
          };
       
          // Add the legend to the map
          legend.addTo(myMap);

    });