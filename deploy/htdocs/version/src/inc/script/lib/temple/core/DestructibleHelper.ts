import IDestructible from "lib/temple/core/IDestructible";
import IComponentController from "lib/temple/component/IComponentController";
import ko = require('knockout');
import Promise = require("bluebird");


class DestructibleHelper implements IDestructible
{
	private _isDestructed:boolean = false;

	/**
	 * list of registered intervals and timeouts, used for destruction
	 *
	 * @property _intervals
	 * @protected
	 */
	private _intervals:Array<number> = [];

	/**
	 * list of Knockout subscriptions, used for destruction
	 *
	 * @property _subscriptions
	 * @protected
	 */
	private _subscriptions:Array<KnockoutSubscription> = [];

	/**
	 * list of Knockout subscriptions, used for destruction
	 *
	 * @property _subscriptions
	 * @protected
	 */
	private _promises:Array<Promise<any>> = [];

	/**
	 * list of destructibles, like Event handlers, used for destruction
	 *
	 * @property _destructibles
	 * @protected
	 */
	private _destructibles:Array<IDestructible> = [];

	constructor()
	{

	}

	public static catchCancelablePromise(promise:Promise<any>):void
	{
		if (!promise.isCancellable())
		{
			console.error('promise is not cancellable', promise);
		}

		// add a catch handler only for when this promise is canceled
		// NOTE: for IE8, rename to 'caught'
		promise.catch<any>(Promise.CancellationError, (error:any):any =>
		{
			if (DEBUG) console.log('canceled pending promise');
		});
	}

	public add(destructible:IDestructible):IDestructible
	{
		this._destructibles.push(destructible);

		return destructible;
	}

	public addInterval(interval:number):number
	{
		this._intervals.push(interval);

		return interval;
	}

	public addKOSubscription(subscription:KnockoutSubscription):KnockoutSubscription
	{
		this._subscriptions.push(subscription);

		return subscription;
	}

	// utility method to save promises and add catch-cancelable handlers
	// should normally exists in the AbstractPageController
	public addPromise(promise:Promise<any>):Promise<any>
	{
		DestructibleHelper.catchCancelablePromise(promise);

		this._promises.push(promise);

		return promise;
	}

	public destruct():void
	{
		// clear intervals
		if (this._intervals)
		{
			for (var i = 0; i < this._intervals.length; i++)
			{
				clearInterval(this._intervals[i]);
			}
			this._intervals.length = 0;
			this._intervals = null;
		}

		// clear subscriptions
		if (this._subscriptions)
		{
			for (var i = 0; i < this._subscriptions.length; i++)
			{
				var subscription = this._subscriptions[i];
				if (subscription)
				{
					subscription.dispose();
				}
			}
			this._subscriptions.length = 0;
			this._subscriptions = null;
		}

		// clear destructibles
		if (this._destructibles)
		{
			for (var i = 0; i < this._destructibles.length; i++)
			{
				var destructible = this._destructibles[i];
				if (destructible)
				{
					destructible.destruct();
				}
			}
			this._destructibles.length = 0;
			this._destructibles = null;
		}

		// clear promises
		if (this._promises)
		{
			for (var i = 0; i < this._promises.length; i++)
			{
				var promise = this._promises[i];

				if (promise &&
					promise.cancellable() &&
					promise.isPending())
				{
					promise.cancel();
				}
			}
			this._promises.length = 0;
			this._promises = null;
		}

		this._isDestructed = true;
	}

	public isDestructed():boolean
	{
		return this._isDestructed;
	}
}

export default DestructibleHelper;