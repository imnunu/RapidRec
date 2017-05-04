$(() => {

function joinEvent(eventID) {
  let equipment = $('.join_event_equipment')[0].checked;
  let data = equipment
  $.ajax({
    method: 'POST',
    url: '/api/event/' + eventID + '/join',
    dataType: 'JSON',
    data: {data},
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
    url: '/api/event/' + eventID + '/drop',
    dataType: "JSON",
    data: {},
    success: function(data) {
      window.location.reload();
    },
    error: function(data) {
    }
 });
}



 $('#joinGame').on('click', function(e) {
    e.preventDefault();
    $('#joinToggle').slideToggle(200).css("display", "block");
  })

 $('.join_event_submit_button').on('click', function(e) {
    e.preventDefault();
    joinEvent(myId);
  });

  $('#dropGame').on('click', function(e) {
    e.preventDefault();
    dropEvent(myId);
  })
});


