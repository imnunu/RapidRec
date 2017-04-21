exports.seed = function(knex, Promise) {
  return knex('games_type').del()
    .then(function () {
      return Promise.all([
    // true = public ! false = private !
    // private time in minutes ?
        knex('games_type').insert({type: true, timer: 0, game_id: 1}),
        knex('games_type').insert({type: false, timer: 120, game_id: 2}),
        knex('games_type').insert({type: false, timer: 120, game_id: 3})
      ]);
    });
};
