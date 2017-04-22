$(document).ready(function(){

  // Initializing functions for displaying map and getting user location
  initAutocomplete();
  initMap(49.2667967,-123.2056314,10, "create");
  getUserLocation();
  $("#publicSelector").attr("onclick","setEventtype('public')");
  $("#privateSelector").attr("onclick","setEventtype('private')");

  $(document).on("click", ".list-group-item", function(event) {
    var locationData =  $(this).find("h3").data("locationData");
    var placeHeader = $(this).find("h3");
    var listItem = this;

    getTimeZoneDataForPlace(locationData.lat, locationData.lng).then(function (data) {

      //Storing timezone data within the element on the page for the event, in order to read later
      $(placeHeader).data('timeZoneData', { dstOffset: data.dstOffset, rawOffset: data.rawOffset, timeZoneId: data.timeZoneId,
        timeZoneName: data.timeZoneName
      });
      setActiveListItem(listItem);
    });
  });

  $("#new_event").on("submit", function (event) {

    // Getting event start and end date/time string and user timezone
    var start_time = $("#date_timepicker_start").val();
    var end_time = $("#date_timepicker_end").val();
    var timeZoneData = $(".active").find("h3").data("timeZoneData");

    // Converting the date/time string into the time specified by the timezone of the location selected
    var start_time = moment(start_time).tz(timeZoneData.timeZoneId).format();
    var end_time = moment(end_time).tz(timeZoneData.timeZoneId).format();

    // Converting our start and end times to utc timezone, for universal storage in database
    var utc_start_time = moment.utc(start_time).format();
    var utc_end_time = moment.utc(end_time).format();

    // Filling in hidden fields with utc time that will be submitted to our controller for storage in the database
    $("#utc_start_time").val(utc_start_time);
    $("#utc_end_time").val(utc_end_time);
  });
 });

// Making a call to Google Timezone API for recieving timezone data based on providing latitude and longitude
function getTimeZoneDataForPlace(lat, lng) {
  var timestamp = Date.now() / 1000;
  var url = "https://maps.googleapis.com/maps/api/timezone/json?location="+ lat +","+ lng + "&timestamp="+ timestamp +"&key=AIzaSyBK9KGVsj13oDFAXoWJoNguMVkqnEZ9GY0";

  return $.getJSON(url);
}


// Setting a selected list item to active and filling in form fields based of Location Information
function setActiveListItem(element) {
  toggleList();
  $(".list-group-item").removeClass("active");
  element.classList.add("active");
  var locationData = $(element).find("h3").data("locationData");
  var timeZoneData = $(element).find("h3").data("timeZoneData");
  fillForm(locationData, timeZoneData);
}
