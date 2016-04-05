var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "app/page/DefaultPageViewModel", 'app/data/enum/Branches', 'knockout', "lib/gaia/api/Gaia"], function (require, exports, DefaultPageViewModel_1, Branches_1, ko, Gaia) {
    var AchievementsDetailPageViewModel = (function (_super) {
        __extends(AchievementsDetailPageViewModel, _super);
        function AchievementsDetailPageViewModel() {
            _super.call(this);
            // declare observables/computed
            this.currentAchievement = ko.observable();
            this.Achievement = ko.observable();
            // initiate observables
            // initiate computed
        }
        AchievementsDetailPageViewModel.prototype.gotoHome = function () {
            Gaia.api.goto(Branches_1.default.PROFILE);
        };
        /**
         *	Destruct your data objects here
         *	- set your observables to null
         */
        AchievementsDetailPageViewModel.prototype.destruct = function () {
            // Put your cleaning here
            _super.prototype.destruct.call(this);
        };
        return AchievementsDetailPageViewModel;
    })(DefaultPageViewModel_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AchievementsDetailPageViewModel;
});
