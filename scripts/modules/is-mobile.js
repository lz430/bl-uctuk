define(['jquery', 'vendor/fastclick'], function ($, fastclick) {

    var isMobile = $(window).width() < 768;

    if (isMobile) {
        fastclick.attach(document.body);
    }


    return isMobile;
});