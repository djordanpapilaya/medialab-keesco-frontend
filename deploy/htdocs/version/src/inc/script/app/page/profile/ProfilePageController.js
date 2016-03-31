var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "app/page/DefaultPageController", "../../data/DataManager"], function (require, exports, DefaultPageController_1, DataManager_1) {
    var ProfilePageController = (function (_super) {
        __extends(ProfilePageController, _super);
        function ProfilePageController() {
            _super.call(this);
        }
        /**
         *	After calling super.init, your pages DOM is ready
         */
        ProfilePageController.prototype.init = function () {
            this.getUserInfo();
            _super.prototype.init.call(this);
        };
        /**
         *	Destruct your page objects here
         *	- call destruct() on your own objects
         *	- clear global event listeners (window.resize, window.scroll, window.keydown, etc)
         *	- clear timeouts/intervals
         *	- do null-checks on your objects before destructing them, and set them to null afterwards
         */
        ProfilePageController.prototype.getUserInfo = function () {
            var _this = this;
            DataManager_1.default.getInstance().UserService.getCurrentUser().then(function (result) {
                _this.viewModel.CurrentUser(result);
                console.log(_this.viewModel.CurrentUser());
            });
        };
        ProfilePageController.prototype.destruct = function () {
            // Put your cleaning here
            // always call this last
            _super.prototype.destruct.call(this);
        };
        return ProfilePageController;
    })(DefaultPageController_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ProfilePageController;
});
