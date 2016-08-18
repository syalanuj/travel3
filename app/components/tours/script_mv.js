$(document).ready(function () {
    var naji = $('.asfeatured').height() + $('.sectionsix').height() + $('.footer').height() + 450;
    $("#sticker").sticky({
        topSpacing: 40
        , bottomSpacing: naji
    });
});
(function ($) {
    $('.spinner .btn:first-of-type').on('click', function () {
        $('.spinner input').val(parseInt($('.spinner input').val(), 10) + 1);
    });
    $('.spinner .btn:last-of-type').on('click', function () {
        $('.spinner input').val(parseInt($('.spinner input').val(), 10) - 1);
    });
})(jQuery);
$(window).scroll(function () {
    var scroll = $(window).scrollTop();
    var leftDo = $(window).width() - $('.son-width').width()
    var leftDoTwo = leftDo / 2;
    if (scroll >= $(".intro-photo").height() - 40 && $(window).width() < 990) {
        $(".sale-info").css('width', '100%');
        $(".sale-info").css('left', '0');
        $(".sale-info").addClass("fixed-top");
        $(".sale-info").removeClass("bottom-zero");
        $("#sticker").removeAttr('id');
    }
    else if (scroll >= $(".intro-photo").height() - 90) {
        $(".sale-info").removeClass("bottom-zero");
        $(".sale-info").addClass("fixed-top");
        $('.sale-info').css('z-index', '3');
        $(".sale-info").css({
            'width': ($(".green-bodah").width() + 30 + 'px')
        });
        $(".sale-info").css({
            left: (leftDoTwo) + 'px'
        });
    }
    else {
        $(".sale-info").addClass("bottom-zero");
        $(".sale-info").removeClass("fixed-top");
        $(".sale-info").css('width', '100%')
        $(".sale-info").css('left', '0%')
    }
});