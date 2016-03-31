import DefaultPageViewModel from "app/page/DefaultPageViewModel";
import DataManager from "../../data/DataManager";

import ko = require('knockout');

import IUserData from "app/net/service/VO/IUserData";

class ProfilePageViewModel extends DefaultPageViewModel
{
	// declare observables/computed

	public CurrentUser:KnockoutObservable<IUserData> = ko.observable<IUserData>();
	
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

export default ProfilePageViewModel;