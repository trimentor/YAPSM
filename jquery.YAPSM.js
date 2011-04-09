(function($) {
    $.extend($.fn, {
        yapsm: function(options) {
            var passwordStrengthMeter = new $.yapsm(options);

            $(this).keyup(function() {
                var strength = passwordStrengthMeter.strength(this.value);
            });

            return this;
        }
    });

    $.yapsm = function(options) {
        this.settings = $.extend({}, $.yapsm.defaults, options);
        this.entropyMap = $.extend({}, $.yapsm.entropyMap);
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

        entropyMap: {
            decimal: {
                count: 10,
                entropy: 3.32
            },
            hexadecimal: {
                count: 16,
                entropy: 4.00
            },
            mixedCaseLettersOnly: {
                count: 26,
                entropy: 4.70
            },
            mixedCaseLettersAndNumbers: {
                count: 36,
                entropy: 5.17
            },
            caseSensitiveLettersOnly: {
                count: 52,
                entropy: 5.70
            },
            caseSensitiveLettersAndNumbers: {
                count: 62,
                entropy: 5.95
            },
            otherCharacters: {
                count: 94,
                entropy: 6.55
            }
        },

        prototype: {
            init: function() {},

            strength: function(password) {
                var entropyOfCharSet;
                var bits;
                var dictionaryWord = this.commonWord(password);

                if (dictionaryWord != false) {
                    entropyOfCharSet = Math.log(this.numberOfPossibleSymbols(password)) / Math.log(2);
                    bits = entropyOfCharSet * password.length;
                }

                return bits;
            },

            commonWord: function(password) {},

            numberOfPossibleSymbols: function(password) {}
        }
    });
})(jQuery);
