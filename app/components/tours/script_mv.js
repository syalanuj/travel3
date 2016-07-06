$(document).ready(function(){
    $("#sticker").sticky({topSpacing:40});
	//$(".sticker2").sticky({topSpacing:0});//
  });
  
  
  (function($) {
  $('.spinner .btn:first-of-type').on('click', function() {
    $('.spinner input').val(parseInt($('.spinner input').val(), 10) + 1);
  });
  $('.spinner .btn:last-of-type').on('click', function() {
    $('.spinner input').val(parseInt($('.spinner input').val(), 10) - 1);
  });
})(jQuery);

$(window).scroll(function() {    
    var scroll = $(window).scrollTop();
    	if (scroll >= $(".intro-photo").height()-40) {
            $(".sale-info").removeClass("bottom-zero");
            $(".sale-info").addClass("fixed-top");
            $('.sale-info').css('z-index', '3');
            }
    else {
            $(".sale-info").addClass("bottom-zero");
            $(".sale-info").removeClass("fixed-top");
            }
});