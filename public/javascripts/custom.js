(function($) { 		
	 "use strict";
	 
	 $('.slide').prepend('<div class="patternOverlay"></div>');	
	 
	// for mobile nav js	
	$('button.navbar-toggle').on( "click", function() {
		$(this).toggleClass('active');
		$('.navbar-collapse').slideToggle();										 
	});			


	$('.navbar-collapse li a').on( "click", function() {
		$('.navbar-collapse.collapse').removeClass('active');
		$('button.navbar-toggle').removeClass('active');
	});	

	
	$(".menuItem").on({
    mouseenter: function () {
        $(this).addClass('active');	
    },
    mouseleave: function () {
        $(this).removeClass('active');	
    }
	});
	
	$('input[type=radio][name=guestAttending]').change(function() {
        if (this.value == 'true') {
            $("#guestTotalRow").show();
        }
        else if (this.value == 'false') {
            $("#guestTotalRow").hide();
        }
    });
	
	if($(window).width()<1000){
		$('.navbar-nav li a').on( "click", function() {
			$('.navbar-collapse.collapse').removeClass('in');										 
		});
	}

	// Somth page scroll
    $('#navigation a, .smooth, a[href^="#theCouple"]').on( "click", function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });

}(jQuery));


