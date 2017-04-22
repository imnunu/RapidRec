exports.seed = function(knex, Promise) {
  return knex('games_type').del().then(function () {
    knex('games').select('id').where({id: '567 Hoops Blv'}).limit(1)
  })
    .then(function (rows) {
      console.log(rows);
      let id = rows.id
      return Promise.all([
    // true = public
    // false = private
    // private time in minutes ?
        knex('games_type').insert({type: true, timer: 0, game_id: 37}),
      ]);
    });
};
