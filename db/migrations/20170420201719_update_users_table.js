exports.up = function(knex, Promise) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('name');
    table.string('first_name');
    table.string('last_name');
    table.string('email');
    table.string('password');
    table.integer('phone_number');
    table.string('skill_type');
    table.string('image');
    table.timestamp('created_at');

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', (table)=> {
    table.dropColumns('first_name', 'last_name', 'email', 'password', 'phone_number', 'skill_type', 'image', 'created_at');
    table.string('name');
  });
};
