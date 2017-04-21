exports.up = function(knex, Promise) {
  return knex.schema.table('teams_users', (table) => {
    table.dropColumn('dropthisinupdate')
    table.increments();
    table.integer('team_id');
    table.integer('user_id');
    table.foreign('team_id').references('teams.id');
    table.foreign('user_id').references('users.id');
    table.timestamp('created_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('teams_users', (table) => {
    table.dropColumns('id', 'team_id', 'user_id', 'created_at');
    table.string('dropthisinupdate');
  });
};

