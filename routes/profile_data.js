

module.exports = (knex) => ({

  queryUserGames: function(userId) {
    return knex('users')
      .select('games.id', 'games.title', 'games.location', 'games.start_time', 'users.first_name', 'users.last_name', 'users.image', 'participations.user_id', 'participations.equipment')
      .leftOuterJoin('participations', 'users.id', 'participations.user_id')
      .leftOuterJoin('games', 'participations.game_id', 'games.id')
      .where('users.id', '=', userId)
      .then(rows => {
        console.log('THESE ARE THE ROWS IN QUERY USER GAME: ', rows);
        const result = {
          user: {
            first_name: '',
            last_name: '',
            image: '',
            equipment: '',
            partUserId: '',
          },
          games: []
        }
        rows.forEach(row => {
          console.log("this is each row: ", row);
          result.user.first_name = row.first_name;
          result.user.last_name = row.last_name;
          result.user.image = row.image;
          result.user.equipment = row.equipment;
          result.user.partUserId = row.user_id;
          if(row.id) {
            result.games.push({
              id: row.id,
              title: row.title,
              location: row.location,
              start_time: row.start_time
            });
          }
        });

        console.log("this is finished result USERSGAMES>>>>>: ", result)
        return result;
      })
      .catch(err => {
      console.log("this is THE ERROR", err);
    });
    },



  queryUserFriends: function(userId) {
    return knex('users')
      .select('users.first_name', 'users.last_name', 'relationships.status')
// leftOuterJoin means connecting left table (users table) value to match to the right table (relationships table)
// will only print rows that have the column value indicated (user.id)---ALSO must === relationships.user_id
      .leftOuterJoin('relationships', 'users.id', 'relationships.other_id')
      .where('relationships.user_id', '=', userId)
      .then(rows => {
        const result = {
          friends: []
        }
        // console.log("rows is: ", rows);
        rows.forEach(row => {
          // console.log("this is each row FOR USERS FRIENDS: ", row);
          if(row.first_name) {
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
    return Promise.all([this.queryUserGames(userId), this.queryUserFriends(userId)])
    .then(values => {
      // console.log("these are results from both games/friends queries:", values[0], values[1])
      let results = {
        user_games: values[0],
        user_friends: values[1]
      }
      console.log("this is results obj >>>>>>", results);
      console.log("this is results.user_games.games array", results.user_games.games);
      return results;
    })
    .catch(err => {
      console.log("this is catching error in promise.all query", err);
      return err;
    });
	}
});
