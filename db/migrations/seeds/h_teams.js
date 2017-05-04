exports.seed = function(knex, Promise) {
  return knex('teams').del()
    .then(function () {
      return Promise.all([
        knex('teams').insert({team_name: 'Rokstarz'}),
        knex('teams').insert({team_name: 'Hoopsters'}),
      ]);
    });
};
