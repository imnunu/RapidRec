

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
      .select('games.id', 'games.title', 'games.location', 'games.start_time', 'users.first_name', 'users.last_name', 'users.image')
      .leftOuterJoin('participations', 'users.id', 'participations.user_id')
      .leftOuterJoin('games', 'participations.game_id', 'games.id')
      .where('users.id', '=', userId)
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
        rows.forEach(row => {
          // console.log("this is each row: ", row);
          result.user.first_name = row.first_name;
          result.user.last_name = row.last_name;
          result.user.image = row.image;
          if(row.id) {
            result.games.push({
              id: row.id,
              title: row.title,
              location: row.location,
              start_time: row.start_time
            });
          }
        });
        // console.log("this is finished result USERSGAMES>>>>>: ", result)
        return result;
      });
    },



  queryUserFriends: function(userId) {
    return knex('users')
      .select('users.first_name', 'users.last_name', 'relationships.status')
      .leftOuterJoin('relationships', 'relationships.user_id', 'users.id')
      .where('users.id', '=', userId)
      .then(rows => {
        const result = {
          friends: []
        }
        // console.log("rows is: ", rows);
        rows.forEach(row => {
          // console.log("this is each row FOR USERS FRIENDS: ", row);
          if(row.id) {
            result.friends.push({
              first_name: row.first_name,
              last_name: row.last_name
            });
          }
        });
        // console.log("this is finished result USERSFRIENDS>>>>>: ", result)
        return result;
      });
  },



	queryProfileData: function(userId) {
    Promise.all([this.queryUserGames(userId), this.queryUserFriends(userId)])
    .then(values => {
      console.log("these are results from both games/friends queries:", values[0])
      return values[0];
    })
    .then(rows => {
      console.log("this ir rowsss", rows);
      const result = {
        user: []
      }
      rows.forEach(row => {
        let test = { testing: row.user.first_name}
      //   console.log("this is each row: ", row);
      //   result.user.first_name = row.first_name;
      //   result.user.last_name = row.last_name;
      //   result.user.image = row.image;
      //   if(row.id) {
      //     result.user.push({
      //       id: row.id,
      //       title: row.title,
      //       location: row.location,
      //       start_time: row.start_time
      //     });
      //   } console.log('THIS IS THE RESULTTTTTTT', result);
      // return result;
      });
      console.log('THIS IS THE RESULTTTTTTT', test);
      return test;
    })
    .catch(err => {
      console.log("this is catching error in promise.all query", err);
    });
// ([games, friends])


		// return knex('users')
	 //    .select('games.id', 'games.title', 'games.location', 'games.start_time', 'users.first_name', 'users.last_name', 'users.image', 'relationships.other_id', 'relationships.status')
	 //    .leftOuterJoin('participations', 'users.id', 'participations.user_id')
	 //    .leftOuterJoin('games', 'participations.game_id', 'games.id')
  //     .leftOuterJoin('relationships', 'relationships.user_id', 'users.id')
  //     .leftOuterJoin('users AS other_users', 'relationships.other_id', 'other_users.id')
	 //    .where('users.id', '=', userId)
  //     .where('relationships.user_id', '=', userId)
	 //    .then(rows => {
	 //    	const result = {
	 //    		user: {
	 //    			first_name: '',
	 //    			last_name: '',
	 //    			image: '',
	 //    		},
	 //    		games: [],
  //         relationships: {
  //           other_id: '',
  //           status: ''
  //         }
	 //    	}
  //       console.log("rows is: ", rows);
	 //    	rows.forEach(row => {
  //         console.log("this is each row: ", row);
	 //    		result.user.first_name = row.first_name;
	 //    		result.user.last_name = row.last_name;
	 //    		result.user.image = row.image;
  //         result.relationships.other_id = row.other_users.first_name;
  //         if(row.id) {
  // 	    		result.games.push({
  //             id: row.id,
  //             title: row.title,
  //             location: row.location,
  //             start_time: row.start_time
  // 	    		});
  //         }
	 //    	});
  //       console.log("this is finished result>>>>>: ", result)
	 //    	return result;
	 //    });
	}
});
