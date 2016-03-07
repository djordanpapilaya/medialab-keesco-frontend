define(["require", "exports"], function (require, exports) {
    /**
     * This class contains some utility functions for Regular Expressions.
     *
     * @module Temple
     * @namespace temple.utils.types
     * @class RegExpUtils
     * @author Arjan van Wijk
     */
    var RegExpUtils = (function () {
        function RegExpUtils() {
        }
        /**
         * Searches text for all matches to the regular expression given in pattern and return the result.
         * Modelled like the php [preg_match_all](http://php.net/manual/en/function.preg-match-all.php).
         *
         * @method pregMatchAll
         * @static
         * @param {RegExp} regExp The regular expression.
         * @param {string} content The string to search for.
         * @return {any[]}
         */
        RegExpUtils.pregMatchAll = function (regExp, content) {
            var resultList = [];
            var result = regExp.exec(content);
            var index = -1;
            while (result != null && index != result.index) {
                for (var i = 0; i < result.length; ++i) {
                    if (true) {
                        if (resultList[i] == null) {
                            resultList[i] = [];
                        }
                        resultList[i].push(result[i] != undefined ? result[i] : '');
                    }
                    else {
                    }
                }
                index = result.index;
                result = regExp.exec(content);
            }
            return resultList;
        };
        /**
         * Searches for a match to the regular expression given in pattern.
         * Modelled like the php [preg_match](http://php.net/manual/en/function.preg-match.php).
         *
         * @method pregMatch
         * @static
         * @param {RegExp} regExp The regular expression.
         * @param {string} content The string to search for.
         * @return {any[]}
         */
        RegExpUtils.pregMatch = function (regExp, content) {
            var resultList = [];
            var result = regExp.exec(content);
            if (result != null) {
                for (var i = 0; i < result.length; ++i) {
                    resultList.push(result[i] != undefined ? result[i] : '');
                }
            }
            return resultList;
        };
        return RegExpUtils;
    })();
    exports.default = RegExpUtils;
});
