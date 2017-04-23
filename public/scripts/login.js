$(() => {

    $('.login_submit_button').on('click', function(event){
    event.preventDefault();
    var email = $('#email').val()
    var password = $('#password').val()
    var data = {
      email: email,
      password: password
    };

    $.ajax({
      method: "POST",
      url: "/api/login",
      data: data,
      dataType: "JSON",
      success: function(data){
          console.log(data);
        if(data!="error"){
          window.location='/';
        }
        else{
        $('#login_error').html('Invalid Credentials').css('color', 'red');
        }
      },
      error: function(error){
        $('#login_error').html(error.responseText).css('color', 'red');
      }
    }); //for the ajax call

  });
});


