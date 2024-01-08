//Initialize the map to offer a decent view of most of the data points
let myMap = L.map("map", {center: [0,0], zoom: 3});

//Add the OpenStreetMap tile layer 
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);

//Store the url for the JSON containing info for "All Earthquakes for the Past 7 Days"
let earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Create function to implement dynamic sizing for markers based on magnitude
function markerSize(mag)
{
    if(mag <= 0)
        return 1;
    else
        return mag*30000;
}

//Create function to implement dynamic colors for markers based on depth
function markerColour(depth)
{
    if(depth >= -10 & depth <10)
        return "yellow";
    else if(depth >= 10 & depth <30)
        return "yellowgreen";
    else if(depth >=30 & depth <50)
        return "green";
    else if(depth >= 50 & depth <70)
        return "blue";
    else if(depth >= 70 & depth <90)
        return "indigo";
    else if(depth >= 90)
        return "black";
}

//Connect to the JSON, and if a connection is established, execute the following commands
d3.json(earthquakeData).then(
    data => {
        let features = data.features;
        //For each earthquake listed in the JSON
        for(let i=0; i < features.length; i++)
        {
            //Store relevant information in variables
            let coord = [features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]];
            let mag = features[i].properties.mag;
            let depth = features[i].geometry.coordinates[2];
            let place = features[i].properties.place;
            //If a magnitude is listed for the earthquake, then
            if(mag)
            {
                //Draw a circle marker on the map that has a black outline, 
                //a fill color determined by the depth, and a radius determined
                //by the magnitude
                L.circle(coord, {
                    color: "black",
                    fillColor:  markerColour(depth),
                    fillOpacity: 0.8,
                    radius: markerSize(mag)
                })
                //Add a popup that lists the location, magnitude, and depth of each earthquake in JSON
                .bindPopup(`<center><h2>${place}</h2><hr><p>Magnitude: ${mag}</p><p>Depth: ${depth}</p></center>`)
                .addTo(myMap);
            }

        }
    }
)

//Set up the framework for the legend
let legend = L.control(
    { position: 'bottomright' }
    );

// Add the information required to populate the legend
legend.onAdd = function () {
    //Draw the legened onto the map
    let div = L.DomUtil.create('div', 'info legend');
    //Define the ranges at which colors change
    let depthBins = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
    //Define the colors on the legend
    let colors = ["yellow", "yellowgreen", "green", "blue", "indigo", "black"];

    // Loop through each defined depth range and produce a label displaying the color and the range
    for (let i = 0; i < depthBins.length; i++) 
    {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' + depthBins[i]+ '<br>'; 
    }

    return div;
};

// Add the legend to the map
legend.addTo(myMap);


