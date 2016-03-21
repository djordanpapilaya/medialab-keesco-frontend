import DefaultPageViewModel from "app/page/DefaultPageViewModel";
import DataManager from "../../data/DataManager";

import ko = require('knockout');

class AchievementsDetailPageViewModel extends DefaultPageViewModel
{
	// declare observables/computed
	
	constructor()
	{
		super();
		
		// initiate observables
		
		// initiate computed
	}
	
	/**
	 *	Destruct your data objects here
	 *	- set your observables to null
	 */
	destruct()
	{
		// Put your cleaning here
		
		super.destruct();
	}
}

export default AchievementsDetailPageViewModel;