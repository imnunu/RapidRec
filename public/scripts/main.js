$(document).ready(function($){

	// load page
	new WOW().init();

	jQuery(window).load(function() {
		jQuery("#preloader").delay(100).fadeOut("slow");
		jQuery("#load").delay(100).fadeOut("slow");
	});


	// jQuery to collapse the navbar on scroll
	$(window).scroll(function() {
		if ($(".navbar").offset().top > 50) {
			$(".navbar-fixed-top").addClass("top-nav-collapse");
		} else {
			$(".navbar-fixed-top").removeClass("top-nav-collapse");
		}
	});


// time picker

	$(function(){
		$('*[name=start_time]').appendDtpicker();
	});

	$(function(){
		$('*[name=end_time]').appendDtpicker();
	});

	$(function () {
	  $('[data-toggle="popover"]').popover()
	})

	$(function () {
	$('[data-toggle="tooltip"]').tooltip()
	})



});
