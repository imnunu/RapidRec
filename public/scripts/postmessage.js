$(document).ready(function() {
  let gameId = $('meta[name = "game_id"]').attr('content');
  console.log("this is in AJAAX", gameId);


  function renderPosts(posts) {
    $('#posts').empty();
    for (let newpost in posts){
      $(createPostElement(posts[newpost])).prependTo('#posts');
    }
  }

  function createPostElement(post) {
}

function loadPosts() {
  $.ajax ({
    method: 'GET',
    url: '/event/' + gameId,
    success: function(posts) {
      renderPosts(posts);
      $("main textarea").val("");
      $("main textarea").focus();
    },
    error: function(err) {
      console.error("oh no!!!", err);
    }
  })
}
//event handlers

$('section.new-post').css("display", "none");
$('#usr-nav').on('click', function(e){
    $('section.new-post').slideToggle();
    $('section textarea').focus();
  });

$('.new-post form').on('submit', function (e) {
  e.preventDefault();

  $('#error').text("");
  var newPost = $('.new-post textarea').val().trim();
  if (newPost.length === 0) {
    $('#error').text("Cannot post empty message.");
  } else {
    $.ajax ({
      method: 'POST',
      url: '/addComment',
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
