exports.up = function(knex, Promise) {
  return knex.schema.createTable('teams', (table) => {
    table.increments();
    table.string('team_name');
    table.timestamp('created_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('teams');
};
