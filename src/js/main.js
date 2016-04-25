$(document).on('scroll', function() {
	if($(document).scrollTop() > 200) {
		$('.header').addClass('scrolled');
	} else {
		$('.header').removeClass('scrolled');
	}
});