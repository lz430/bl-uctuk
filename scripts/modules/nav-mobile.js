require(['jquery'], function($) {
  $(function() {
    var $searchButton = $('[data-mz-role="search-button"]'),
        $searchBar = $('[data-mz-role="mob-site-search"]'),
        $menu = $('[data-mz-role="mob-nav"]'),
        $outerWrapper = $('#mz-outer-wrapper');


    // when the button is tapped, open the menu
    // also, bind a function to close the menu to any click outside of it
    $searchButton.on('click', function(e) {
      e.originalEvent.stopImmediatePropagation();
      $searchBar.toggleClass('is-open');
      $outerWrapper.toggleClass('is-pushed-by-search');
    });
  });
});