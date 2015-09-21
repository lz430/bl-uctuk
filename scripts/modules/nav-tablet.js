require(['jquery'], function($) {
  $(function() {
    var $tabletMenuButton = $('[data-mz-role="open-side-nav"]'),
        $body = $('#mz-outer-wrapper'),
        $tabletWrapper = $('.mz-nav-tablet__wrapper'),
        $tabletMenu = $('.mz-nav-tablet'),
        $tabletMenuBack = $tabletMenu.find('.mz-nav-tablet__title'),
        $tabletMenuLink = $tabletMenu.find('a');

    // when the button is tapped, open the menu
    // also, bind a function to close the menu to any click outside of it
    $tabletMenuButton.on('click', function(e) {
      e.stopImmediatePropagation();
      $tabletMenu.toggleClass('is-open');
      $body.toggleClass('is-pushed-by-nav');
      $body.one('click', function() {
          $tabletMenu.removeClass('is-open');
          $body.removeClass('is-pushed-by-nav');
      });

      
    });

    // when a category link is clicked, check to see if it has subcategories
    // if it does, slide those categories in
    // if it doesn't, open that link
    $tabletMenuLink.on('click', function(e) {
      var $this = $(this);
      if ($this.parent().hasClass('has-subnav')) {
        $this.parent().addClass('is-active');
        // $this.nearest('ul').addClass('has-active-child');
        $tabletMenu.scrollTop(0);
      } else {
        window.open($this.data('href'), '_self');
      }
    });

    // when a back link is clicked, slide the menu back to the parent category
    $tabletMenuBack.on('click', function(e) {
      $(this).closest('.has-subnav').removeClass('is-active');
    });
  });
});
