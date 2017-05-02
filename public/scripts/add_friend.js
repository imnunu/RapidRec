$(() => {
  let idsOfFriends = [];
  let sessionId = $('meta[name = "session_id"]').attr('content');
  let urlId = $('meta[name = "urlId"]').attr('content');
  let friendsArray = $('meta[name = "friends_array"]').attr('content');
  let firstName = $('meta[name = "firstName"]').attr('content');
  let lastName = $('meta[name = "lastName"]').attr('content');

  function addFriend(userId) {
    $.ajax({
      method: 'POST',
      url: "/user/"+ userId + "/friend",
      dataType: 'JSON',
      success: function(data){
        console.log("anythingin here?its ddataa", data);
        window.location.reload(true);
      },
      error: function(error){
        console.log("IN SCRIPT", error.responseText);
      }
    });
  }

  function pushUrlId(sessionArrFriends) {
    sessionArrFriends.push(urldId);
  }

  $('.add-friend-submit-button').on('click', function(e) {
    e.preventDefault();
    console.log("seshid is friends w these ids: ", friendsArray);
    console.log("first name is: ", firstName);
    console.log("last name is: ", lastName);
    console.log("sesh id", sessionId);
    console.log("urlId", urlId);

    if (friendsArray) {
      for (let id in friendsArray) {
        if (urlId === friendsArray[id]) {
          $('#add_friend_popup').html("You are already friends with " + firstName + " " + lastName).css('color', 'red');
          return;
        }
      }
    }

    if (urlId === sessionId) {
      $('#add_friend_popup').html("You can't be friends with yourself").css('color', 'red');
      return;
    } else {
      addFriend(urlId);
      $('#add_friend_popup').html("You are now friends with " + firstName + " " + lastName).css('color', 'green');

      return;
    }
  });
});
