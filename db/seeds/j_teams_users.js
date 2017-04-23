exports.seed = function(knex, Promise) {
  return knex('teams_users').del()
    .then(function () {
      return Promise.all([
        knex('teams_users').insert({team_id: 1, user_id: 1}),
        knex('teams_users').insert({team_id: 2, user_id: 1}),
        knex('teams_users').insert({team_id: 2, user_id: 2})
      ]);
    });
};
