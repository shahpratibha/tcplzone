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

var wms_layer1 = L.tileLayer.wms(
  "http://portal.tcplgeo.com:8080/geoservers/DP/wms",
  {
    // layers: layerName,
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    attribution: "Revenue",
    opacity: 1
  }
);
var userRole = "<?php echo 'shantaram'; ?>";

var shantaramList = [
  "DP:DP",
  "DP:Revenue",
  "DP:RP",
  "DP:Change_overlay1",
  "DP:Change_overlay",
  "DP:Modification"
];
var adminList = ["DP:DP", "DP:Revenue", "DP:RP", "DP:Modification"];
var finalDraftList = ["DP:DP", "DP:Revenue", "DP:RP", "	DP:Change_overlay1"];
var concatenatedList = [];
var wmsLayersNames = ["DP", "Revenue", "RP", "Change_overlay1"];
var wmsLayerss = {};

if (userRole === "shantaram") {
  finalDraftList = shantaramList;
  wmsLayersNames = [
    "DP",
    "Revenue",
    "RP",
    "Change_overlay1",
    "Change_overlay",
    "Modification"
  ];
}
if (userRole === "admin") {
  finalDraftList = adminList;
  wmsLayersNames = ["DP", "Revenue", "RP", "Modification"];
}
// console.log(finalDraftList);
// console.log(wmsLayersNames);

for (var i = 0; i < finalDraftList.length; i++) {
  var concatenatedString = "wms_layer" + (i + 1);

  // Function to create the GeoServer layer
  var geoserverLayer = createGeoServerLayer(userRole);

  function createGeoServerLayer(userRole) {
    var concatenatedString = finalDraftList[i];
    return createWMSLayer(concatenatedString);
  }
  if (finalDraftList[i] === "DP:DP") {
    geoserverLayer.addTo(map);
  }
  wmsLayerss[wmsLayersNames[i]] = geoserverLayer;
  concatenatedList.push(concatenatedString);
}

function createWMSLayer(layerName) {
  return L.tileLayer.wms("http://portal.tcplgeo.com:8080/geoservers/DP/wms", {
    layers: layerName,
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    attribution: "Revenue_Boundary",
    opacity: 0.7
  });
}
var control = new L.control.layers(baseLayers).addTo(map);

//!-- popup -->

map.on("contextmenu", e => {
  let size = map.getSize();
  let bbox = map.getBounds().toBBoxString();
  let layer = "DP:Modification_Overlay";
  let style = "DP:Modification_Overlay";
  let urrr = `http://portal.tcplgeo.com:8080/geoservers/DP/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=${layer}&STYLES&LAYERS=${layer}&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=${Math.round(
    e.containerPoint.x
  )}&Y=${Math.round(
    e.containerPoint.y
  )}&SRS=EPSG%3A4326&WIDTH=${size.x}&HEIGHT=${size.y}&BBOX=${bbox}`;

  // you can use this url for further processing such as fetching data from server or showing it on the map

  if (urrr) {
    fetch(urrr).then(response => response.json()).then(html => {
      var htmldata = html.features[0].properties;
      let keys = Object.keys(htmldata);
      let values = Object.values(htmldata);
      let txtk1 = "";
      var xx = 0;
      for (let gb in keys) {
        txtk1 +=
          "<tr><td>" + keys[xx] + "</td><td>" + values[xx] + "</td></tr>";
        xx += 1;
      }
      let detaildata1 =
        "<div style='max-height: 350px;  overflow-y: scroll;'><table  style='width:70%;' class='popup-table' >" +
        txtk1 +
        "<tr><td>Co-Ordinates</td><td>" +
        e.latlng +
        "</td></tr></table></div>";

      L.popup().setLatLng(e.latlng).setContent(detaildata1).openOn(map);
    });
  }
});

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
  var imageUrl = "{% static 'images/North.png' %}";
  div.innerHTML =
    '<img src="' + imageUrl + '" style="height: 50px; width: 50px;">';
  return div;
};
north.addTo(map);

