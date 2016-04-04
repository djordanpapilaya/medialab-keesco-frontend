define(["require", "exports"], function (require, exports) {
    /**
     * @namespace app.data.enum
     * @class Branches
     */
    var Branches = (function () {
        function Branches() {
        }
        Branches.INDEX = 'index';
        Branches.HOME = 'index/home';
        Branches.PROFILE = 'index/profile';
        Branches.ACHIEVEMENTS = 'index/achievements';
        Branches.ACHIEVEMENTS_DETAIL = 'index/achievement';
        return Branches;
    })();
    // use in templates
    window['Branches'] = Branches;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Branches;
});
