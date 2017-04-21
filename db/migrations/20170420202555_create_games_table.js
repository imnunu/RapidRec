exports.up = function(knex, Promise) {
  return knex.schema.createTable('games', (table) => {
    table.increments();
    table.string('location');
    table.dateTime('start_time');
    table.dateTime('end_time');
    table.boolean('equipment');
    table.string('description');
    table.integer('number_of_players');
    table.timestamp('created_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('games');
};
