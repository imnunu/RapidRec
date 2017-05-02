var map;
var infowindow;
var service;
var markers = [];
var createdEvents = [];
var autocomplete;


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

  autocomplete = new google.maps.places.Autocomplete(input, center);
  autocomplete.addListener('place_changed',moveMapToLocation);

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

      infowindow.setContent(
        '<div id="iw-container">' + '<div class="iw-title">' + place.name + '</div>' + "<br />" +
        '<div class="iw-content">'+ '<div class="iw-subTitle">' + place.vicinity + '</div>'+ "<br />" + '<div class="iw-subTitle">' +
        "Rating: " + '</div>'+ place.rating +
        '<div class="iw-title">' + "<br /><a data-toggle='modal' href='#myModal' onclick=\"$('.create_event_location').val('"+
        place.vicinity + "');\" >Create Game</a>") + '</div>';

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
  var image = gameMarker(marker);
//initialize new marker
  var marker = new google.maps.Marker ({
      map: map,
      position: placeLoc,
      icon: image,
      animation: google.maps.Animation.BOUNCE
    });
  setTimeout(function() {
        marker.setAnimation(null)
    }, 3000);

  google.maps.event.addListener(marker, 'click', function() {

      infowindow.setContent(
        '<div id="iw-container">' + '<div class="iw-title">' + event.location + '</div>' + "<br />" +
        '<div class="iw-content">'+ '<div class="iw-subTitle">' + event.description + '</div>'+ "<br />" +
        '<div class="iw-subTitle">' + "Start:" + '</div>' +
        event.start_time + "<br />" + '<div class="iw-subTitle">' + "End:" + '</div>' +
        event.end_time + '<div class="iw-title">' + "<br /><a data-toggle='modal' href='/event/" +
        event.id + "' onclick=\"$('.create_event').val('"+
        event.vicinity + "');\" >View Event</a>") + '</div>' + '</div>';


      infowindow.open(map, this);
  });
  setTimeout(function () {
        marker.setMap(null);
        delete marker;
    }, 259200000);
    return marker;
}

//custom marker for created game
function gameMarker(marker) {
  var imagePath = "/img/32basketball.png";
  var image = {
    url: imagePath,
    size: new google.maps.Size(45, 45)
  };
  return image;
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

function moveMapToLocation() {
  var place = autocomplete.getPlace();
  map.setCenter(place.geometry.location)
  map.setZoom(10);

}

//google.maps.event.addDomListener(window, 'load', initialize);
