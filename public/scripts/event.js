

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
      console.log(item);
      $('#intro .event_title').text(item.title);
      $('#intro .description').text('Description: ' + item.description);
      $('#intro .event_location').text('Location: ' + item.location);
      $('#intro .number_of_players').text('Players: ' + item.number_of_players);
      $('#intro .event_start_time').text('Start time: ' + moment(item.start_time).calendar());
      $('#intro .event_end_time').text('End time: ' + moment(item.end_time).calendar());
    });
    // for(i of info) {
    //   $("<div>").text('Location: ' + i.location).appendTo($("#intro > event_title"));

  });
}

// function loadGameMembers(){

// };

function createMembersElement(item){
  let $members = $('<div>').addClass('list-group')
  .append($('<a>').attr('href', '/profile/' + item.id).addClass('list-group-item'))
}