(uri =
  "https://portal.tcplgeo.com/geoservers/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=40&HEIGHT=20&LAYER=DP:DP"), {
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

$("#btnData2").click(function() {
  SearchMe();
});

$("#btnData1").click(function() {
  ClearMe();
});

// *****************************************************************Search Button**********************************************************************
function SearchMe() {
  var array = $(".search").val().split(",");

  if (array.length == 1) {
    var sql_filter1 = "Gut_Number Like '" + array[0] + "'";
    fitbou(sql_filter1);
    wms_layer1.setParams({
      cql_filter: sql_filter1,
      styles: "highlight"
    });
    wms_layer1.addTo(map);
  } else if (array.length == 2) {
    var sql_filter1 =
      "Village__1 Like '" +
      array[0] +
      "'" +
      "AND Taluka Like '" +
      array[1] +
      "'";
    fitbou(sql_filter1);
    wms_layer1.setParams({
      cql_filter: sql_filter1,
      styles: "highlight"
    });
    wms_layer1.addTo(map);
  } else if (array.length >= 3) {
    var guts = array.slice(2, array.length).join(", ");
    var sql_filter1 =
      "Village__1 Like '" +
      array[0] +
      "'" +
      "AND Gut_Number IN (" +
      guts +
      ")" +
      "AND Taluka Like '" +
      array[1] +
      "'";
    fitbou(sql_filter1);
    wms_layer1.setParams({
      cql_filter: sql_filter1,
      styles: "highlight"
    });
    wms_layer1.addTo(map);
  }
}

function fitbou(filter) {
  var layer = "DP:Revenue";
  var urlm =
    "http://portal.tcplgeo.com:8080/geoservers/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
    layer +
    "&CQL_FILTER=" +
    filter +
    "&outputFormat=application/json";
  $.getJSON(urlm, function(data) {
    geojson = L.geoJson(data, {});
    map.fitBounds(geojson.getBounds());
  });
}

function ClearMe() {
  map.setView([18.55, 73.85], 10, L.CRS.EPSG3857);
}

// ***************************************************pdf*********************************************************

function takeScreenshot() {
  html2canvas(document.getElementById("map"), {
    useCORS: true
  }).then(function(canvas) {
    var imgData = canvas.toDataURL("image/png");

    var pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 15, 25, 180, 135); //x,y , width, height

    // Get the height of the canvas element and add it to the PDF
    var imgHeight = canvas.height;

    // Add the local image to the PDF
    var img = new Image();
    img.onload = function() {
      pdf.addImage(img, "PNG", 15, 170, 180, 80);
      pdf.save("map.pdf");
    };
    img.src = "finalLegend.png";
  });
}


//Bookmark_____________________________________________________________________

// Define the getMapCenter function
function getMapCenter() {
  // var map =  L.map('map');
  var mapCenter = map.getCenter();
  var latitude = mapCenter.lat();
  var longitude = mapCenter.lng();
  return {
    latitude: latitude,
    longitude: longitude
  };
}
// Define the showCreateBookmarkForm function
function showCreateBookmarkForm(event) {
  var createBookmarkForm = document.getElementById("createBookmarkForm");
  createBookmarkForm.style.display = "block";

  if (createBookmarkForm) {
    var mapCenter = getMapCenter();
    var latitude = mapCenter.lat;
    var longitude = mapCenter.lng;

    html2canvas(document.getElementById("map")).then(function(canvas) {
      var screenshotData = canvas.toDataURL();
      console.log("Screenshot data:", screenshotData);

      var csrfTokenElement = document.querySelector(
        'input[name="csrfmiddlewaretoken"]'
      );
      var csrfToken = csrfTokenElement ? csrfTokenElement.value : "";

      $.ajax({
        type: "POST",
        url: saveBookmarkUrl,
        data: {
          screenshot: screenshotData,
          name: createBookmarkForm.name.value,
          latitude: mapCenter.latitude,
          longitude: mapCenter.longitude,
          csrfmiddlewaretoken: csrfToken
        },
        success: function(response) {
          console.log("Bookmark saved successfully:", response);
          // location.reload();
        },
        error: function(xhr, status, error) {
          console.error("Error saving bookmark:", error);
        }
      });
    });
  }
}

