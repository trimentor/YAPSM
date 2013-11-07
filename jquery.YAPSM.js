/*!
 * jQuery YAPSM Plugin v1.0.1
 *
 * Copyright 2011, 2013 Kjel Delaey
 * Released under the MIT license
 * https://raw.github.com/trimentor/YAPSM/master/LICENSE
 */
(function ($) {
    $.extend($.fn, {
        yapsm: function (options) {
            var passwordStrengthMeter, calculatePasswordComplexity;
            passwordStrengthMeter = new $.yapsm(options);

            calculatePasswordComplexity = function () {
                var password = this.value;
                this.complexity = password.length ? passwordStrengthMeter.strength(password) : "";
            };
            $(this).keyup(calculatePasswordComplexity);
            return this;
        }
    });

    $.yapsm = function (options) {
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
            strongClass: 'strong',
            veryStrongClass: 'very-strong',
            commonWordClass: 'dictionary-word'
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
                count: 1,
                entropy: 6.55
            }
        },

        prototype: {
            init: function () {
                this.commonWords(this.settings.dictionary);
            },

            commonWords: function (dictionary) {
                var commonList;

                if (typeof dictionary === "function") {
                    commonList = dictionary();
                } else if (typeof dictionary === "object") {
                    commonList = dictionary;
                } else {
                    commonList = [];
                }
                this.dictionary = commonList;
            },

            strength: function (password) {
                var dictionaryWord, bitsOfEntropy;
                dictionaryWord = this.commonWord(password);
                bitsOfEntropy = !dictionaryWord ? this.passwordStrength(password) : null;
                return this.strengthClass(bitsOfEntropy);
            },

            charSetEntropy: function (charSet) {
                return Math.log(charSet) / Math.log(2);
            },

            passwordStrength: function (password) {
                var charSet, bitsOfEntropy;
                charSet = this.numberOfPossibleSymbols(password);
                bitsOfEntropy = this.charSetEntropy(charSet) * password.length;
                return Math.floor(bitsOfEntropy);
            },

            commonWord: function (password) {
                var lPassword, dictionaryWord, i;
                lPassword = password.toLowerCase();
                dictionaryWord = false;

                for (i = 0; i < this.dictionary.length; i += 1) {
                    if (lPassword === this.dictionary[i].toLowerCase()) {
                        dictionaryWord = true;
                        break;
                    }
                }
                return dictionaryWord;
            },

            numberOfPossibleSymbols: function (password) {
                var character, score, inclDecimal, inclLowerCase, inclUpCase, inclOther, i;
                score = 0;

                for (i = 0; i < password.length; i += 1) {
                    character = password.charAt(i);

                    if (typeof inclDecimal === "undefined" && /[0-9]/.test(character)) {
                        inclDecimal = true;
                        score += this.entropyMap.decimal.count;
                    }
                    if (typeof inclUpCase === "undefined" && /[A-Z]/.test(character)) {
                        inclUpCase = true;
                        score += this.entropyMap.mixedCaseLettersOnly.count;
                    }
                    if (typeof inclLowerCase === "undefined" && /[a-z]/.test(character)) {
                        inclLowerCase = true;
                        score += this.entropyMap.mixedCaseLettersOnly.count;
                    }
                    if (typeof inclOther === "undefined" && /\W/.test(character)) {
                        inclOther = true;
                        score += this.entropyMap.otherCharacters.count;
                    }
                }
                return score;
            },

            strengthClass: function (bitsOfEntropy) {
                var cssClass;

                if (bitsOfEntropy === null) {
                    cssClass = this.settings.commonWordClass;
                } else {
                    if (bitsOfEntropy <= 27) {
                        cssClass = this.settings.weakClass;
                    } else if (bitsOfEntropy >= 28 && bitsOfEntropy <= 35) {
                        cssClass = this.settings.fairClass;
                    } else if (bitsOfEntropy >= 36 && bitsOfEntropy <= 59) {
                        cssClass = this.settings.goodClass;
                    } else if (bitsOfEntropy >= 60 && bitsOfEntropy <= 127) {
                        cssClass = this.settings.strongClass;
                    } else if (bitsOfEntropy > 128) {
                        cssClass = this.settings.veryStrongClass;
                    }
                }
                return cssClass;
            },

            passwordGuesses: function (bits, feelingLucky) {
                var nBits = !!feelingLucky ? bits - 1 : bits;
                return Math.pow(2, nBits);
            },

            timeToGuess: function (passwordGuesses) {
                var averagePassPerSec, seconds;
                averagePassPerSec = Math.pow(10, 9) * 3;
                seconds = Math.floor(passwordGuesses) / averagePassPerSec;
                return [seconds, seconds * 60, seconds * 3600];
            }
        }
    });
})(jQuery);
