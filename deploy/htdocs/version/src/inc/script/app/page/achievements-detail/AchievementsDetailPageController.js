var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "app/page/DefaultPageController", "../../data/DataManager", "lib/gaia/api/Gaia", "../../data/enum/Param"], function (require, exports, DefaultPageController_1, DataManager_1, Gaia, Param_1) {
    var AchievementsDetailPageController = (function (_super) {
        __extends(AchievementsDetailPageController, _super);
        function AchievementsDetailPageController() {
            _super.call(this);
        }
        /**
         *	After calling super.init, your pages DOM is ready
         */
        AchievementsDetailPageController.prototype.init = function () {
            _super.prototype.init.call(this);
            var achievementId = Gaia.api.getParam(Param_1.default.SLUG);
            this.getAchievement(achievementId);
            this.viewModel.currentAchievement(achievementId);
        };
        AchievementsDetailPageController.prototype.onDeeplink = function (event) {
            var achievementId = Gaia.api.getParam(Param_1.default.SLUG);
            this.getAchievement(achievementId);
        };
        AchievementsDetailPageController.prototype.getAchievement = function (id) {
            var _this = this;
            DataManager_1.default.getInstance().AchievementService.getAssignment(id).then(function (result) {
                _this.viewModel.Achievement(result);
                console.log(result);
                console.log(_this.viewModel.Achievement().assignment.skill_name);
            });
        };
        /**
         *	Destruct your page objects here
         *	- call destruct() on your own objects
         *	- clear global event listeners (window.resize, window.scroll, window.keydown, etc)
         *	- clear timeouts/intervals
         *	- do null-checks on your objects before destructing them, and set them to null afterwards
         */
        AchievementsDetailPageController.prototype.destruct = function () {
            // Put your cleaning here
            // always call this last
            _super.prototype.destruct.call(this);
        };
        return AchievementsDetailPageController;
    })(DefaultPageController_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AchievementsDetailPageController;
});
