exports.up = function(knex, Promise) {
  return knex.schema.table('participations', (table) => {
    table.boolean('equipment');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('participations', (table)=> {
    table.dropColumns('equipment');
  });
};
