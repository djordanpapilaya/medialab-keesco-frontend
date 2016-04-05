import AbstractComponentController from 'lib/temple/component/AbstractComponentController';

import AchievementsOptions from 'app/component/achievements/AchievementsOptions';
import AchievementsViewModel from 'app/component/achievements/AchievementsViewModel';

import DataManager from "../../data/DataManager";
import Branches from 'app/data/enum/Branches'

import UserService from "app/net/service/UserService";
import IUserData from "app/net/service/VO/IUserData";

import * as Gaia from "lib/gaia/api/Gaia";

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

		this.destructibles.addKOSubscription(this.viewModel.SelectedAchievement.subscribe((selectedAchievement) => {
			this.gotoAchievementDetail(selectedAchievement)
		}));
	}

	public getUserAchievements()
	{
		DataManager.getInstance().UserService.getCurrentUser().then((result:IUserData) =>
		{
			this.viewModel.Achievements(result.user.completed_assignments);
		});


	}

	public gotoAchievementDetail(achievementId:any)
	{
		Gaia.api.goto(Branches.ACHIEVEMENTS_DETAIL, {slug: achievementId.id});
	}

	destruct()
	{
		super.destruct();
	}
}

export default AchievementsController;