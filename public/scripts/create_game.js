$(() => {

  $('.create_event_submit_button').on('click', function(e) {
    e.preventDefault();
    console.log('inside jquery create game');
    let title = $('.create_event_title').val();
    let location = $('.create_event_location').val();
    let start_time = $('.create_event_start_date_time').val();
    let end_time = $('.create_event_end_date_time').val();
    let equipment = $('.create_event_equipment').val();
    let description = $('.create_event_description').val();
    let numb_players = $('.create_event_number_of_players').val();
    const lat = $('.location').data('lat')
    const lng = $('.location').data('lng')


    let data = {
      title: title,
      location: location,
      start_time: start_time,
      end_time: end_time,
      equipment: equipment,
      description: description,
      number_of_players: numb_players,
      lat,
      lng
    };
    console.log("this is theeee data", data);
    $.ajax({
      method:'POST',
      url: '/api/games/new',
      data: data,
      dataType: 'JSON',
      success: function(data){
        if (data != 'error') {
          console.log('game created, dble chck db for correct data');
          console.log(data)
          window.location.href = `event/${data}`;
        } else {
          console.log('error: something went wrong!');
        }
      },
      error: function(error){
        console.log("IN SCRIPT", error.responseText);
        $('#dateError').html(error.responseText).css('color', 'red');
      }
  })
});
});
