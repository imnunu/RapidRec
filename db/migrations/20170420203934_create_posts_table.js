exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', (table) => {
    table.increments();
    table.integer('game_id');
    table.integer('user_id');
    table.foreign('game_id').references('games.id');
    table.foreign('user_id').references('users.id');
    table.boolean('post_type');
    table.text('content');
    table.timestamp('created_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts');
};
