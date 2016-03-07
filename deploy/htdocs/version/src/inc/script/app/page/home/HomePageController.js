var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../DefaultPageController"], function (require, exports, DefaultPageController_1) {
    var HomePageController = (function (_super) {
        __extends(HomePageController, _super);
        function HomePageController() {
            _super.call(this);
        }
        /**
         *	After calling super.init, your pages DOM is ready
         */
        HomePageController.prototype.init = function () {
            _super.prototype.init.call(this);
        };
        /**
         *	Destruct your page objects here
         *	- call destruct() on your own objects
         *	- clear global event listeners (window.resize, window.scroll, window.keydown, etc)
         *	- clear timeouts/intervals
         *	- do null-checks on your objects before destructing them, and set them to null afterwards
         */
        HomePageController.prototype.destruct = function () {
            // Put your cleaning here
            // always call this last
            _super.prototype.destruct.call(this);
        };
        return HomePageController;
    })(DefaultPageController_1.default);
    exports.default = HomePageController;
});
