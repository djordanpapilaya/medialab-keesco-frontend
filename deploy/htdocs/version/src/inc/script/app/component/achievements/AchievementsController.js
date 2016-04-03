var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'lib/temple/component/AbstractComponentController', "../../data/DataManager"], function (require, exports, AbstractComponentController_1, DataManager_1) {
    var AchievementsController = (function (_super) {
        __extends(AchievementsController, _super);
        function AchievementsController(element, options) {
            _super.call(this, element, options);
        }
        /**
         *    After calling super.init, your pages DOM is ready
         */
        AchievementsController.prototype.init = function () {
            _super.prototype.init.call(this);
            this.getUserAchievements();
        };
        AchievementsController.prototype.getUserAchievements = function () {
            var _this = this;
            DataManager_1.default.getInstance().UserService.getCurrentUser().then(function (result) {
                console.log(result.user.completed_assignments);
                _this.viewModel.Achievements(result.user.completed_assignments);
            });
        };
        AchievementsController.prototype.destruct = function () {
            _super.prototype.destruct.call(this);
        };
        return AchievementsController;
    })(AbstractComponentController_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AchievementsController;
});
