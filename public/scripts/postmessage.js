$(document).ready(function() {

  function renderPosts(posts) {
    $('#posts').empty();
    for (let newpost in posts){
      $(createPostElement(posts[newpost])).prependTo('#posts');
    }
  }

  function createPostElement(post) {
    return $('<article>', {
      class: "post",
      html: [
        createHeader(post),
        createBody(post),
        //createFooter(post)
      ]
    })
}

function createHeader(data) {
  var $header = $('<header></header>')
  $header.append($('<h3></h3>').text(data.first_name))
  return $header;
}

function createBody(data) {
  var $body = $('<div>')
  $body.append($('<p>').text(data.content));
  return $body;
}

function createFooter(data) {
  var $footer = $('<footer>')
  $footer.append($('<p>').text(data.created_at));
  return $footer;
}

function loadPosts() {
  $.ajax ({
    method: 'GET',
    url: '/posts/3',
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

$('section.posts').css("display", "none");
$('#usr-nav').on('click', function(e){
    $('section.post').slideToggle();
    $('section textarea').focus();
  });

$('.new-post form').on('submit', function (e) {
  e.preventDefault();

  $('#error').text("");
  var newPost = $('.new-post textarea');
  var newPostText = newPost.val().trim();
  if (newPostText.length === 0) {
    $('#error').text("Cannot post empty message.");
  } else {
    $.ajax ({
      method: 'POST',
      url: '/posts',
      data: {
        content: newPostText
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
