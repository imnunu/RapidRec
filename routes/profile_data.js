

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
          })/*,
          games: []*/
        };
        // rows.forEach(row => {
        //   console.log("this is each row: ", row);
        //   result.user.first_name = row.first_name;
        //   result.user.last_name = row.last_name;
        //   result.user.image = row.image;
        //   result.user.equipment = row.equipment;
        //   result.user.partUserId = row.user_id;
        //   if(row.id) {
        //     result.games.push({
        //       id: row.id,
        //       title: row.title,
        //       location: row.location,
        //       start_time: row.start_time
        //     });
        //   }
        // });

        console.log("this is finished result USERSGAMES>>>>>: ", result)
        return result;
      })
      .catch(err => {
      console.log("this is THE ERROR", err);
    });
    },


  queryUserGames: function(userId) {
    return knex('users')

      .select('games.id', 'games.title', 'games.location', 'games.start_time', 'users.first_name', 'users.last_name', 'users.image', 'participations.user_id', 'participations.equipment')
      .leftOuterJoin('participations', 'users.id', 'participations.user_id')
      .leftOuterJoin('games', 'participations.game_id', 'games.id')
      .where('users.id', '=', userId)
      .then(rows => {
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
      // console.log("this is results obj >>>>>>", results);
      // console.log("this is results.user_games.games array", results.user_games.games);
      return results;
    })
    .catch(err => {
      console.log("this is catching error in promise.all query", err);
      return err;
    });
	},

    getPostsAndCommentsForGame: function(game_id) {
    return knex('posts')
      .select('posts.id','posts.created_at', 'posts.content', 'users.first_name', 'users.last_name', 'users.image')
      .join('users', 'posts.user_id', '=', 'users.id')
      .where({ game_id })
      .orderBy('created_at', 'desc')
      .then(posts => {

        const postIds = posts.map(post => post.id);

        posts.forEach(post => {
          post.comments = [];
        });

        return knex('comments').select('comments.*', 'users.first_name', 'users.last_name', 'users.image').whereIn('post_id', postIds)
          .innerJoin('users', 'comments.user_id', 'users.id')
          .then((comments) => {
            comments.forEach(comment => {
              const myPost = posts.find(post => post.id === comment.post_id);
              myPost.comments.push(comment);
            });
            return posts;
          })
      })
  }
});