// Add an event listener to the createBookmarkBtn
var createBookmarkBtn = document.getElementById("createBookmarkBtn");
if (createBookmarkBtn) {
  createBookmarkBtn.addEventListener("click", function(event) {
    event.preventDefault();
    showCreateBookmarkForm();
  });
}
//     document.addEventListener('DOMContentLoaded', function() {
//     var createBookmarkBtn = document.getElementById('createBookmarkBtn');
//     if (createBookmarkBtn) {
//       createBookmarkBtn.addEventListener('click', createBookmark);
//     }

//     function createBookmark() {
//       var bookmarkName = window.prompt('Enter the bookmark name:');
//       var promptDialog = document.getElementsByClassName('prompt-dialog-box')[0];
//       if (promptDialog) {
//         promptDialog.classList.add('prompt-dialog');
//       }

//       if (bookmarkName) {
//         var mapCenter = map.getCenter();
//         var latitude = mapCenter.lat;
//         var longitude = mapCenter.lng;

//         html2canvas(document.getElementById('map')).then(function (canvas) {
//           var screenshotData = canvas.toDataURL();

//           var csrfTokenElement = document.querySelector('input[name="csrfmiddlewaretoken"]');
//           var csrfToken = csrfTokenElement ? csrfTokenElement.value : '';

