var user_location;
var gametype = 'individual';
var radius_distance = 1000;
var positionOfUserFromGeolocation = new Array;

function getUserLocation() {
  if (navigator.geolocation) {
    console.log("nav");
    var options = {timeout:30000};
    navigator.geolocation.getCurrentPosition(storePosition, showError, options);
  }
}

function storePosition(position) {
  console.log("show store");
  positionOfUserFromGeolocation[0] = position.coords.latitude;
  postiionOfUserFromGeolocation[1] = position.coords.longitude;
  initMap();
}

function showError(error) {
  console.log("show error");
  console.warn('ERROR(' + error.code + '): ' + error.message);
}

var map;
 function initMap() {
  console.log(positionOfUserFromGeolocation[0]);
  console.log(positionOfUserFromGeolocation[1]);
  var user_location = {lat:positionOfUserFromGeolocation[0] , lng:positionOfUserFromGeolocation[1]};

  map = new google.maps.Map(document.getElementById('map'), {
    center: user_location,
    zoom: 15
 });

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: user_location,
    radius: radius_distance,
    type: [gametype]
  }, callback);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}



function myMap() {
  var mapProp= {
    center:new google.maps.LatLng(51.508742,-0.120850),
    zoom:5,
  };
  var map=new google.maps.Map(document.getElementById("map"),mapProp);
  }
