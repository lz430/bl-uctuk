require(['modules/jquery-mozu', 'modules/backbone-mozu', 'modules/views-paging', 'modules/is-mobile', 'vendor/bootstrap'], function($, Backbone, PagingViews, isMobile) {
    $(document).ready(function () {

        if (!isMobile) {

            setTimeout(function() {
                $('#account-nav').affix({
                    offset: { top: 10, bottom: 900 }
                });
            }, 500);

        }

    Backbone.MozuView.on('render', function (v) {
      if ((v instanceof PagingViews.PagingControls) || (v instanceof PagingViews.PageNumbers)) {
          
      }
    });
  });
});
