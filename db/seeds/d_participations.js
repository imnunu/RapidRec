exports.seed = function(knex, Promise) {
  return knex('participations').del()
    .then(function () {
      return Promise.all([
        knex('participations').insert({game_id: 1, user_id: 3}),
        knex('participations').insert({game_id: 1, user_id: 2}),
        knex('participations').insert({game_id: 1, user_id: 1}),
        knex('participations').insert({game_id: 2, user_id: 3}),
        knex('participations').insert({game_id: 2, user_id: 1}),
        knex('participations').insert({game_id: 3, user_id: 3}),
        knex('participations').insert({game_id: 3, user_id: 2}),
        knex('participations').insert({game_id: 3, user_id: 1}),
      ]);
    });
};
