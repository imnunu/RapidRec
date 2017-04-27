$(() => {
  $.ajax({
    method: "GET",
    url: "/api/events"
  }).done((events) => {
    for(event of events) {
      $("<div>").text(event.name).appendTo($("body"));
    }
  });;
});
