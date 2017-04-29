$(() => {
  $.ajax({
    method: "GET",
    url: "/api/posts"
  }).done((events) => {
    for(post of posts) {
      $("<div>").text(post.name).appendTo($("body"));
    }
  });
});

