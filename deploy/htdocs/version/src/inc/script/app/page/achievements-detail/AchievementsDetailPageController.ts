import DefaultPageController from "app/page/DefaultPageController";
import AchievementsDetailPageViewModel from "app/page/achievements-detail/AchievementsDetailPageViewModel"; 

import DataManager from "../../data/DataManager";
import * as Gaia from "lib/gaia/api/Gaia";

import ko = require("knockout");

class AchievementsDetailPageController extends DefaultPageController
{
	viewModel: AchievementsDetailPageViewModel; 
	
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

export default AchievementsDetailPageController;