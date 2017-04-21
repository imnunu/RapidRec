exports.up = function(knex, Promise) {
  return knex.schema.createTable('games_type', (table) => {
    table.increments();
    table.boolean('type');
    table.integer('timer');
    table.integer('game_id');
    table.foreign('game_id').references('games.id');
    table.timestamp('created_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('games_type');
};
