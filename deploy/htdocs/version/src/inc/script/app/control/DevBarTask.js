var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/temple/utils/Browser", "lib/temple/control/sequence/tasks/AbstractTask"], function (require, exports, Browser_1, AbstractTask_1) {
    /**
     * @namespace app.control
     * @class DevBarTask
     * @extend temple.control.sequence.tasks.AbstractTask
     */
    var DevBarTask = (function (_super) {
        __extends(DevBarTask, _super);
        /**
         */
        function DevBarTask() {
            _super.call(this);
        }
        /**
         * @inheritDoc
         */
        DevBarTask.prototype.executeTaskHook = function () {
            if (DEBUG) {
                console.log('DevBarTask.executeTaskHook');
            }
            if (Browser_1.default.name == 'chrome' || (Browser_1.default.platform != 'mac' &&
                Browser_1.default.platform != 'windows' &&
                Browser_1.default.platform != 'linux')) {
                this.done();
                return;
            }
            var $el = $('<div/>', { html: 'This version has only been tested on Chrome, if you\'re seeing this message please use Chrome for testing & reviewing.<br />Other browsers will be tested and QA\'ed before launch' }).addClass('dev-bar');
            var $close = $('<span/>', { text: 'x' }).addClass('btn-close');
            $el.append($close);
            $('body').append($el);
            $el.on('click', function (event) {
                $el.remove();
                if ($.cookie) {
                    $.cookie('hide-chrome-devbar', true);
                }
            });
            if ($.cookie) {
                if ($.cookie('hide-chrome-devbar')) {
                    $el.remove();
                }
            }
            this.done();
        };
        /**
         * @inheritDoc
         */
        DevBarTask.prototype.destruct = function () {
            _super.prototype.destruct.call(this);
        };
        return DevBarTask;
    })(AbstractTask_1.default);
    exports.default = DevBarTask;
});
