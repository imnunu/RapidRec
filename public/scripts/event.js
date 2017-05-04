function loadPage(id){
  $.ajax({
    method: "GET",
    url: "/api/event/" + id
  }).done((info) => {
    info.forEach(function (item) {
      $('#page-title .event_title').text(item.title);
      $('#event_details .description').text(item.description);
      $('#event_details .event_location').text(item.location);
      $('#event_details .number_of_players').text(item.number_of_players);
      $('#event_details .event_start_time').text(moment(item.start_time).calendar());
      $('#event_details .event_end_time').text(moment(item.end_time).calendar());
    });

  });
}

function createMembersElement(item){
  let $members = $('<div>').addClass('list-group')
  .append($('<a>').attr('href', '/profile/' + item.id).addClass('btn-warning btn btn-sm btn-block'))
}
