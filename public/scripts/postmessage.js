$(document).ready(function() {
  let gameId = $('meta[name = "game_id"]').attr('content');

  function renderPosts(posts) {
    $('#posts').empty();
    for (let newpost in posts){
      $(createBody(posts[newpost])).prependTo('#posts');
    }
  }

function createPostElement(newpost) {
  let post = $('<article>', {
    class: "post-content",
    html: [
    //createHeader(newpost),
    createBody(newpost),
    //createFooter(newpost)
    ]
  });
}

function createHeader(data) {
}

function createBody(data) {
  var body = $('<div>')
  body.append($('<p>').text(data.content));
  return body;
}

function createFooter(data) {

}

function loadPosts() {
  $.ajax ({
    method: 'GET',
    url: '/event/' + gameId,
    success: function(posts) {
      renderPosts(posts);
      $("main textarea").val("").focus();
    },
    error: function(err) {
      console.error("oh no!!!", err);
    }
  })
}
//event handlers

$('.new-post form').on('submit', function (e) {
  e.preventDefault();

  $('#error').text("");
  var newPost = $('.new-post textarea').val().trim();
  if (newPost.length === 0) {
    $('#error').text("Cannot post empty message.");
  } else {
    $.ajax ({
      method: 'POST',
      url: '/event/' + gameId + '/addPosts',
      data: {
        content: newPost
      },
      success: function() {
        loadPosts();
      },
      error: function() {
      }
    })
}
});

loadPosts();

})
