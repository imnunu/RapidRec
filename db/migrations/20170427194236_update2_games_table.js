exports.up = function(knex, Promise) {
  return knex.schema.table('games', (table) => {
    table.float('lat');
    table.float('lng');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('games', (table)=> {
    table.dropColumns('lat', 'lng');
  });
};
