//import * as Gaia from "lib/gaia/api/Gaia";
//import BranchTools from "lib/gaia/core/BranchTools";
//import SiteModel from "lib/gaia/core/SiteModel";

import GaiaRouterConfig from "lib/gaia/router/GaiaRouterConfig";
import {default as GaiaRouteGroup} from "lib/gaia/router/GaiaRouteGroup";
import GaiaRoute from "lib/gaia/router/GaiaRoute";
import GaiaRouteRequirement from "lib/gaia/router/GaiaRouteRequirement";
import GaiaRouteConvert from "lib/gaia/router/GaiaRouteParser";
import IRouteResultItem from "lib/gaia/router/IRouteResultItem";
import RouteResultItem from "lib/gaia/router/RouteResultItem";

import IGaiaHistory from "lib/gaia/core/IGaiaHistory";

/**
 * @namespace gaia.router
 * @class GaiaRouter
 */
class GaiaRouter
{
	private _gaiaHistory:IGaiaHistory;

	private _config:GaiaRouterConfig;
	private _group:GaiaRouteGroup;
	private _notFound:string;

	private _base:string;
	private _queryString:string;
	private _locale:string;
	private _localValue:string = '';

	constructor(gaiaHistory:IGaiaHistory)
	{
		this._gaiaHistory = gaiaHistory;
		this._config = new GaiaRouterConfig();
		this._group = new GaiaRouteGroup(this._config);
	}

	/**
	 * @method config
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public config():GaiaRouterConfig
	{
		return this._config;
	}

	public init():void
	{
		this._base = $('meta[name=document-base]').attr('content');

		// not defined, set root of domain
		if (typeof this._base === 'undefined')
		{
			this._base = document.location.protocol + '//' + document.location.host + '/';
		}
		// set, but host not in value, use as relative
		else if (this._base.indexOf(document.location.host) == -1)
		{
			this._base = document.location.protocol + '//' + document.location.host + (this._base.charAt(0) == '/' ? '' : '/') + this._base;
		}

		// force trailing /
		if (this._base.split('').pop() != '/')
		{
			this._base += '/';
		}

		if (this._config.isEnabled())
		{
			// get path for emulated redirect
			history['redirect'] && history['redirect']('/', this._base.replace(document.location.protocol + '//' + document.location.host, ''));
		}

		// this will retrieve the locale from the url
		this.getHistoryValue();

		// todo Async change route in start

		$(window).on("popstate", (e) =>
		{
			//console.log('[GaiaRouter] history popstate');

			var route = this.getHistoryValue();
			this.notifyHistory(route);
		});
	}

	public start():void
	{
		var route = this.getHistoryValue();

		//if (DEBUG) console.log('[GaiaRouter] start: ', route);

		this.notifyHistory(route, true);
	}

	public getLocale():string
	{
		return this._locale || this._config.getDefaultLocale();
	}

	public setLocale(locale:string)
	{
		this._locale = locale;

		this.setHistoryValue(this.getHistoryValue(true));
	}

	/**
	 * @method getRoute
	 * @returns {string}
	 */
	public getRoute():string
	{
		return this.getHistoryValue();
	}

	/**
	 * @method setRoute
	 * @param {string} route
	 * @param {boolean} [replace=false]
	 */
	public setRoute(route:string, replace:boolean = false):void
	{
		//if (DEBUG) console.log('[GaiaRouter] setRoute: ', route, replace);

		this.setHistoryValue(route, replace);

		this.notifyHistory(route);
	}

	private notifyHistory(route:string, isLanding:boolean = false):void
	{
		//if (DEBUG) console.log('[GaiaRouter] notifyHistory: ', route);
		this.resolvePage(route, (routeResult:IRouteResultItem) =>
		{
			//if (DEBUG) console.log(' - ', routeResult);

			Object.freeze(routeResult[0].deeplink);

			// check for redirects on landing, and do a replaceState
			if (routeResult.route != route && isLanding)
			{
				//console.log('- redirect!');
				this.setHistoryValue(routeResult.route, true);
			}

			this._gaiaHistory.onChange(routeResult);
		}, true, isLanding);
	}

