exports.seed = function(knex, Promise) {
  return knex('participations').del()
    .then(function () {
      return Promise.all([
        knex('participations').insert({game_id: 27, user_id: 34}),
        knex('participations').insert({game_id: 27, user_id: 33}),
        knex('participations').insert({game_id: 27, user_id: 34}),
        knex('participations').insert({game_id: 28, user_id: 33}),
        knex('participations').insert({game_id: 28, user_id: 34})
      ]);
    });
}
