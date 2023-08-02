// MAP

var map, geojson;

//Add Basemap
var map = L.map("map", {}).setView([18.55, 73.85], 10, L.CRS.EPSG4326);

var googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"]
  }
);

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  }
);

// <!-- -----------------layer displayed------------------------ -->
var baseLayers = {
  SImagery: Esri_WorldImagery,
  GoogleImage: googleSat,
  OSM: osm
};

var wms_layer = L.tileLayer.wms(
  "http://localhost:8080/geoserver/postgresql/wms",
  {
    layers: "postgresql:VILLAGE_BOUNDARY",
    format: "image/png",
    transparent: true,
    version: "1.1.0",
    attribution: "VILLAGE_BOUNDARY"
  }
);

var wms_layer2 = L.tileLayer.wms(
  "http://localhost:8080/geoserver/postgresql/wms",
  {
    layers: "postgresql:revenue_new",
    format: "image/png",
    transparent: true,
    version: "1.1.0",
    attribution: "revenue_new"
  }
);

wms_layer.addTo(map);
var WMSlayers = {
  VILLAGE_BOUNDARY: wms_layer,
  revenue_new: wms_layer2

};

var control = new L.control.layers(baseLayers, WMSlayers).addTo(map);

//!-- popup -->

// map.on("contextmenu", e => {
//   let size = map.getSize();
//   let bbox = map.getBounds().toBBoxString();
//   let layer = "DP:Modification_Overlay";
//   let style = "DP:Modification_Overlay";
//   let urrr = `http://portal.tcplgeo.com:8080/geoservers/DP/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=${layer}&STYLES&LAYERS=${layer}&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=${Math.round(
//     e.containerPoint.x
//   )}&Y=${Math.round(
//     e.containerPoint.y
//   )}&SRS=EPSG%3A4326&WIDTH=${size.x}&HEIGHT=${size.y}&BBOX=${bbox}`;

//   // you can use this url for further processing such as fetching data from server or showing it on the map

//   if (urrr) {
//     fetch(urrr).then(response => response.json()).then(html => {
//       var htmldata = html.features[0].properties;
//       let keys = Object.keys(htmldata);
//       let values = Object.values(htmldata);
//       let txtk1 = "";
//       var xx = 0;
//       for (let gb in keys) {
//         txtk1 +=
//           "<tr><td>" + keys[xx] + "</td><td>" + values[xx] + "</td></tr>";
//         xx += 1;
//       }
//       let detaildata1 =
//         "<div style='max-height: 350px;  overflow-y: scroll;'><table  style='width:70%;' class='popup-table' >" +
//         txtk1 +
//         "<tr><td>Co-Ordinates</td><td>" +
//         e.latlng +
//         "</td></tr></table></div>";

//       L.popup().setLatLng(e.latlng).setContent(detaildata1).openOn(map);
//     });
//   }
// });


//<!-- googleEarth popup -->

map.on("dblclick", function(e) {
  var lat = e.latlng.lat.toFixed(15);
  var lng = e.latlng.lng.toFixed(15);
  // console.log(lat, lng)
  var popupContent =
    '<a href="https://earth.google.com/web/search/' +
    lat +
    "," +
    lng +
    '" target="_blank">Open in Google Earth</a>';
  L.popup().setLatLng(e.latlng).setContent(popupContent).openOn(map);
});

//_______________________________Draw control____________________________________
var polyline = L.polyline([], {
  color: "red"
});
var polygon = L.polygon([], {
  color: "red"
});
var circle = L.circle([], {
  color: "red"
});
var coordinates = [];

var editableLayers = new L.FeatureGroup(); // add the polyline to the FeatureGroup
map.addLayer(editableLayers);

var drawPluginOptions = {
  position: "topright",
  draw: {
    polygon: {
      allowIntersection: true, // Restricts shapes to simple polygons
      shapeOptions: {
        dashArray: "2, 5",
        color: "red"
      }
    },

    polyline: {
      allowIntersection: true, // Restricts shapes to simple polylines
      shapeOptions: {
        dashArray: "2, 5",
        color: "red"
      }
    },

    circle: {
      allowIntersection: true, // Restricts shapes to simple polylines
      shapeOptions: {
        dashArray: "2, 5",
        color: "red"
      }
    },
    // disable toolbar item by setting it to false
    // Turns off this drawing tool
    rectangle: false,
    marker: false
  },
  edit: {
    featureGroup: editableLayers, //REQUIRED!!
    remove: true
  }
};

//****************** */ Initialise the draw control and pass it the FeatureGroup of editable layers*************************
var drawControl = new L.Control.Draw(drawPluginOptions);
map.addControl(drawControl);

