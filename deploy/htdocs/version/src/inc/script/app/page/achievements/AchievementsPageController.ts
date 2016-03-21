import DefaultPageController from "app/page/DefaultPageController";
import AchievementsPageViewModel from "app/page/achievements/AchievementsPageViewModel"; 

import DataManager from "../../data/DataManager";
import * as Gaia from "lib/gaia/api/Gaia";

import ko = require("knockout");

class AchievementsPageController extends DefaultPageController
{
	viewModel: AchievementsPageViewModel; 
	
	constructor()
	{
		super();
	}

	/**
	 *	After calling super.init, your pages DOM is ready
	 */
	init()
	{
		super.init();
	}
	
	/**
	 *	Destruct your page objects here
	 *	- call destruct() on your own objects
	 *	- clear global event listeners (window.resize, window.scroll, window.keydown, etc)
	 *	- clear timeouts/intervals
	 *	- do null-checks on your objects before destructing them, and set them to null afterwards
	 */
	destruct()
	{
		// Put your cleaning here
		
		// always call this last
		super.destruct();
	}
}

export default AchievementsPageController;