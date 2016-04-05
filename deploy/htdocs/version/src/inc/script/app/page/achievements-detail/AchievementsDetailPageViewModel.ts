import DefaultPageViewModel from "app/page/DefaultPageViewModel";
import DataManager from "../../data/DataManager";
import Branches from 'app/data/enum/Branches';

import ko = require('knockout');
import * as Gaia from "lib/gaia/api/Gaia";


class AchievementsDetailPageViewModel extends DefaultPageViewModel
{
	// declare observables/computed

	public currentAchievement:KnockoutObservable<string> = ko.observable<string>();
	public Achievement:KnockoutObservable<any> = ko.observable<any>();
	
	constructor()
	{
		super();
		
		// initiate observables
		
		// initiate computed
	}

	public gotoHome()
	{
		Gaia.api.goto(Branches.PROFILE);
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