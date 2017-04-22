exports.up = function(knex, Promise) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('phone_number');
    table.string('phone_numb');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', (table)=> {
    table.dropColumn('phone_numb');
    table.integer('phone_number');
  });
};
