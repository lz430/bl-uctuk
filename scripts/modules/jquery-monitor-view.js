define(['jquery', 'underscore'], function($, _) {
  var tracked = [],
    i = 0,
    l,
    $window = $(window);

  function isInView($el) {
       var docViewTop = $window.scrollTop(),
       docViewBottom = docViewTop + $window.height(),
       elemTop = $el.offset().top,
       elemBottom = elemTop + $el.height();
 
   return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop) );
  }

  function check(e) {
    var it, is, was;
    for (i = 0; i < l; i++) {
      it = tracked[i];
      was = it.is;
      is = isInView(it.$el);
      if (is && !was) {
        it.$el.trigger('inview');
      }
      if (!is && was) {
        it.$el.trigger('outofview');
      }
      it.is = is;
    }
  }

  function add($el) {
    tracked.push({
      $el: $el,
      is: isInView($el)
    });
    l = tracked.length;
    check();
    if (l === 1) {
      $window.on('scroll', check);
    }
  }

  function remove($el) {
    tracked = _.reject(tracked, function(tracker) {
      return tracker.$el[0] === $el[0];
    });
    l = tracked.length;
    if (l === 0) {
      $window.off('scroll', check);
    }
  }

  check = _.debounce(check, 200);

  $.fn.monitorView = function(off) {
    if (off === false) {
      remove(this);
    } else {
      add(this);
    }
    return this;
  };

});