map.on("draw:created", function(e) {
  var type = e.layerType;
  var layer = e.layer;

  if (type === "polyline") {
    // add the drawn polyline to the FeatureGroup
    editableLayers.addLayer(layer);

    // update the coordinates variable
    var latlngs = layer.getLatLngs();
    coordinates = latlngs.map(function(latlng) {
      return [latlng.lat, latlng.lng];
    });
    polyline.setLatLngs(coordinates);
  } else if (type === "polygon") {
    // add the drawn polygon to the FeatureGroup
    editableLayers.addLayer(layer);

    // update the coordinates variable
    var latlngs = layer.getLatLngs();
    coordinates = latlngs.map(function(latlng) {
      return [latlng.lat, latlng.lng];
    });
    polygon.setLatLngs(coordinates);
  } else if (type === "circle") {
    // add the drawn polyline to the FeatureGroup
    editableLayers.addLayer(layer);

    // update the coordinates variable
    var latlngs = layer.getLatLngs();
    coordinates = latlngs.map(function(latlng) {
      return [latlng.lat, latlng.lng];
    });
    circle.setLatLngs(coordinates);
  }
});

// **********************************************

// var editableLayers = new L.FeatureGroup();
// map.addLayer(editableLayers);

map.on("draw:created", function(e) {
  var type = e.layerType,
    layer = e.layer;

  editableLayers.addLayer(layer);
});

var north = L.control({
  position: "bottomleft"
});
north.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend");
  var imageUrl = northImageUrl;
  div.innerHTML =
    '<img src="' + imageUrl + '" style="height: 20px; width: 30px;">';
  return div;
};
north.addTo(map);

(uri =
  "http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=topp:states"), {
  // namedToggle: false,
};
L.wmsLegend(uri);
//

// control
// mouse position

//******************************************************************Scale***************************************************************

L.control
  .scale({
    imperial: false,
    maxWidth: 200,
    metric: true,
    position: "bottomleft",
    updateWhenIdle: false
  })
  .addTo(map);

//**************************************************line mesure*************************************************************
L.control
  .polylineMeasure({
    position: "topleft",
    unit: "kilometres",
    showBearings: true,
    clearMeasurementsOnStop: false,
    showClearControl: true,
    showUnitControl: true
  })
  .addTo(map);

//**********************************************************area measure**********************************************************************
var measureControl = new L.Control.Measure({
  position: "topleft"
});
measureControl.addTo(map);

// search-button______________________________________
            $(document).ready(function() {


              var geojsonLayer; // Reference to the GeoJSON layer
              var geojsonFeatures = []; // Array to store GeoJSON features

              $("#btnData2").click(function() {
                  var selectedValue = $("#search-input").val();
                  console.log("Selected Value:", selectedValue);

                 

                  $.ajax({
                      url: "/searchOnClick/",
                      method: "GET",
                      data: { "selected_value": selectedValue },
                      dataType: "json",
                      success: function(response) {
                        
                          console.log("Response:", response);

                          geojsonFeatures = response.features;

                          if (geojsonLayer) {
                            geojsonLayer.removeFrom(map);
                        }
        
                          // Process the response data here
                         geojsonLayer = L.geoJSON(response).addTo(map);
                                                
           
                           map.fitBounds(geojsonLayer.getBounds());
                          
                      },
                      error: function(error) {
                          console.log("Error:", error);
                      }
                  });
              });
            });


               $("#btnData1").click(function() {
                  ClearMe();
                });










