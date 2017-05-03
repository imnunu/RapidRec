

function loadPage(id){
    console.log('loadPage called');
  $.ajax({
    method: "GET",
    url: "/api/event/" + id
  }).done((info) => {
    console.log('loadPAGE in event script')
    console.log('THE INFO', JSON.stringify(info, null, 2));
    console.log('items found in INFO');
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

// function loadGameMembers(){

// };

function createMembersElement(item){
  let $members = $('<div>').addClass('list-group')
  .append($('<a>').attr('href', '/profile/' + item.id).addClass('btn-warning btn btn-sm btn-block'))
}
