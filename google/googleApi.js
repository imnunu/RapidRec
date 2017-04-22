var map;
var infowindow;
    //initializes map and centers onto Vancouver
    function initialize() {
      var center = new google.maps.LatLng(49.281422, -123.12303);
        map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 14
      });
    var request = {
    location: center,
    radius: 4000,
    types: ['park'],
    openNow: true
  };
infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
service.nearbySearch(request, callback);
}
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
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
infowindow.setContent(place.name + "<br />" + place.vicinity + "<br />" + "Rating: " + place.rating + "<br />");
    infowindow.open(map, this);
  });
}
google.maps.event.addDomListener(window, 'load', initialize);
