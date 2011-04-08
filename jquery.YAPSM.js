(function($) {
    $.extend($.fn, {
        yapsm: function(options) {
            var passwordStrengthMeter = new $.yapsm(options);

            return this;
        }
    });

    $.yapsm = function(options) {
        this.settings = $.extend({}, $.yapsm.defaults, options);
        this.field = $(this);
        this.init();
    };

    $.extend($.yapsm, {
        defaults: {},

        prototype: {
            init: function() {}
        }
    });
})(jQuery);
