define(["require", "exports", "app/data/DataManager", 'knockout', "lib/temple/config/configManagerInstance", "app/config/config", "app/config/Routes", "lib/temple/control/sequence/Sequence", "lib/temple/control/sequence/tasks/MethodTask", "app/control/DevBarTask", "app/net/service/UserService"], function (require, exports, DataManager_1, ko, configManagerInstance_1, config_1, Routes_1, Sequence_1, MethodTask_1, DevBarTask_1, UserService_1) {
    // localization
    //import InitLocaleTask from "app/control/InitLocaleTask";
    /**
     * @namespace app.control
     * @class StartUp
     */
    var StartUp = (function () {
        /**
         * Initializes knockout allowBindings
         *
         * @class StartUp
         * @constructor
         */
        function StartUp() {
            window['ko'] = ko;
        }
        StartUp.prototype.execute = function (callback) {
            configManagerInstance_1.default.init(config_1.default.config, config_1.default.environment);
            // just because we need it here!
            var dm = DataManager_1.default.getInstance();
            dm.setupGateway();
            dm.UserService = new UserService_1.default(dm.gateway);
            Routes_1.default.init();
            var sequence = new Sequence_1.default();
            if (DEBUG && configManagerInstance_1.default.getEnvironment() != 'live'
                && configManagerInstance_1.default.getEnvironment() != 'prod'
                && configManagerInstance_1.default.getEnvironment() != 'production') {
                sequence.add(new DevBarTask_1.default());
            }
            // add your own tasks
            //sequence.add(new InitLocaleTask());
            // do this last
            sequence.add(new MethodTask_1.default(callback));
            sequence.execute();
        };
        return StartUp;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = StartUp;
});
