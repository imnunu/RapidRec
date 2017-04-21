exports.up = function(knex, Promise) {
  return knex.schema.createTable('relationships', (table) => {
    table.increments();
    table.integer('user_id');
    table.foreign('user_id').references('users.id');
    table.integer('other_id');
    table.string('status');
    table.timestamp('created_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('relationships');
};
