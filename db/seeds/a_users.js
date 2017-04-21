exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
         knex('users').insert({first_name: 'Crumb', last_name: 'Potter', email: 'c_Potter@gmail.ca', password: 'cp', phone_number: 3069222121, skill_type: '1', image: ''}),
        knex('users').insert({first_name: 'Tim', last_name: 'Potter', email: 't_Potter@gmail.ca', password: 'tp', phone_number: 3069229876, skill_type: '5', image: ''}),
        knex('users').insert({first_name: 'Nancy', last_name: 'Potter', email: 'n_Potter@gmail.ca', password: 'np', phone_number: 3069221234, skill_type: '3', image: ''})
      ]);
    });
};
