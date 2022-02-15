//preloading for page
$(window).on('load', function() { // makes sure the whole site is loaded 
	var status = $('#status');
	var preloader = $('#preloader');
	var body = $('body');
	status.fadeOut(); // will first fade out the loading animation 
	preloader.delay(0).fadeOut('fast'); // will fade out the white DIV that covers the website. 
	body.delay(0).css({'overflow':'visible'});
	var vidDefer = document.getElementsByTagName('iframe');
	for (var i=0; i<vidDefer.length; i++) {
		if(vidDefer[i].getAttribute('data-src')) {
			vidDefer[i].setAttribute('src',vidDefer[i].getAttribute('data-src'));
		} 
	}
})
$(function(){
	'use strict';

	//js for nav icon 
	var clickMenubtn = $('#nav-icon1');
	clickMenubtn.on('click', function(){
		$(this).toggleClass('open');
	});
	//js for tabs
	var tabsClick = $('.tabs .tab-links a, .tab-links-2 a, .tab-links-3 a');
	var multiItem = $('.slick-multiItem');
	var multiItem2 = $('.slick-multiItem2');
	tabsClick.on('click', function(e)  {
		var currentAttrValue = $(this).attr('href');
		var tabsCurrent = $('.tabs ' + currentAttrValue);
		// Show/Hide Tabs
		tabsCurrent.show().siblings().hide();
		// Change/remove current tab to active
		$(this).parent('li').addClass('active').siblings().removeClass('active');
		e.preventDefault();
		//reset position for tabs
		multiItem.slick('setPosition');
		multiItem2.slick('setPosition');
	});
	

	//back to top js
	var backtotop = $('#back-to-top');
    backtotop.on('click', function (e) {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: 0
        }, 700);
    });

   // scroll down landing page
	var scrolldownlanding = $('#discover-now');
    scrolldownlanding.on('click', function (e) {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: $(document).height()-$(window).height()
        }, 700);
    });

});
