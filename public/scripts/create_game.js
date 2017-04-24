$(() => {

  $('.create_event_submit_button').on('click', function(e) {
    console.log('inside jquery create game');
    let title= $('.create_event_title').val();
    let location= $('.create_event_location').val();
    let start_time= $('.create_event_start_date_time').val();
    let end_time= $('.create_event_end_date_time').val();
    let equipment= $('.create_event_equipment').val();
    let description= $('.create_event_description').val();
    let numb_players= $('.create_event_number_of_players').val();

    if () {
      $('')
    }

    e.preventDefault();
    let data = {
      title: title,
      location: location,
      start_time: start_time,
      end_time: end_time,
      equipment: equipment,
      description: description,
      number_of_players: numb_players,
      errors: flash("error"),
      info: flash("info")
    };
    $.ajax({
      method:'POST',
      url: '/api/games/new',
      data: data,
      dataType: 'JSON',
      success: function(data){
        if (data!='error') {
          console.log('game created, dble chck db for correct data');
        } else {
          console.log('error: something went wrong!');
        }
      }
    });
  });
});
