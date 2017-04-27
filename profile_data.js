

module.exports = (knex) => ({

	/*
	{
		user: {
			firstName: 'foo'.
			lastName: 'bar',
			image: 'images',
		}
		games: [
			{
				id: 1,
				location: 'vancouver',
				...
			},
			{

			}
		]
	}
	*/

  queryUserGames: function(userId) {
    return knex('users')
      .select('games.id', 'games.title', 'games.location', 'games.start_time', 'users.first_name', 'users.last_name', 'users.image', 'relationships.other_id', 'relationships.status')
      .leftOuterJoin('participations', 'users.id', 'participations.user_id')
      .leftOuterJoin('games', 'participations.game_id', 'games.id')
      .where('users.id', '=', userId)
      .then(rows => {
        // blah
        return result;
      })
    },

  queryUserFriends: function(userId) {
  },

	queryProfileData: function(userId) {
    Promise.all([this.queryUserGames(userId), this.queryUserFriends(userId)])
    .then(([games, friends]) => {results.queryUserGames});

		return knex('users')
	    .select('games.id', 'games.title', 'games.location', 'games.start_time', 'users.first_name', 'users.last_name', 'users.image', 'relationships.other_id', 'relationships.status')
	    .leftOuterJoin('participations', 'users.id', 'participations.user_id')
	    .leftOuterJoin('games', 'participations.game_id', 'games.id')
      .leftOuterJoin('relationships', 'relationships.user_id', 'users.id')
      .leftOuterJoin('users AS other_users', 'relationships.other_id', 'other_users.id')
	    .where('users.id', '=', userId)
      .where('relationships.user_id', '=', userId)
	    .then(rows => {
	    	const result = {
	    		user: {
	    			first_name: '',
	    			last_name: '',
	    			image: '',
	    		},
	    		games: [],
          relationships: {
            other_id: '',
            status: ''
          }
	    	}
        console.log("rows is: ", rows);
	    	rows.forEach(row => {
          console.log("this is each row: ", row);
	    		result.user.first_name = row.first_name;
	    		result.user.last_name = row.last_name;
	    		result.user.image = row.image;
          result.relationships.other_id = row.other_users.first_name;
          if(row.id) {
  	    		result.games.push({
              id: row.id,
              title: row.title,
              location: row.location,
              start_time: row.start_time
  	    		});
          }
	    	});
        console.log("this is finished result>>>>>: ", result)
	    	return result;
	    });
	}
});
