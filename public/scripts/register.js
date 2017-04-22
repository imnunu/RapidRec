$(() => {

    $('.register_submit_button').on('click', function(event){

      event.preventDefault();
      console.log("hi");
    var first_name = $('.register_first_name').val()
    var last_name = $('.register_last_name').val()
    var email = $('.register_email').val()
    var password1 = $('.register_password').val()
    var password2 = $('.register_password_confirm').val()
    var data = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password
    };
    console.log(data);


    // $.ajax({
    //   method: "POST",
    //   url: "/api/login",
    //   data: data,
    //   dataType: "JSON",
    //   success: function(data){
    //     if(data!="error"){
    //       console.log("user was authenticated");
    //       window.location='/';
    //     }
    //     else{
    //       console.log("user was not authenticated");
    //     }
    //   },
    //   error: function(error){
    //     console.log(error);
    //   }
    // }); //for the ajax call

  });
});
