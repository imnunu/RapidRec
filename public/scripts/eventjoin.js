
function joinEvent(eventID) {
  $.ajax({
    method: 'POST',
    url: '/api/event/' + eventID+ '/join',
    dataType: 'JSON',
    data: {},
    success: function(data) {
      window.location.reload();
    },
    error: function(data) {
      console.log(error);
    }
  });
}

function dropEvent(eventID) {
  $.ajax({
    method: "POST",
    url: "/index",
    dataType: "JSON",
    data: data,
    success: function(data) {
      window.location.href = "/event/" + event.id;
    },
    error: function(data) {
      console.log(error);
    }
 });
}


$(() => {
$('#joinGame').on('click', function(e) {
  e.preventDefault();
  joinEvent(myId);
  console.log('THE IDDDDD', myId);
})
});
