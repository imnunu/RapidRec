exports.seed = function(knex, Promise) {
  return knex('comments').del().then(function () {
    return knex('posts').select('id')
  })
    .then(function (rows) {
      let id = rows[0].id;
      let id2 = rows[1].id;
      return Promise.all([
        knex('comments').insert({post_id: id, user_id: 2, content: 'Courts were alright'}),
        knex('comments').insert({post_id: id2, user_id: 1, content: 'where did that rain come frum?'}),
        knex('comments').insert({post_id: id2, user_id: 2, content: 'da best game ever'})
      ]);
    });
};
