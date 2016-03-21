define([
    "require",
    "exports",
    'app/component/achievements/AchievementsController',
    'app/component/achievements/AchievementsViewModel',
    'text!app/component/achievements/achievements.html'
], function (
    require,
    exports,
    controller,
    viewmodel,
    template
) {
    exports.controller = controller.default;
    exports.viewmodel = viewmodel.default;
    exports.template = template;
});