// Bookmark_____________________________________________________________________
$(document).ready(function() {
  var saveBtn = document.getElementById('saveBtn');

  saveBtn.addEventListener('click', function() {
    var center = map.getCenter(); // Get the center of the map
    var latitude = center.lat;
    var longitude = center.lng;

    // Show popup for entering location name
    Swal.fire({
      title: 'Enter Location Name',
      input: 'text',
      inputPlaceholder: 'Location Name',
      showCancelButton: true,
      confirmButtonText: 'Save',
      showLoaderOnConfirm: true,
      preConfirm: function(name) {
        return new Promise(function(resolve, reject) {
          if (name) {
            resolve(name);
          } else {
            reject('Invalid name');
          }
        });
      },
      
      allowOutsideClick: false,
      customClass: {
        title:'my_swal_title',
        container: 'my-swal-container', // CSS class for the container
        confirmButton: 'my-swal-button', // CSS class for the confirm button
        cancelButton: 'my-swal-button', // CSS class for the cancel button
        input: 'my-swal-input', // CSS class for the input field
      },
    }).then(function(name) {
      if (name.isConfirmed) {
        var locationName = name.value;
        var username = '{{ request.user.username }}'; // Assuming you are using Django's authentication system

        saveLocationToDB(latitude, longitude, locationName, username);
      }
    }).catch(function(error) {
      Swal.showValidationMessage(error);
    });
  });

  function saveLocationToDB(latitude, longitude, locationName, username) {
    $.ajax({
      url: '/save-location/',
      method: 'POST',
      data: {
        latitude: latitude,
        longitude: longitude,
        name: locationName,
        username: username
      },
      success: function(response) {
        console.log(response.message); // Log the response message
      },
      error: function(xhr, errmsg, err) {
        console.log(xhr.status + ': ' + xhr.responseText);
      }
    });
  }

  $(document).on('click', '#locationTable td.name', function() {
    var latitude = parseFloat($(this).data('latitude'));
    var longitude = parseFloat($(this).data('longitude'));
    map.flyTo([latitude, longitude], 17);
  });
                                                // for zoom
  function fetchLocations() {
          $.ajax({
            url: "/get-locations/",
            method: "GET",
            success: function (response) {
              var locations = response.locations;
              var tableBody = $("#locationTable tbody");
              tableBody.empty();

              $.each(locations, function (index, location) {
                var row = $("<tr>");
                row.data("location-id", location.id); // Store the location ID in the row data attribute
                $("<td>", {
                  class: "name",
                  text: location.name,
                  "data-latitude": location.latitude,
                  "data-longitude": location.longitude,
                }).appendTo(row);
                // $("<td>", { text: location.latitude }).appendTo(row);
                // $("<td>", { text: location.longitude }).appendTo(row);
                var deleteButton = $("<button>", { text: "Delete" });
                var deleteButtonWrapper = $("<td>", {
                  class: "delete-button",
                }).append(deleteButton);
                row.append(deleteButtonWrapper);
                row.appendTo(tableBody);
              });
            },
            error: function (xhr, errmsg, err) {
              // console.log(xhr.status + ": " + xhr.responseText);
            },
          });
        }

      
                                            // for Delete
  $(document).on("click", ".delete-button button", function () {
    var row = $(this).closest("tr");
    var locationId = row.data("location-id");

    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this location?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        text:"my_swal_text",
        title:"my_swal_title",
        icon:"my_icon",
        container: "my-swal-delete-container",
        confirmButton: "my-swal-button",
        cancelButton: "my-swal-button",
        actions: "my-swal-actions",
      },
    }).then(function (result) {
      if (result.isConfirmed) {
        deleteLocationFromDB(locationId, row);
      }
    });
  });

  function deleteLocationFromDB(locationId, row) {
    $.ajax({
      url: "/delete-location/",
      method: "POST",
      data: {
        locationId: locationId,
      },
      success: function (response) {
        console.log(response.message); // Log the response message
        row.remove(); // Remove the deleted row from the table
      },
      error: function (xhr, errmsg, err) {
        console.log(xhr.status + ": " + xhr.responseText);
      },
    });
  }

  fetchLocations();
  setInterval(fetchLocations, 1000);
});


    //pdf____________________________________________________________
 


function downloadPDF(username, email) {
  const { jsPDF } = window.jspdf;
      // html2canvas(document.querySelector('.leaflet-container'),{
      //   useCORS: true
      // }).then(function (canvas) {
        
  html2canvas(document.getElementById('map'), {
      useCORS: true
  }).then(function(canvas) {
      var imgData = canvas.toDataURL('image/png');

      // var pdf = new jsPDF();
      const pdf = new jsPDF('p', 'px', [canvas.width, canvas.height]);
      

      // Get the height of the canvas element and add it to the PDF
      var imgHeight = canvas.height;
      const text = 'TCPLgeo';
            const fontSize = 25;
            
            const textWidth = pdf.getStringUnitWidth(text) * fontSize / pdf.internal.scaleFactor;
            const textHeight = fontSize / pdf.internal.scaleFactor;
      
            // Calculate the center position
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const x = (pageWidth - textWidth) / 2;
            const y = 30;
      
            // Add text above the map (centered both horizontally and vertically)
            pdf.setFontSize(fontSize);
            pdf.setTextColor('blue');
            pdf.text(x, y, text);
      
            // Add user's name to the PDF
            pdf.setFontSize(16);
            pdf.setTextColor('black');
            pdf.text(20, 40, `User:`, null, null, 'left');
           
            pdf.text(70, 40, username, null, null, 'left');
      
            // Add user's email to the PDF
            pdf.setTextColor('black');
            pdf.text(20, 60, `Email:`, null, null, 'left');
            pdf.setTextColor('blue');
            pdf.text(70, 60, email, null, null, 'left');
      
              // Add the image to the PDF without any scaling or clipping
                pdf.addImage(imgData, 'PNG', 30, 70, 750, 400);
      
                // Add the image below the map
                
               
                pdf.addImage(imageUrl, 'PNG', 30, 500, 750, 200); // Adjust the coordinates and size as needed
      
      pdf.save('TCPLmap.pdf');
     
  });
}

