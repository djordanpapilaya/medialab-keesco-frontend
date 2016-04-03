import AbstractComponentController from 'lib/temple/component/AbstractComponentController';

import AchievementsOptions from 'app/component/achievements/AchievementsOptions';
import AchievementsViewModel from 'app/component/achievements/AchievementsViewModel';

import DataManager from "../../data/DataManager";

import UserService from "app/net/service/UserService";
import IUserData from "app/net/service/VO/IUserData";

class AchievementsController extends AbstractComponentController
{
	options:AchievementsOptions;
	viewModel:AchievementsViewModel;

	constructor(element:HTMLElement, options?:any)
	{
		super(element, options);
	}

	/**
	 *    After calling super.init, your pages DOM is ready
	 */
	init()
	{
		super.init();
		this.getUserAchievements();
	}

	public getUserAchievements()
	{
		DataManager.getInstance().UserService.getCurrentUser().then((result:IUserData) =>
		{
			console.log(result.user.completed_assignments);
			this.viewModel.Achievements(result.user.completed_assignments);
		});
	}

	destruct()
	{
		super.destruct();
	}
}

export default AchievementsController;