//           $.ajax({
//             type: 'POST',
//             url: saveBookmarkUrl,
//             data: {
//               screenshot: screenshotData,
//               name: bookmarkName,
//               latitude: latitude,
//               longitude: longitude,
//               csrfmiddlewaretoken: csrfToken // Add the CSRF token to the request data
//             },
//             success: function (response) {
//               console.log('Bookmark saved successfully:', response);
//               location.reload();
//             },
//             error: function (xhr, status, error) {
//               console.error('Error saving bookmark:', error);
//             }
//           });
//         });
//       }
//     }
//   });
                              // makeQuery


                              
    // ***************************************************************Make QUery***************************************************************

    $("#button").click(function() {
      $("#box form").toggle("slow");
      $(document).ready(function() {
          $.ajax({
              type: "GET",
              url: "https://portal.tcplgeo.com/geoservers/DP/wfs?request=getCapabilities",
              dataType: "xml",
              success: function(xml) {
                  var select1 = $('#layer');

                  $(xml).find('FeatureType').each(function() {
                      $(this).find('Name').each(function() {
                          var value = $(this).text();
                          select1.append(
                              "<option class='ddindent' value='" +
                              value + "'>" + value + "</option>");
                      });
                  });
              }
          });
      });
      $(function() {
          $("#layer").change(function() {
              var attributes = document.getElementById("attributes");
              var length = attributes.options.length;
              for (i = length - 1; i >= 0; i--) {
                  attributes.options[i] = null;
              }
              var value_layer1 = $(this).val();
              $(document).ready(function() {
                  $.ajax({
                      type: "GET",
                      url: "https://portal.tcplgeo.com/geoservers/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=" +
                          value_layer1,
                      dataType: "xml",

                      success: function(xml) {

                          var select2 = $('#attributes');
                          $(xml).find('xsd\\:sequence').each(function() {
                              $(this).find('xsd\\:element').each(
                                  function() {
                                      var value = $(this)
                                          .attr('name');
                                      var type = $(this).attr(
                                          'type');
                                      if (value != 'geom' &&
                                          value != 'the_geom'
                                      ) {
                                          select2.append(
                                              "<option class='ddindent' value='" +
                                              type +
                                              "'>" +
                                              value +
                                              "</option>");
                                      }
                                  });
                          });
                      }
                  })
              });
              document.getElementById("textval").innerHTML = value_layer1;
          })
      });
      $(function() {
          $("#attributes").change(function() {
              var operator = document.getElementById("operator");
              var attributes = $("#layer option:selected").text();
              var length = operator.options.length;
              for (i = length - 1; i >= 0; i--) {
                  operator.options[i] = null;
              }
              var value_type = $(this).val();
              var value_attribute = $('#attributes option:selected').text();
              operator.options[0] = new Option('Select operator', "");
              if (value_type == 'xsd:short' || value_type == 'xsd:int' || value_type ==
                  'xsd:double') {
                  var operator1 = document.getElementById("operator");
                  operator1.options[1] = new Option('>', '>');
                  operator1.options[2] = new Option('<', '<');
                  operator1.options[3] = new Option('=', '=');
                  operator1.options[4] = new Option('<=', '<=');
                  operator1.options[5] = new Option('=>', '=>');
                  operator1.options[6] = new Option('IN ()', 'IN');
                  operator1.options[7] = new Option('OR ||', 'OR');
                  operator1.options[8] = new Option('AND &', 'AND');
              } else if (value_type == 'xsd:string') {
                  var operator1 = document.getElementById("operator");
                  operator1.options[1] = new Option('Like', 'ILike');
                  operator1.options[2] = new Option('IN ()', 'IN');
                  operator1.options[3] = new Option('OR ||', 'OR');
                  operator1.options[4] = new Option('AND &', 'AND');
              }


              var selectvalue = document.getElementById("selectvalue");
              var length = selectvalue.options.length;
              for (i = length - 1; i >= 0; i--) {
                  selectvalue.options[i] = null;
              }

              $(document).ready(function() {
                  $.ajax({
                      type: "GET",
                      url: "https://portal.tcplgeo.com/geoservers/wfs?service=wfs&version=1.0.0&request=getfeature&typename=" +
                          attributes + "&PROPERTYNAME=" + value_attribute,
                      dataType: "xml",
                      success: function(xml) {
                          var select3 = $('#selectvalue');
                          var unq = new Array();
                          $(xml).each(function() {
                              $(this).find('gml\\:featureMember')
                                  .each(function() {
                                      unq.push($(this)
                                          .text());
                                  });
                              let unique = unq.filter((item, i,
                                  ar) => ar.indexOf(
                                  item) === i);
                              for (let i = 0; i < unique
                                  .length; i++) {
                                  select3.append(
                                      "<option class='ddindent' value='" +
                                      unique[i] + "'>" +
                                      unique[i] + "</option>");
                              }
                          });
                      }
                  });
              });
              document.getElementById("textval").innerHTML = "From Layer" + attributes +
                  " is " + value_attribute;
          });

      });
  });



  $(function() {
      $("#selectvalue").change(function() {
          var vars = ['layer', 'attributes', 'operator', 'selectvalue'];
          for (let i = 0; i < vars.length; i++) {
              //   var operator = document.getElementById("operator");
              var layer = $("#layer option:selected").text();
              var attributes = $("#attributes option:selected").text();
              var operator = $("#operator option:selected").text();
              var selectvalue = $("#selectvalue option:selected").text();
          }
          document.getElementById("textval").innerHTML = "From Layer " + layer + " column is " +
              attributes + " " + operator + " value is " + selectvalue;

          var sql_filter1 = attributes + " Like '" + selectvalue + "'"
          // console.log(sql_filter1)
          fitbou(sql_filter1, layer)

          var wms_layerf = L.tileLayer.wms(
              "https://portal.tcplgeo.com/geoservers/DP/wms", {
                  layers: layer,
                  format: "image/png",
                  transparent: true,
                  tiled: true,
                  version: "1.1.0",
                  attribution: "ugc",
                  opacity: 1,
                  cql_filter: sql_filter1,
                  styles: 'highlight',

              }
          );
          wms_layerf.addTo(map);


          function fitbou(filter, layer1) {
              var urlm =
                  "https://portal.tcplgeo.com/geoservers/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
                  layer1 + "&CQL_FILTER=" + filter + "&outputFormat=application/json";
              // console.log(urlm)
              $.getJSON(urlm, function(data) {
                  geojson = L.geoJson(data, {});
                  map.fitBounds(geojson.getBounds());
              });
          };


      });
  })



