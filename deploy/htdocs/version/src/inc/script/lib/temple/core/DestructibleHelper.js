define(["require", "exports", "bluebird"], function (require, exports, Promise) {
    var DestructibleHelper = (function () {
        function DestructibleHelper() {
            this._isDestructed = false;
            /**
             * list of registered intervals and timeouts, used for destruction
             *
             * @property _intervals
             * @protected
             */
            this._intervals = [];
            /**
             * list of Knockout subscriptions, used for destruction
             *
             * @property _subscriptions
             * @protected
             */
            this._subscriptions = [];
            /**
             * list of Knockout subscriptions, used for destruction
             *
             * @property _subscriptions
             * @protected
             */
            this._promises = [];
            /**
             * list of destructibles, like Event handlers, used for destruction
             *
             * @property _destructibles
             * @protected
             */
            this._destructibles = [];
        }
        DestructibleHelper.catchCancelablePromise = function (promise) {
            if (!promise.isCancellable()) {
                console.error('promise is not cancellable', promise);
            }
            // add a catch handler only for when this promise is canceled
            // NOTE: for IE8, rename to 'caught'
            promise.catch(Promise.CancellationError, function (error) {
                if (DEBUG)
                    console.log('canceled pending promise');
            });
        };
        DestructibleHelper.prototype.add = function (destructible) {
            this._destructibles.push(destructible);
            return destructible;
        };
        DestructibleHelper.prototype.addInterval = function (interval) {
            this._intervals.push(interval);
            return interval;
        };
        DestructibleHelper.prototype.addKOSubscription = function (subscription) {
            this._subscriptions.push(subscription);
            return subscription;
        };
        // utility method to save promises and add catch-cancelable handlers
        // should normally exists in the AbstractPageController
        DestructibleHelper.prototype.addPromise = function (promise) {
            DestructibleHelper.catchCancelablePromise(promise);
            this._promises.push(promise);
            return promise;
        };
        DestructibleHelper.prototype.destruct = function () {
            // clear intervals
            if (this._intervals) {
                for (var i = 0; i < this._intervals.length; i++) {
                    clearInterval(this._intervals[i]);
                }
                this._intervals.length = 0;
                this._intervals = null;
            }
            // clear subscriptions
            if (this._subscriptions) {
                for (var i = 0; i < this._subscriptions.length; i++) {
                    var subscription = this._subscriptions[i];
                    if (subscription) {
                        subscription.dispose();
                    }
                }
                this._subscriptions.length = 0;
                this._subscriptions = null;
            }
            // clear destructibles
            if (this._destructibles) {
                for (var i = 0; i < this._destructibles.length; i++) {
                    var destructible = this._destructibles[i];
                    if (destructible) {
                        destructible.destruct();
                    }
                }
                this._destructibles.length = 0;
                this._destructibles = null;
            }
            // clear promises
            if (this._promises) {
                for (var i = 0; i < this._promises.length; i++) {
                    var promise = this._promises[i];
                    if (promise &&
                        promise.cancellable() &&
                        promise.isPending()) {
                        promise.cancel();
                    }
                }
                this._promises.length = 0;
                this._promises = null;
            }
            this._isDestructed = true;
        };
        DestructibleHelper.prototype.isDestructed = function () {
            return this._isDestructed;
        };
        return DestructibleHelper;
    })();
    exports.default = DestructibleHelper;
});
