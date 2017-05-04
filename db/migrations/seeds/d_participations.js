exports.seed = function(knex, Promise) {
  return knex('participations').del().then(function () {
    return knex('users')
  })
  .then(function () {
    return knex('games').select('id')
  })
    .then(function (rows) {
      let id = rows[0].id;
      let id2 = rows[1].id;
      let id3 = rows[2].id;
      let id4 = rows[3].id;
      return Promise.all([
        knex('participations').insert({game_id: id, user_id: 1}),
        knex('participations').insert({game_id: id, user_id: 2}),
        knex('participations').insert({game_id: id2, user_id: 1}),
        knex('participations').insert({game_id: id2, user_id: 2}),
        knex('participations').insert({game_id: id3, user_id: 1}),
        knex('participations').insert({game_id: id3, user_id: 2}),
        knex('participations').insert({game_id: id4, user_id: 1}),
        knex('participations').insert({game_id: id4, user_id: 2})
      ]);
    });
}
