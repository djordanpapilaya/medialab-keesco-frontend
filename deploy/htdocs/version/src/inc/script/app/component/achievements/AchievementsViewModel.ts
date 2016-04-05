import AbstractComponentController from 'lib/temple/component/AbstractComponentController';
import AbstractComponentViewModel from 'lib/temple/component/AbstractComponentViewModel';

import AchievementsController from 'app/component/achievements/AchievementsController';

import ko = require('knockout');

import IUserData from "app/net/service/VO/IUserData";

class AchievementsViewModel extends AbstractComponentViewModel
{
	controller:AchievementsController;

	public Achievements:KnockoutObservable<any> = ko.observable<any>();
	public SelectedAchievement:KnockoutObservable<any> = ko.observable<any>();

	public Images:KnockoutObservable<any> = ko.observable<any>();

	constructor()
	{
		super();

		// initiate observables

		// initiate computed
	}

	/**
	 *    Destruct your data objects here
	 *    - set your observables to null
	 */
	destruct()
	{
		// Put your cleaning here

		super.destruct();
	}
}

export default AchievementsViewModel;