define(['jquery'], function($) {
    window.updateStateGroup = function(grpname, action, options) {
        var re = new RegExp('^' + grpname + '|', 'i');
        var optToggle = (/,toggle,/i).test(',' + options + ',');
        var optInverse = (/,inverse,/i).test(',' + options + ',');
        var optOpen = (/,open,/i).test(',' + options + ',');
        var optClose = (/,close,/i).test(',' + options + ',');
        if (optInverse) {
            optToggle = !optToggle;
        }
        $('[data-state-content]').each(function(index, elem) {
            var $el = $(elem);
            var id = $el.data('stateContent');
            var keys = id.split('|');
            var el_grpname = keys[0] || '';
            var el_action = keys[1] || '';
            if (grpname === el_grpname) {
                if (action === '_all' || grpname + '|' + action === el_grpname + '|' + el_action) {
                    if ((optOpen || !optClose) && (!optToggle || (optToggle && !$el.hasClass('active')))) {
                        $el.addClass('active');
                    } else {
                        $el.removeClass('active');
                    }
                } else {
                    $el.removeClass('active');
                }
            }
        });

        $('[data-state-key]').each(function(index, elem) {
            var $el = $(elem);
            var id = $el.data('stateKey');
            var keys = id.split('|');
            var el_grpname = keys[0] || '';
            var el_action = keys[1] || '';
            if (grpname === el_grpname) {
                if (action === '_all' || grpname + '|' + action === el_grpname + '|' + el_action) {
                    if ((optOpen || !optClose) && (!optToggle || (optToggle && !$el.hasClass('active')))) {
                        $el.addClass('active');
                    } else {
                        $el.removeClass('active');
                    }
                } else {
                    if (optInverse) {
                        $el.addClass('active');
                    } else {
                        $el.removeClass('active');
                    }
                }
            }
        });
    };

    $(document).ready(function() {
        var stateKeyClick = function(event) {
            event.preventDefault();
            var $dl_menu = $('#dl-menu');
            if ($dl_menu && $dl_menu.length > 0 && $dl_menu.data('dlmenu')) {
                $dl_menu.data('dlmenu').closeMenu();
            }
            var mediaWidth = 'xs';
            if (window.innerWidth >= 768) {
                mediaWidth = "sm"
            }
            if (window.innerWidth >= 992) {
                mediaWidth = "md"
            }
            if (window.innerWidth >= 1200) {
                mediaWidth = "lg"
            }
            var $this = $(this);
            var activeWidth = $this.data('stateActive') || '';
            if (activeWidth) {
                if (activeWidth.indexOf(mediaWidth) == -1) {
                    return;
                }
            }
            var keys = $this.data('stateKey').split('|');
            var grpname = keys[0] || '';
            var action = keys[1] || '';
            var options = keys[2] || '';
            updateStateGroup(grpname, action, options);
            var optOverlay = (/,overlay,/i).test(',' + options + ',');
            if (optOverlay) {
                if ($this.hasClass('active')) {
                    $('.dl-menu-overlay').removeClass('active');
                }
                if (!$this.hasClass('active')) {
                    $('.dl-menu-overlay').addClass('active');
                }
            }
        };
        $('body').on('click', '[data-state-key]', stateKeyClick);
    });
}); 