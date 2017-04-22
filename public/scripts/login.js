$(() => {

    $('.login_submit_button').on('click', function(event){

      event.preventDefault();
      console.log("hi");
    var email = $('#email').val()
    var password = $('#password').val()
    var data = {
      email: email,
      password: password
    };
    console.log(data);


    $.ajax({
      method: "POST",
      url: "/api/login",
      data: data,
      dataType: "JSON",
      success: function(data){
        if(data!="error"){
          console.log("user was authenticated");
          window.location='/';
        }
        else{
          console.log("user was not authenticated");
        }
      },
      error: function(error){
        console.log(error);
      }
    }); //for the ajax call

  });
});


