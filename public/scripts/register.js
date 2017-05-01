$(() => {

    $('.register_submit_button').on('click', function(event){
        var first_name = $('.register_first_name').val()
        var last_name = $('.register_last_name').val()
        var email = $('.register_email').val()
        var password = $('.register_password').val()
        var password2 = $('.register_password_confirm').val()

        if (password !== password2) {
          event.preventDefault();
          $('#register_error').html("Passwords don't match").css('color', 'red');
        } else {
            event.preventDefault();
            var data = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password
            };
            $.ajax({
              method: "POST",
              url: "/api/register",
              data: data,
              dataType: "JSON",
              success: function(data){
                if(data!='error'){
                  console.log("user was registered");
                  window.location.reload(true)
                } else {
                  console.log("error: user was not registered");
                }
              },
              error: function(error){
                $('#register_error').html(error.responseText).css('color', 'red');
              }
            }); //ajax
        }
      });

  });

