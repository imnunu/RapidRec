//initializes dynamic content and gets user location
//code is only called on events index page
$(document).ready(function(){
  initMap(49.2667967,-123.2056314,10, "search")
  initAutocompleteforDrinkups()
  $("#event_listing").hide();
  $("#My-Events-Title").hide();
  getUserLocationforEvents();
  getEventsForCurrentUser();
});

var inCache;
var cachedEvents=[];

//prompts user for permission to get current location
function getUserLocationforEvents() {
  if (navigator.geolocation) {
    var options = {timeout:30000};
    navigator.geolocation.getCurrentPosition(initializeMarkers,unableToGetLocation,options);
  }
}


  // Create the autocomplete object, restricting the search to geographical
  // location types.
function initAutocompleteforEvents() {
  autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('autocomplete')),
      {types: ['geocode']});

  //adds drag listener and calls initialize markers on drag finish
  //stores current position as maps new center
  map.addListener('dragend', function() {
    var position= {
              coords: {
                latitude:map.getCenter().lat(),
                longitude:map.getCenter().lng()
              },
              action: "drag"
            };
    initializeMarkers(position);
  });

  //checks for change of place in autocomplete and calls storePositionforDrinkups
  autocomplete.addListener('place_changed', storePositionforEvents);
}

//called when autocomplete has entered new search
//stores position as map's new center and renders event markers based on new position
function storePositionforEvents() {
  var place = autocomplete.getPlace();
  var position= {
    coords: {latitude:place.geometry.location.lat(),longitude:place.geometry.location.lng()}
  };
  changeMapLocationforEvents(position.coords.latitude,position.coords.longitude,15);

  initializeMarkers(position);
}

//renders maps new center
function changeMapLocationforEvents(lat_user, lng_user, zoom){
  var user_location = {lat:lat_user , lng:lng_user};
  map.setCenter(user_location);
  map.setZoom(zoom);
}

//creates events marker and stores event data in marker
//and adds listener to render info window on click
function createEventMarker(place, event, number, isAttending, isCreator) {

    //creates new event marker image
    var event = events.event_type;
    if (event === 'public'){
      var imgPath = "<%= image_path('public.png') %>";
    }else{
      var imgPath = "<%= image_path('private.png') %>";
    }
    //sets marker location to place location
    var placeLoc = place.geometry.location;

    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: imgPath
    });
    //create start and end time info
    var start_time = moment.utc(event.start_time).format('MMMM Do YYYY, h:mm a');
    var end_time = moment.utc(event.end_time).format('MMMM Do YYYY, h:mm a');
    var time_zone = moment().tz(String(event.timeZoneId)).format('z');

    //store event data on marker
    $(marker).data('eventData', { id : event.id, name : event.name, location_address : place.vicinity,
        start_time : start_time, end_time : end_time, time_zone : time_zone ,isUserAttending : isAttending, isUserCreator: isCreator, count : event.count
    });

    markers.push(marker);

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(eventData.name + "<br />" + eventData.location_address + "<br />" + "Attendees: " + eventData.count + "<br />");
        infowindow.open(map, marker);
        fillEventContent(marker);
      });
    };
}

function createMarkerForEventsAroundYou(event, number, isAttending, isCreator, stopBound) {
    service.getDetails({ placeId: event.place_id }, function(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        if (stopBound == false) {
          var lat = place.geometry.location.lat();
          var lng = place.geometry.location.lng();
          bounds.extend(new google.maps.LatLng(lat, lng));
          createEventMarker(place, event, number, isAttending, isCreator);
          map.fitBounds(bounds);
        }
        else {
          createEventMarker(place, event, number, isAttending, isCreator);
        }
      }
    });
}

function initializeMarkers(position) {
  document.getElementById('error').innerHTML = "";
  var crd = position.coords;
  var geoCookie = crd.latitude + "|" + crd.longitude;
  document.cookie = "lat_lng=" + escape(geoCookie);
  if (position.action !== "drag"){
    $(".loading-spinner").show();
  }

  $.getJSON("/events/getEvents", function (data) {
    var events = data.events;
    if (events.length == 0){
      document.getElementById('error').innerHTML = "No Events Around You";
    }
    if (position.action == "drag"){

      if (events.length != cachedEvents.length){
        inCache = false;
      }
      else {
        for (i = 0; i < events.length; i++){
          if ($.inArray(events[i].id,cachedEvent) !== -1){
            inCache=true;
          }
          else
          {
            inCache = false;
            break;
          }
        }
      }

      if (inCache == true){

        return;
      }
      else if (inCache == false){
        cachedEvents = [];
        for (i = 0; i < events.length; i++){
          cachedEvents.push(events[i].id);
        }
      }
    }

    var events_attending = data.events_attending;
    var events_creator = data.events_creator;
    var stopBound;
    deleteMarkers();
    if (position.action == null) {
        stopBound = false;
        bounds = new google.maps.LatLngBounds()
    } else {
        stopBound = true;
    }
    for(i = 0; i < events.length; i++) {
      var isAttending = false;
      var isCreator = false;
      if ($.inArray(events[i].id, events_attending) !== -1) {
        isAttending = true;
      }
      if ($.inArray(events[i].id, events_attending) !== -1) {
        isCreator = true;
      }
      createMarkerForEventsAroundYou(events[i], i + 1, isAttending, isCreator, stopBound);
    }
    $(".loading-spinner").hide();
  });
}

//makes call to server to get all events user is attending
//renders the events list using event infomation
function getEventsForCurrentUser()
{
    $.getJSON("/users/" + gon.user_id + "/getCurrentEventsForUser", function (data) {
    var events = data.events_currentUser;
    renderListWithPhotos(events,"indexPage");
  });
}

//creates a container that slides down on marker click
//fills the contains with data from marker
function fillEventContent(marker) {
    var eventData = $(marker).data("eventData");
    var eventListing = $("#event_listing");
    var eventLinkAttend = $("#event_link_attend");
    var eventAttendeeLimit = 10;

    if(!eventListing.is(":visible")) {
      eventListing.slideDown(500);
      $("#inspirational_quote").hide();
    }

    // Fill in event content show after clicking on event on map
    $("#event_name").html(eventData.name);
    $("#event_location_address").html(eventData.location_address);
    $("#event_start_time").html(eventData.start_time + " " + eventData.time_zone);
    $("#event_end_time").html(eventData.end_time + " " + eventData.time_zone);


    $("#event_link_show").attr("href", "/events/" + eventData.id);
    if (eventData.count > eventAttendeeLimit && !eventData.isUserAttending) {
      eventLinkAttend.removeAttr("href");
      eventLinkAttend.addClass("inactive");
      eventLinkAttend.text("Game is full");
    } else {
      if (!eventData.isUserAttending) {
        eventLinkAttend.removeClass("inactive");
        eventLinkAttend.text("Attend");
        eventLinkAttend.on("click", function(e) {
          joinEvent(eventData.id);
        });
      } else {
        eventLinkAttend.removeClass("inactive");
        eventLinkAttend.text("Unattend");
        eventLinkAttend.on("click", function(e) {
          unjoinEvent(eventData.id);
        });
      }
    }
}
