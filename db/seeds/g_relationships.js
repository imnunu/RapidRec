exports.seed = function(knex, Promise) {
  return knex('relationships').del()
    .then(function () {
      return Promise.all([
        knex('relationships').insert({user_id: 3, other_id: 2, status: 'Pending'}),
        knex('relationships').insert({user_id: 3, other_id: 1, status: 'Blocked'}),
        knex('relationships').insert({user_id: 2, other_id: 1, status: 'Approved'})
      ]);
    });
};
