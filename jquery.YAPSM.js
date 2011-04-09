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
        defaults: {
            fieldClass: 'yapsm',
            shortClass: 'too-short',
            weakClass: 'weak',
            fairClass: 'fair',
            goodClass: 'good',
            strongClass:'strong',
            veryStrongClass: 'very-strong'
        },

        prototype: {
            init: function() {}
        }
    });
})(jQuery);
