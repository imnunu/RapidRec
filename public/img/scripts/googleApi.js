var map;
var infowindow;
var service;
var markers = [];
var createdEvents = [];


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
  testFunction();

  var input = document.getElementById('pac-input');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var autocomplete = new google.maps.places.Autocomplete(input, center);


  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);

map.addListener('dragend', function() {
    positionOne = map.getCenter().lat();
    positionTwo = map.getCenter().lng();

    mapDrag(positionOne, positionTwo, 100);
    testFunction();
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
      const { position } = marker;
      const lat = position.lat();
      const lng = position.lng();
      const $loc = $('.location');
      $loc.data('lat', lat);
      $loc.data('lng', lng);
  infowindow = new google.maps.InfoWindow();

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
    radius: 1000,
    type: ['park']
  };

  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function createCurrentGameMarker(event) {
  var placeLoc = new google.maps.LatLng(event.lat, event.lng);
  var image = {
    url: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=+|f0652a|f0652a",
    size: new google.maps.Size(50, 50),
  };
//initialize new marker
  var marker = new google.maps.Marker ({
      map: map,
      position: placeLoc,
      icon: image,
      animation: google.maps.Animation.DROP
    });

  google.maps.event.addListener(marker, 'click', function() {

      infowindow.setContent(event.location + "<br />" + event.description + "<br />" + "Start:" + event.start_time + "<br />" + "End:"+ event.end_time + "<br /><a data-toggle='modal' href='/event/" + event.id + "' onclick=\"$('.create_event').val('"+ event.vicinity + "');\" >View Event</a>");
      infowindow.open(map, this);
  });
  setTimeout(function () {
        marker.setMap(null);
        delete marker;
    }, 259200000);
    return marker;
}

function testFunction() {
  $.ajax({
    method: "GET",
    url: "/api/events"
  }).done((events) => {
    for(event of events) {
      if (event.lat != null) {
        createCurrentGameMarker(event);
      }
    }
  });
}


//google.maps.event.addDomListener(window, 'load', initialize);
