exports.seed = function(knex, Promise) {
  return knex('comments').del()
    .then(function () {
      return Promise.all([
        knex('comments').insert({post_id: 1, user_id: 2, content: 'Courts were alright'}),
        knex('comments').insert({post_id: 2, user_id: 1, content: 'where did that rain come frum?'}),
        knex('comments').insert({post_id: 2, user_id: 3, content: 'da best game ever'})
      ]);
    });
};
