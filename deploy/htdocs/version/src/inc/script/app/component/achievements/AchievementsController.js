var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'lib/temple/component/AbstractComponentController'], function (require, exports, AbstractComponentController_1) {
    var AchievementsController = (function (_super) {
        __extends(AchievementsController, _super);
        function AchievementsController(element, options) {
            _super.call(this, element, options);
        }
        /**
         *	After calling super.init, your pages DOM is ready
         */
        AchievementsController.prototype.init = function () {
            _super.prototype.init.call(this);
        };
        AchievementsController.prototype.destruct = function () {
            _super.prototype.destruct.call(this);
        };
        return AchievementsController;
    })(AbstractComponentController_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AchievementsController;
});
