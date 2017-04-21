exports.up = function(knex, Promise) {
  return knex.schema.createTable('teams_users', (table) => {
    table.increments();
    table.integer('team_id');
    table.integer('user_id');
    table.foreign('team_id').references('teams.id');
    table.foreign('user_id').references('users.id');
    table.timestamp('created_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('teams_users');
};
