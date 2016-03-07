define(["require", "exports"], function (require, exports) {
    /**
     * @namespace gaia.router
     * @class GaiaRouteParser
     */
    var GaiaRouteParser = (function () {
        /**
         * @class GaiaRouteParser
         * @constructor
         * @param {string} name
         * @param {Function} callback
         */
        function GaiaRouteParser(name, callback) {
            this.name = name;
            this.callback = callback;
        }
        return GaiaRouteParser;
    })();
    exports.default = GaiaRouteParser;
});
