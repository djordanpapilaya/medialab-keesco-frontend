define(["require", "exports", "lib/temple/config/configManagerInstance", "app/net/gateway/Gateway", "app/net/gateway/output/RESTOutputHandler", "app/net/gateway/input/RESTInputHandler"], function (require, exports, configManagerInstance_1, Gateway_1, RESTOutputHandler_1, RESTInputHandler_1) {
    /**
     * @namespace app.data
     * @class DataManager
     */
    var DataManager = (function () {
        /**
         * @class DataManager
         * @constructor
         */
        function DataManager() {
        }
        /**
         * Returns a instance of the datamanager
         *
         * @method getInstance
         * @returns {DataManager}
         */
        DataManager.getInstance = function () {
            if (!DataManager._instance) {
                DataManager._instance = new DataManager();
                window['dataManager'] = DataManager._instance;
            }
            return DataManager._instance;
        };
        /**
         * Set up gateway, services and models.
         * Called from the StartUp
         *
         * @method setupGateway
         */
        DataManager.prototype.setupGateway = function () {
            this.gateway = new Gateway_1.default({
                // the base url
                url: configManagerInstance_1.default.getURL('api'),
                headers: {},
                // the default output handler (can be changed to PostOutputHandler or JSONOutputHandler for the 'old gateway', or to RESTOutputHandler for the 'new style'
                outputHandler: new RESTOutputHandler_1.default(),
                inputHandler: new RESTInputHandler_1.default()
            }, true);
        };
        return DataManager;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DataManager;
});
