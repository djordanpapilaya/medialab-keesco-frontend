//import * as Gaia from "lib/gaia/api/Gaia";
//import BranchTools from "lib/gaia/core/BranchTools";
//import SiteModel from "lib/gaia/core/SiteModel";
define(["require", "exports", "lib/gaia/router/GaiaRouterConfig", "lib/gaia/router/GaiaRouteGroup", "lib/gaia/router/RouteResultItem"], function (require, exports, GaiaRouterConfig_1, GaiaRouteGroup_1, RouteResultItem_1) {
    /**
     * @namespace gaia.router
     * @class GaiaRouter
     */
    var GaiaRouter = (function () {
        function GaiaRouter(gaiaHistory) {
            this._localValue = '';
            this._gaiaHistory = gaiaHistory;
            this._config = new GaiaRouterConfig_1.default();
            this._group = new GaiaRouteGroup_1.default(this._config);
        }
        /**
         * @method config
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouter.prototype.config = function () {
            return this._config;
        };
        GaiaRouter.prototype.init = function () {
            var _this = this;
            this._base = $('meta[name=document-base]').attr('content');
            // not defined, set root of domain
            if (typeof this._base === 'undefined') {
                this._base = document.location.protocol + '//' + document.location.host + '/';
            }
            else if (this._base.indexOf(document.location.host) == -1) {
                this._base = document.location.protocol + '//' + document.location.host + (this._base.charAt(0) == '/' ? '' : '/') + this._base;
            }
            // force trailing /
            if (this._base.split('').pop() != '/') {
                this._base += '/';
            }
            if (this._config.isEnabled()) {
                // get path for emulated redirect
                history['redirect'] && history['redirect']('/', this._base.replace(document.location.protocol + '//' + document.location.host, ''));
            }
            // this will retrieve the locale from the url
            this.getHistoryValue();
            // todo Async change route in start
            $(window).on("popstate", function (e) {
                //console.log('[GaiaRouter] history popstate');
                var route = _this.getHistoryValue();
                _this.notifyHistory(route);
            });
        };
        GaiaRouter.prototype.start = function () {
            var route = this.getHistoryValue();
            //if (DEBUG) console.log('[GaiaRouter] start: ', route);
            this.notifyHistory(route, true);
        };
        GaiaRouter.prototype.getLocale = function () {
            return this._locale || this._config.getDefaultLocale();
        };
        GaiaRouter.prototype.setLocale = function (locale) {
            this._locale = locale;
            this.setHistoryValue(this.getHistoryValue(true));
        };
        /**
         * @method getRoute
         * @returns {string}
         */
        GaiaRouter.prototype.getRoute = function () {
            return this.getHistoryValue();
        };
        /**
         * @method setRoute
         * @param {string} route
         * @param {boolean} [replace=false]
         */
        GaiaRouter.prototype.setRoute = function (route, replace) {
            //if (DEBUG) console.log('[GaiaRouter] setRoute: ', route, replace);
            if (replace === void 0) { replace = false; }
            this.setHistoryValue(route, replace);
            this.notifyHistory(route);
        };
        GaiaRouter.prototype.notifyHistory = function (route, isLanding) {
            var _this = this;
            if (isLanding === void 0) { isLanding = false; }
            //if (DEBUG) console.log('[GaiaRouter] notifyHistory: ', route);
            this.resolvePage(route, function (routeResult) {
                //if (DEBUG) console.log(' - ', routeResult);
                Object.freeze(routeResult[0].deeplink);
                // check for redirects on landing, and do a replaceState
                if (routeResult.route != route && isLanding) {
                    //console.log('- redirect!');
                    _this.setHistoryValue(routeResult.route, true);
                }
                _this._gaiaHistory.onChange(routeResult);
            }, true, isLanding);
        };
        /**
         * Returns a query parameter, the part after the `?`
         *
         * @method getQueryParam
         * @param {string} key
         * @returns {string}
         */
        GaiaRouter.prototype.getQueryParam = function (key) {
            return decodeURIComponent((new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
        };
        /**
         * @method notFound
         * @param {string} branch
         * @returns {GaiaRouter}
         */
        GaiaRouter.prototype.notFound = function (branch) {
            this._notFound = branch;
            return this;
        };
        GaiaRouter.prototype.redirect = function (route, redirect) {
            return this._group.redirect(route, redirect);
        };
        GaiaRouter.prototype.handle = function (route, callback) {
            return this._group.handle(route, callback);
        };
        GaiaRouter.prototype.page = function (route, branch) {
            return this._group.page(route, branch);
        };
        GaiaRouter.prototype.alias = function (route, branch) {
            return this._group.alias(route, branch);
        };
        GaiaRouter.prototype.childPage = function (route, branch) {
            return this._group.childPage(route, branch);
        };
        //	public resolve(url:string):IRouteResultItem
        //	{
        //		console.log('resolve: ', url);
        //
        //		for (var i = 0; i < this._routeActions.length; i++)
        //		{
        //			var routeAction = this._routeActions[i];
        //
        //			if (routeAction.route.isMatch(url))
        //			{
        ////				console.log('matched : ', routeAction.route);
        //
        //				if (routeAction.type == RouteAction.REDIRECT)
        //				{
        //					// re-feed the redirect route to the resolver
        //					return this.resolve(routeAction.execute(url));
        //				}
        //				else
        //				{
        //					return routeAction.execute(url);
        //				}
        //			}
        //
        //		}
        //
        //		if (this._notFound)
        //		{
        //			// todo: goto 404 route
        //			return [{branch: this._notFound, deeplink: {}}];
        //		}
        //		else
        //		{
        //			// todo: goto home
        //			return [{branch: 'index', deeplink: {}}];
        //		}
        //	}
        GaiaRouter.prototype.resolvePage = function (url, callback, includeRedirects, isLanding) {
            var _this = this;
            if (includeRedirects === void 0) { includeRedirects = false; }
            if (isLanding === void 0) { isLanding = false; }
            var i;
            if (!this._config.isQueryStringIncluded() && (i = url.indexOf('?')) != -1)
                url = url.substr(0, i);
            this._group.resolvePage(url, function (routeResult) {
                if (routeResult.length > 0) {
                    callback(routeResult);
                    return;
                }
                if (_this._notFound) {
                    // todo: goto 404 route
                    callback(new RouteResultItem_1.default([{ branch: _this._notFound, deeplink: {} }], url));
                }
                else {
                    console.info('[GaiaRouter] no route found for "' + url + '", redirecting to index!');
                    // todo: goto home
                    callback(new RouteResultItem_1.default([{ branch: 'index', deeplink: {} }], url));
                }
            }, includeRedirects, isLanding);
        };
        GaiaRouter.prototype.assemble = function (branch, params) {
            if (params === void 0) { params = {}; }
            var route = this._group.getRoute(branch, params);
            return route ? route.assemble(params) : null;
        };
        GaiaRouter.prototype.getGroup = function () {
            return this._group;
        };
        GaiaRouter.prototype.getHistoryValue = function (skipLocale, ignoreEnabledState) {
            if (skipLocale === void 0) { skipLocale = false; }
            if (ignoreEnabledState === void 0) { ignoreEnabledState = false; }
            if (!this._config.isEnabled() && !ignoreEnabledState) {
                return this._localValue;
            }
            // fix for weird IE version
            var location = (history['location'] || document.location).href || document.location.href;
            this._queryString = document.location.search;
            // force trailing /
            if (location.split('').pop() != '/') {
                location += '/';
            }
            // prevent future errors
            if (location == undefined || location == null) {
                location = '';
            }
            // strip basepath, leave deeplink
            if (location.indexOf(this._base) == 0) {
                location = location.replace(this._base, '');
            }
            // force starting /
            if (location.charAt(0) != '/') {
                location = '/' + location;
            }
            // remove trailing /
            if (location.split('').pop() == '/') {
                location = location.substr(0, location.length - 1);
            }
            // locale hook
            if (!skipLocale) {
                var locale = this._config.getLocaleRegExp().exec(location);
                if (locale) {
                    this._locale = locale[1];
                }
            }
            location = location.replace(this._config.getLocaleRegExp(), '');
            // end locale hook
            // force starting /
            if (location.charAt(0) != '/') {
                location = '/' + location;
            }
            //console.log('[GaiaRouter] getHistoryValue: ', location);
            return location;
        };
        GaiaRouter.prototype.setHistoryValue = function (value, replace) {
            //console.log('[GaiaRouter] setHistoryValue: ', value, replace);
            if (replace === void 0) { replace = false; }
            if (!this._config.isEnabled()) {
                this._localValue = value;
                return;
            }
            // absolute
            if (value.charAt(0) == '/') {
                // chrome
                if (!history['emulate']) {
                    value = value.substr(1);
                }
            }
            else {
                // chrome
                if (!history['emulate']) {
                    value = (this.getHistoryValue(true).replace(/[^\/]+$/g, '') + value).substr(1);
                }
            }
            // absolute
            if (value.charAt(0) == '/') {
                // locale hook
                value = (this._locale ? '/' + this._locale : '') + value;
            }
            else {
                // locale hook
                value = (this._locale ? this._locale + '/' : '') + value;
            }
            if (this._queryString.length > 0) {
                value += this._queryString;
            }
            if (!history['emulate']) {
                history[replace ? 'replaceState' : 'pushState'](null, null, this._base + (value.charAt(0) == '/' ? value.substr(0) : value));
            }
            else {
                history[replace ? 'replaceState' : 'pushState'](null, null, value);
            }
        };
        return GaiaRouter;
    })();
    exports.default = GaiaRouter;
});
