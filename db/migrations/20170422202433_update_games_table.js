exports.up = function(knex, Promise) {
  return knex.schema.table('games', (table) => {
    table.string('title');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('games', (table)=> {
    table.dropColumn('title');
  });
};
