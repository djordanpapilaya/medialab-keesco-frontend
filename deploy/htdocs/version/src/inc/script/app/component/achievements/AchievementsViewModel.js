var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'lib/temple/component/AbstractComponentViewModel'], function (require, exports, AbstractComponentViewModel_1) {
    var AchievementsViewModel = (function (_super) {
        __extends(AchievementsViewModel, _super);
        function AchievementsViewModel() {
            _super.call(this);
            // initiate observables
            // initiate computed
        }
        /**
         *	Destruct your data objects here
         *	- set your observables to null
         */
        AchievementsViewModel.prototype.destruct = function () {
            // Put your cleaning here
            _super.prototype.destruct.call(this);
        };
        return AchievementsViewModel;
    })(AbstractComponentViewModel_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AchievementsViewModel;
});
