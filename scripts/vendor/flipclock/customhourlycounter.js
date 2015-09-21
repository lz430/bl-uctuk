/**
 * Hourly Counter Clock Face (custom)
 *
 * This class will generate an hourly counter for FlipClock.js. An
 * hour counter will track hours, minutes, and seconds. If number of
 * available digits is exceeded in the count, a new digit will be 
 * created.
 *
 * @param  object  The parent FlipClock.Factory object
 * @param  object  An object of properties to override the default  
 */
FlipClock.CustomHourlyCounterFace = FlipClock.HourlyCounterFace.extend({
    /**
     * Build the clock face
     */
    build: function(excludeHours, time) {
        var t = this;
        var children = this.factory.$el.find('ul');
        
        time = time ? time : this.factory.time.getHourCounter();
        
        if(time.length > children.length) {
            $.each(time, function(i, digit) {
                t.createList(digit);
            });
        }
        
        $(this.createDivider('Seconds').wrap('<div class="flip-clock-group seconds"></div>')).insertBefore(this.lists[this.lists.length - 2].$el);
        $(this.createDivider('Minutes').wrap('<div class="flip-clock-group minutes"></div>')).insertBefore(this.lists[this.lists.length - 4].$el);
        
        if(!excludeHours) {
            $(this.createDivider('Hours', true).wrap('<div class="flip-clock-group hours"></div>')).insertBefore(this.lists[0].$el);
        }
        
        this.base();
    }
});