	/**
	 * Returns a query parameter, the part after the `?`
	 *
	 * @method getQueryParam
	 * @param {string} key
	 * @returns {string}
	 */
	public getQueryParam(key:string):string
	{
		return decodeURIComponent((new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
	}

	/**
	 * @method notFound
	 * @param {string} branch
	 * @returns {GaiaRouter}
	 */
	public notFound(branch:string):GaiaRouter
	{
		this._notFound = branch;

		return this;
	}

	public redirect(route:string, redirect:string):GaiaRoute
	{
		return this._group.redirect(route, redirect);
	}

	public handle(route:string, callback:(params:any) => any):GaiaRoute
	{
		return this._group.handle(route, callback);
	}

	public page(route:string, branch:string):GaiaRoute
	{
		return this._group.page(route, branch);
	}

	public alias(route:string, branch:string):GaiaRoute
	{
		return this._group.alias(route, branch);
	}


	public childPage(route:string, branch:string):GaiaRoute
	{
		return this._group.childPage(route, branch);
	}

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

	public resolvePage(url:string, callback:(routeResult:IRouteResultItem) => void, includeRedirects:boolean = false, isLanding:boolean = false):void
	{
		var i:number;
		if (!this._config.isQueryStringIncluded() && (i = url.indexOf('?')) != -1) url = url.substr(0, i);

		this._group.resolvePage(url, (routeResult:IRouteResultItem) =>
		{
			if (routeResult.length > 0)
			{
				callback(routeResult);
				return;
			}

			if (this._notFound)
			{
				// todo: goto 404 route
				callback(new RouteResultItem([{branch: this._notFound, deeplink: {}}], url));
			}
			else
			{
				console.info('[GaiaRouter] no route found for "' + url + '", redirecting to index!');

				// todo: goto home
				callback(new RouteResultItem([{branch: 'index', deeplink: {}}], url));
			}
		}, includeRedirects, isLanding);

	}

	public assemble(branch:string, params:any = {}):string
	{
		var route = this._group.getRoute(branch, params);

		return route ? route.assemble(params) : null;
	}

	public getGroup():GaiaRouteGroup
	{
		return this._group;
	}


	private getHistoryValue(skipLocale:boolean = false, ignoreEnabledState:boolean = false):string
	{
		if (!this._config.isEnabled() && !ignoreEnabledState)
		{
			return this._localValue;
		}

		// fix for weird IE version
		var location = (history['location'] || document.location).href || document.location.href;

		this._queryString = document.location.search;

		// force trailing /
		if (location.split('').pop() != '/')
		{
			location += '/';
		}

		// prevent future errors
		if (location == undefined || location == null)
		{
			location = '';
		}

		// strip basepath, leave deeplink
		if (location.indexOf(this._base) == 0)
		{
			location = location.replace(this._base, '')
		}

		// force starting /
		if (location.charAt(0) != '/')
		{
			location = '/' + location;
		}
		// remove trailing /
		if (location.split('').pop() == '/')
		{
			location = location.substr(0, location.length - 1);
		}

		// locale hook
		if (!skipLocale)
		{
			var locale = this._config.getLocaleRegExp().exec(location);

			if (locale)
			{
				this._locale = locale[1];
			}
		}

		location = location.replace(this._config.getLocaleRegExp(), '');
		// end locale hook

		// force starting /
		if (location.charAt(0) != '/')
		{
			location = '/' + location;
		}

		//console.log('[GaiaRouter] getHistoryValue: ', location);

		return location;
	}

	private setHistoryValue(value:string, replace:boolean = false):void
	{
		//console.log('[GaiaRouter] setHistoryValue: ', value, replace);

		if (!this._config.isEnabled())
		{
			this._localValue = value;
			return;
		}

		// absolute
		if (value.charAt(0) == '/')
		{
			// chrome
			if (!history['emulate'])
			{
				value = value.substr(1);
			}
		}
		else
		{
			// chrome
			if (!history['emulate'])
			{
				value = (this.getHistoryValue(true).replace(/[^\/]+$/g, '') + value).substr(1);
			}
		}

		// absolute
		if (value.charAt(0) == '/')
		{
			// locale hook
			value = (this._locale ? '/' + this._locale : '') + value;
		}
		// relative
		else
		{
			// locale hook
			value = (this._locale ? this._locale + '/' : '') + value;
		}

		if (this._queryString.length > 0)
		{
			value += this._queryString;
		}

		if (!history['emulate'])
		{
			history[replace ? 'replaceState' : 'pushState'](null, null, this._base + (value.charAt(0) == '/' ? value.substr(0) : value));
		}
		else
		{
			history[replace ? 'replaceState' : 'pushState'](null, null, value);
		}
	}
}

export default GaiaRouter;