import * as utils from "lib/temple/utils/Utils";
import EventDispatcher from "lib/temple/events/EventDispatcher";
import IDestructible from "lib/temple/core/IDestructible";
import DestructibleHelper from "lib/temple/core/DestructibleHelper";

import * as Gaia from "../api/Gaia";
import IPageAsset from "../interface/IPageAsset";
import IPageViewModel from "../interface/IPageViewModel";
import IPageController from "../interface/IPageController";
import GaiaEvent from "../events/GaiaEvent";
import PageEvent from "../events/PageEvent";
import GaiaHistoryEvent from "../events/GaiaHistoryEvent";

import IComponentController from "lib/temple/component/IComponentController";
import ko = require('knockout');

/**
 * AbstractPageController
 *
 * @module Gaia
 * @namespace gaia.assets
 * @class AbstractPageController
 * @extends temple.events.EventDispatcher
 */
class AbstractPageController extends EventDispatcher implements IPageController
{
	/**
	 * reference to viewmodel, redeclare in page to correct type
	 *
	 * @property viewModel
	 */
	public viewModel:IPageViewModel;

	/**
	 * reference to the page-div in the DOM, use this for element lookups
	 *
	 * @property element
	 */
	public element:HTMLDivElement;

	/**
	 * reference to the PageAsset (where you can find all info like id, route, title, etc.)
	 *
	 * @property page
	 */
	public page:IPageAsset;

	/**
	 * autotransitions rock, set to false if you want to do your own
	 *
	 * @property _autoTransition
	 */
	public _autoTransition:boolean = true;

	/**
	 * helper instance for destructing stuff
	 *
	 * @property {DestructibleHelper}
	 */
	protected destructibles:DestructibleHelper;

	/**
	 * Debug flag
	 *
	 * @property _debug
	 * @type boolean
	 * @private
	 */
	private _debug = false;

	/**
	 * Constructor
	 *
	 * @constructor
	 */
	constructor()
	{
		super();

		this.destructibles = new DestructibleHelper();
	}

	/**
	 * save viewmodel reference, and add a refence back to this page on the viewModel
	 *
	 * @method setViewModel
	 * @param {IViewModel} viewModel
	 * @return {void}
	 */
	public setViewModel(viewModel:IPageViewModel):void
	{
		this.viewModel = viewModel;
		this.viewModel.setController(this);
	}

	/**
	 * set the template, so it can be used for KnockOut
	 *
	 * @method setTemplate
	 * @param {string} template
	 * @return {void}
	 */
	public setTemplate(template:string):void
	{
		ko.templates[this.page.id] = template;
	}

	/**
	 * always call super.init() when you override this method, or else we don't have a ViewController
	 *
	 * @method init
	 * @return {void}
	 */
	public init():void
	{
		// find container to inser this page in
		var container:HTMLDivElement;
		var page = this.page;
		while (page.getParent() && !container)
		{
			// todo, add support for named containers: "[data-gaia-container=" + container + "]"
			var el = page.getParent().getContent().element;
			if (this.page.container)
			{
				container = <HTMLDivElement>$('[data-gaia-container="' + this.page.container + '"]', el)[0];
			}
			else
			{
				container = <HTMLDivElement>$('[data-gaia-container]', el)[0];
			}
			page = page.getParent();
		}

		// we need a container div for our page
		container = container || <HTMLDivElement>$('[data-gaia-container=' + this.page.container + ']')[0] || <HTMLDivElement>$('[data-gaia-container=main]')[0] || <HTMLDivElement>$('[data-gaia-container]')[0];
		var holder:HTMLDivElement = <HTMLDivElement>document.createElement('div');

		// the template will be loded in this page via data-binding
		$(holder).attr('data-bind', "template: { name: '" + this.page.id + "' }");

		// we need this css-class for our styles
		$(holder).addClass('view view-' + this.page.id.replace(/\./g, '-'));

		// and add it
		container.appendChild(holder);

		// do the KnockOut magic
		ko.applyBindings(this.viewModel, holder);

		// save the refence
		this.element = holder;

		$(this.element).find('[data-gaia-container]').each((index, item) =>
		{
			if ($(item).attr('data-gaia-container') == '')
			{
				$(item).attr('data-gaia-container', this.page.id);
			}
		});

		// hide it for now, we will show it later in the TransitionManager
		this.element.style.visibility = 'hidden';
	}

	transition():void
	{
		if (this._debug)
		{
			console.log('AbstractController::transition', this.page.id);
		}

		this.transitionComplete();
	}

	transitionIn():void
	{
		if (this._debug)
		{
			console.log('AbstractController::transitionIn', this.page.id);
		}

		this.element.style.visibility = 'visible';

		this.transitionInComplete();
	}

	transitionOut()
	{
		if (this._debug)
		{
			console.log('AbstractController::transitionOut', this.page.id);
		}

		this.element.style.visibility = 'visible';

		this.transitionOutComplete();
	}

	transitionComplete():void
	{
		if (this._debug)
		{
			console.log('AbstractController::transitionComplete', this.page.id);
		}
		this.dispatchEvent(new PageEvent(PageEvent.TRANSITION_COMPLETE));
	}

	transitionInComplete():void
	{
		if (this._debug)
		{
			console.log('AbstractController::transitionComplete', this.page.id);
		}
		this.dispatchEvent(new PageEvent(PageEvent.TRANSITION_IN_COMPLETE));
	}

	transitionOutComplete():void
	{
		if (this._debug)
		{
			console.log('AbstractController::transitionOutComplete', this.page.id);
		}
		this.dispatchEvent(new PageEvent(PageEvent.TRANSITION_OUT_COMPLETE));
	}

	onDeeplink(event:GaiaHistoryEvent):void
	{
	}

	public destruct():void
	{
		$(this.element).off('.remove');

		if (this.viewModel)
		{
			if (typeof this.viewModel.destruct !== "undefined")
			{
				this.viewModel.destruct();
			}
			this.viewModel = null;
		}

		this.page = null;

		if (this.element)
		{
			ko.cleanNode(this.element);
			$(this.element).remove();
			this.element = null;
		}

		if (this.destructibles)
		{
			this.destructibles.destruct();
			this.destructibles = null;
		}

		super.destruct();
	}
}

export default AbstractPageController;