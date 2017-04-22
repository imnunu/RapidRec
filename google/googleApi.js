var map;
var autocomplete;
var service;
var postionOfUserFromGeolocation = new Array;
var eventtype = 'public';
var infowindow;
var bounds;
var markers = [];

//sets event type used in search query and makes a new location search
function setEventtype(type) {
  eventtype = type;
  if (postionOfUserFromGeolocation[0] == null && postionOfUserFromGeolocation[1] == null) {
    document.getElementById('error').innerHTML = "Please Enter a Location";
  }
  else {
    changeMapLocation(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],15);
    mapSearch(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000, eventtype,0);
  }
  //store event type in form field
  $("#event_type").val(eventtype);
}

//prompt for storing user's geolocation on page load
function getUserLocation() {
  if (navigator.geolocation) {
    var options = {timeout:30000};
    navigator.geolocation.getCurrentPosition(storePosition,unableToGetLocation,options);
  }
}

//successful callback function for getCurrentPosition
//stores user location and make a automatic call to search for events
function storePosition(position) {
  postionOfUserFromGeolocation[0] = position.coords.latitude;
  postionOfUserFromGeolocation[1] = position.coords.longitude;

  changeMapLocation(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],15);
  mapSearch(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000,eventtype,0);
}

//failed callback function for getCurrentPosition
function unableToGetLocation(error) {
  //generate message that location could not be got
  $(".loading-spinner").hide();
  document.getElementById('error').innerHTML = "Could Not Get Geolocation";
}


// Create the autocomplete object, restricting the search to geographical
// location types. Calls
function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('autocomplete')),
      {types: ['geocode']});

  //add listener to check if place changed and calls storePositionUsingAutoComplete
  //function on changed location
  autocomplete.addListener('place_changed', storePositionUsingAutoComplete);
}

//initializes map and centers based on user location or search results
function initMap(lat_user, lng_user, zoom, type) {
  var user_location = {lat:lat_user , lng:lng_user};

  map = new google.maps.Map(document.getElementById('map'), {
      center: user_location,
      zoom: zoom
        });
  //creates a drag listener on create page only
  if (type == "create") {
     map.addListener('dragend', function() {
      postionOfUserFromGeolocation[0] = map.getCenter().lat();
      postionOfUserFromGeolocation[1] = map.getCenter().lng();

      mapSearch(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000,eventtype,1);
    });
  }

  service = new google.maps.places.PlacesService(map);
  infowindow = new google.maps.InfoWindow();
}

//renders new map based on lat long and zoom level
function changeMapLocation(lat_user, lng_user, zoom) {
  var user_location = {lat:lat_user , lng:lng_user};
  map.setCenter(user_location);
  map.setZoom(zoom);
}

//stores the new position from autocomplete search and
//renders new map
function storePositionUsingAutoComplete(){
  var place = autocomplete.getPlace();
  postionOfUserFromGeolocation[0] = place.geometry.location.lat();
  postionOfUserFromGeolocation[1] = place.geometry.location.lng();

  changeMapLocation(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],15);

  mapSearch(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000, eventtype,0);
}

//creates a nearby search request to google service
function mapSearch(lat_user, lng_user, radius, eventtype, stopBound) {
  document.getElementById('error').innerHTML = "";
  var user_location = {lat:lat_user , lng:lng_user};

   var request = {
    location: user_location,
    radius: radius,
    types: [eventtype]
  };
  if (stopBound == 0){
    $(".loading-spinner").show();
  }

  service.nearbySearch(request, function(results,status) {
    onSearchSucccess(results,status,stopBound);
    $(".loading-spinner").hide();
  });

}

//takes the search results from nearby search and creates dynamic content
function onSearchSucccess(results, status,stopBound) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    //deletes previous search markers
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }

    //deletes listitems in results list from previous search
    var resultsList = document.getElementById("resultsList");
    while (resultsList.firstChild) {
      resultsList.removeChild(resultsList.firstChild);
    }

    //initialize new bounds and markers list
    bounds = new google.maps.LatLngBounds();
    markers = [];

    //sets max nearby search results to 8
    var numberResultsToReturn = results.length;
    if (results.length > 8) {
      numberResultsToReturn = 8;
    }
    //creates new markers on map and extends bounds
    for (var i = 0; i < numberResultsToReturn; i++) {
      if (stopBound == 0) {
        var lat = results[i].geometry.location.lat();
        var lng = results[i].geometry.location.lng();
        bounds.extend(new google.maps.LatLng(lat, lng));
        createMarker(results[i],(i + 1));
      }
      else {
        createMarker(results[i],(i + 1));
      }
    }
    //creates result list and show list button
    //*list hidden by default*
    createShowListButton();
    renderListWithPhotos(results,"createPage");

    if (stopBound == 0) {
      map.fitBounds(bounds);
    }
  }
}

//creates event markers on create event map
function createMarker(place,number) {
    var event = eventtype;
    var image = createImage(event);
    var placeLoc = place.geometry.location;

    //initialzes new marker
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      // icon: image
    });

    //adds marker to markers array
    markers.push(marker);

    //adds on click listener to render info window and fills create event form
    //using the clicked marker's place name
    google.maps.event.addListener(marker, 'click', function() {
      fillFormOnMarkerClick(place.name);

      infowindow.setContent(place.name + "<br />" + place.vicinity + "<br />");
      infowindow.open(map, this);
  });

}

//creates image object for marker icon
function createImage(event) {
  if (event === 'public'){
    var imgPath = "<%= image_path('private.png') %>";
  }else{
    var imgPath = "<%= image_path('public.png') %>";
  }

  var image = {
    url: imgPath,
    // This marker is 33 pixels wide by 45 pixels tall.
    size: new google.maps.Size(33, 45)
  };
  return image;
}

//fills form on marker click
//references search details data which is stored on list using marker's placename
function fillFormOnMarkerClick(placename) {
      //unselects last active list item
      $(".list-group-item").removeClass("active");
      //search each list group item for the correct place details
      //fills form using details and call to get time zone data
      $(".list-group-item").each(function() {
        var listItem = $(this);
        var listItemHeader = $(this).find('h3');
        var locationData = listItemHeader.data("locationData");

        getTimeZoneDataForPlace(locationData.lat, locationData.lng).then(function (data) {

          $(listItemHeader).data('timeZoneData', { dstOffset: data.dstOffset, rawOffset: data.rawOffset, timeZoneId: data.timeZoneId,
            timeZoneName: data.timeZoneName
          });

          var timeZoneData = listItemHeader.data("timeZoneData");
          if( listItemHeader.text() == placename){
            fillForm(locationData, timeZoneData);
            listItem.addClass("active");
          }

        });
      });
}

//deletes all markers
function deleteMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

  bounds = new google.maps.LatLngBounds()
  markers = [];
}
