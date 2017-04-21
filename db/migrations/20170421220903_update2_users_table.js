exports.up = function(knex, Promise) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('phone_number');
    table.string('phone_number_');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', (table)=> {
    table.dropColumn('phone_number_');
    table.integer('phone_number');
  });
};
