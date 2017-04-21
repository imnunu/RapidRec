exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', (table) => {
    table.increments();
    table.integer('post_id');
    table.integer('user_id');
    table.foreign('post_id').references('posts.id');
    table.foreign('user_id').references('users.id');
    table.text('content');
    table.timestamp('created_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments');
}
