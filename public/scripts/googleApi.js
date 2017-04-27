var map;
var infowindow;
var service;
var markers = [];

//initializes map and centers onto Vancouver
  function initialize() {
    var center = new google.maps.LatLng(49.281422, -123.12303);
      map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 14
    });

  var request = {
    location: center,
    radius: 400,
    type: ['park']
  };

  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);

map.addListener('dragend', function() {
    positionOne = map.getCenter().lat();
    positionTwo = map.getCenter().lng();

    mapDrag(positionOne, positionTwo, 100);
  });
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}
//create marker on event map
function createMarker(place) {
  console.log(place);
  var placeLoc = place.geometry.location;
//initialize new marker
  var marker = new google.maps.Marker ({
      map: map,
      position: place.geometry.location
    });
//add marker to array
    markers.push(marker);
//click event to render info window and fill event form with place name
    google.maps.event.addListener(marker, 'click', function() {

      infowindow.setContent(place.name + "<br />" + place.vicinity + "<br />" + "Rating: " + place.rating + "<br /><a data-toggle='modal' href='#myModal' onclick=\"$('.create_event_location').val('"+ place.vicinity + "');\" >Create Game</a>");
      infowindow.open(map, this);
  });
}

function mapDrag(user_lat, user_lng, zoom) {
  for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }

  markers = [];
  var user_location = {
    lat: user_lat,
    lng: user_lng
  };

  var request = {
    location: user_location,
    radius: 400,
    type: ['park']
  };

  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

// function findCurrentGame()
//google.maps.event.addDomListener(window, 'load', initialize);
