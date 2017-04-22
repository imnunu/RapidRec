exports.seed = function(knex, Promise) {
  return knex('participations').del().then(function() { knex('users').del()
    .then(function () {
      return Promise.all([
         knex('users').insert({first_name: 'Crumb', last_name: 'Potter', email: 'c_Potter@gmail.ca', password: 'cp', phone_numb: '3069222121', skill_type: '1', image: 'http://www.wikihow.com/images/6/61/Draw-a-Cartoon-Man-Step-15.jpg'}),
        knex('users').insert({first_name: 'Tim', last_name: 'Potter', email: 't_Potter@gmail.ca', password: 'tp', phone_numb: '3069229876', skill_type: '5', image: 'http://www.how-to-draw-cartoons-online.com/image-files/xhow_to_draw_people_three.gif.pagespeed.ic.rfAixqbL9D.png'}),
      ]);
    });
  });
};
