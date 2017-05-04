

module.exports = (knex) => ({

    queryPartPlayers: function(gameId) {
      return knex('users')
      .select('users.first_name', 'users.last_name', 'participations.equipment', 'participations.user_id')
      .innerJoin('participations', 'users.id', '=', 'participations.user_id')
      .where('participations.game_id', '=', gameId)
      .orderBy('participations.created_at', 'desc')
      .then(rows => {
        console.log('THESE ARE THE ROWS IN QUERY USER GAME: ', rows);
        const result = {
          users: rows.map(row => {
            return {
              first_name: row.first_name,
              last_name: row.last_name,
              equipment: row.equipment,
              partUserId: row.user_id
            };
          })
        };
        return result;
      })
      .catch(err => {
      console.log("this is THE ERROR", err);
    });
    },


  queryUserGames: function(userId) {
    return knex('users')

      .select('games.id', 'games.title', 'games.location', 'games.start_time', 'games.end_time', 'users.first_name', 'users.last_name', 'users.image', 'participations.user_id', 'participations.equipment')
      .leftOuterJoin('participations', 'users.id', 'participations.user_id')
      .leftOuterJoin('games', 'participations.game_id', 'games.id')
      .where('users.id', '=', userId)
      .then(rows => {

        const result = {
          user: {
            first_name: '',
            last_name: '',
            image: ''
            // equipment: '',
            // partUserId: '',
          },
          games: []
        }
        rows.forEach(row => {
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
              start_time: row.start_time,
              end_time: row.end_time
            });
          }
        });

        return result;
      })
      .catch(err => {
      console.log("this is THE ERROR", err);
    });
    },



  queryUserFriends: function(userId) {
    return knex('users')
      .select('users.id', 'users.first_name', 'users.last_name', 'users.image', 'relationships.status', 'relationships.other_id', 'relationships.user_id')
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
              id: row.id,
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
	},

  getPostsAndCommentsForGame: function(game_id) {
    return knex('posts')
      .select('*')
      .where({ game_id })
      .then(posts => {
        const postIds = posts.map(post => post.id);
        return knex('comments').select('*').whereIn('post_id', postIds)
          .then(comments => {
            comments.forEach(comment => {
              const post = posts.find(post => post.id === comment.post_id);
              post.comments = post.comment || [];
              post.comments.push(comment)
            });
            return posts;
          })
      })
  }
});
