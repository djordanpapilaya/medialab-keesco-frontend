var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/temple/events/BaseEvent'], function (require, exports, BaseEvent_1) {
    var GaiaHistoryEvent = (function (_super) {
        __extends(GaiaHistoryEvent, _super);
        function GaiaHistoryEvent(type, routeResult) {
            _super.call(this, type);
            this.routeResult = routeResult;
            this.routeResult = routeResult;
        }
        GaiaHistoryEvent.DEEPLINK = "GaiaHistoryEvent.DEEPLINK";
        GaiaHistoryEvent.GOTO = "GaiaHistoryEvent.GOTO";
        return GaiaHistoryEvent;
    })(BaseEvent_1.default);
    exports.default = GaiaHistoryEvent;
});
