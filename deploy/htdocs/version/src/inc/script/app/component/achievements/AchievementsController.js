var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'lib/temple/component/AbstractComponentController', "../../data/DataManager", 'app/data/enum/Branches', "lib/gaia/api/Gaia"], function (require, exports, AbstractComponentController_1, DataManager_1, Branches_1, Gaia) {
    var AchievementsController = (function (_super) {
        __extends(AchievementsController, _super);
        function AchievementsController(element, options) {
            _super.call(this, element, options);
        }
        /**
         *    After calling super.init, your pages DOM is ready
         */
        AchievementsController.prototype.init = function () {
            var _this = this;
            _super.prototype.init.call(this);
            this.getUserAchievements();
            this.destructibles.addKOSubscription(this.viewModel.SelectedAchievement.subscribe(function (selectedAchievement) {
                console.log(selectedAchievement);
                _this.gotoAchievementDetail(selectedAchievement);
            }));
        };
        AchievementsController.prototype.getUserAchievements = function () {
            var _this = this;
            DataManager_1.default.getInstance().UserService.getCurrentUser().then(function (result) {
                console.log(result.user.completed_assignments);
                _this.viewModel.Achievements(result.user.completed_assignments);
            });
        };
        AchievementsController.prototype.gotoAchievementDetail = function (achievementId) {
            Gaia.api.goto(Branches_1.default.ACHIEVEMENTS_DETAIL, { slug: achievementId.id });
        };
        AchievementsController.prototype.destruct = function () {
            _super.prototype.destruct.call(this);
        };
        return AchievementsController;
    })(AbstractComponentController_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AchievementsController;
});
