$(document).ready(function(){

// get and format today's date
function todaysDate() {
  currDay = new Date;
  var dd = currDay.getDate();
  var mm = currDay.getMonth() + 1;
  var yyyy = currDay.getFullYear();
  if (mm < 10) {
    mm = "0" + mm;
  }
  return yyyy + '/' + mm + '/' + dd;
}

//Previous times cant be selected if current day is
function adjustTime(thisPicker) {
    var userDate = todaysDate();
    var splitedate = $(thisPicker).val().split(" ");
    if (splitedate[0] == userDate) {
      return 0;
    }
    else {
      return'00:00';
    };
  }
   //jQuery events on date pickers: Start Time and End Time
   jQuery(function(){
      jQuery.datetimepicker.setLocale('en');

      //Check date fields on inital page load
      $('#date_timepicker_start').ready(function(){
          if ($(this).text() == "") {
               $('#date_timepicker_end').prop('disabled', true);    //Disable end time if start time is not set

          } else {
               $('#date_timepicker_end').prop('disabled', false);
          }
      });

      //Check date fields on changed start time
      $('#date_timepicker_start').change(function(){
          if ($(this).val() == "" && $('#date_timepicker_end').text() == "") {
               $('#date_timepicker_end').val("");
               $('#date_timepicker_end').prop('disabled', true);  //If no start time selected dont enable end time

          } else {
               $('#date_timepicker_end').prop('disabled', false);
          }
      });

      //Inital settings for start date time picker
      jQuery('#date_timepicker_start').datetimepicker({
        onSelectDate:function(ct){
          var ptime = adjustTime('#date_timepicker_start');
          this.setOptions({
            minTime: ptime
          })
        },
      onShow:function( ct ){
       this.setOptions({
        maxDate:jQuery('#date_timepicker_end').val()?jQuery('#date_timepicker_end').val():false
       })
      },
      minTime:0,
      minDate:0,
      timepicker:true,
      scrollMonth:false,
      scrollTime:false,
      scrollInput:false,
      allowTimes:[
      '00:00', '00:30', '01:00', '01:30', '02:00', '02:30',
      '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
      '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
      '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
      '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
     ]


     });

     //Inital settings for end date time picker
     jQuery('#date_timepicker_end').datetimepicker({
      onSelectDate:function(ct){
          var ptime = adjustTime('#date_timepicker_end');
          this.setOptions({
            minTime: ptime
          })
        },
      onShow:function( ct ){
       this.setOptions({
        minDate:jQuery('#date_timepicker_start').val()?jQuery('#date_timepicker_start').val():false
       })
      },
      minTime:0,
      timepicker:true,
      scrollMonth:false,
      scrollTime:false,
      scrollInput:false,
      allowTimes:[
      '00:00', '00:30', '01:00', '01:30', '02:00', '02:30',
      '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
      '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
      '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
      '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
     ]
     });
  });
});
