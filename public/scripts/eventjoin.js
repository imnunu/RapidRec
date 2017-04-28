$(() => {

function joinEvent(eventID) {
  $.ajax({
    type: 'POST',
    url: '/events/' + event.id + '/join',
    dataType: 'JSON',
    data: data,
    success: function(data) {
      window.location.href = '/events/' + event.id
    },
    error: function(data) {
      console.log(error);
    }
  });
}

function dropEvent(eventID) {
  $.ajax({
    type: "POST",
    url: "/index",
    dataType: "JSON",
    data: data,
    success: function(data) {
      window.location.href = "/events/" + event.id;
    },
    error: function(data) {
      console.log(error);
    }
 });
}


})

