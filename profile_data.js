

module.exports = (knex) => ({

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
          games: []
        }
        rows.forEach(row => {
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
        return result;
      });
    },



  queryUserFriends: function(userId) {
    return knex('users')
      .select('users.first_name', 'users.last_name', 'users.image', 'relationships.status', 'relationships.other_id', 'relationships.user_id')
// leftOuterJoin means connecting left table (users table) value to match to the right table (relationships table)
// will only print rows that have the column value indicated (user.id)---ALSO must === relationships.user_id
      .leftOuterJoin('relationships', 'users.id', 'relationships.other_id')
      .where('relationships.user_id', '=', userId)
      .then(rows => {
        const result = {
          friends: []
        }
        rows.forEach(row => {
          if(row.first_name) {
            result.friends.push({
              first_name: row.first_name,
              last_name: row.last_name,
              image: row.image,
              user_id: row.user_id,
              other_id: row.other_id,
              status: row.status
            });
          }
        });
        return result;
      });
  },


	queryProfileData: function(userId) {
    return Promise.all([this.queryUserGames(userId), this.queryUserFriends(userId)])
    .then(values => {
      let results = {
        user_games: values[0],
        user_friends: values[1]
      }
      return results;
    })
    .catch(err => {
      console.log("this is catching error in promise.all query", err);
      return err;
    });
	}
});
