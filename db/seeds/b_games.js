exports.seed = function(knex, Promise) {
  return knex('games').del()
    .then(function () {
      return Promise.all([
        knex('games').insert({location: '1234 Basket Street', start_time: '2020-03-21T12:00:00', end_time: '2020-03-21T14:00:00', equipment: true, description: 'Court is located behind the school', number_of_players: 6, title: 'The Boyz'}),
        knex('games').insert({location: '567 Hoops Blv', start_time: '2020-03-23T17:30:00', end_time: '2020-03-21T18:00:00', equipment: false, description: 'this is a description', number_of_players: 4, title: 'Champs'}),
        knex('games').insert({location: '8912 Pave Street', start_time: '2020-03-23T19:00:00', end_time: '2020-03-23T21:00:00', equipment: false, description: 'This court is really nice! Someone bring a ball!', number_of_players: 6, title: 'EastSide'})
      ]);
    });
};
