import DefaultPageController from "app/page/DefaultPageController";
import ProfilePageViewModel from "app/page/profile/ProfilePageViewModel";

import IGatewayResult from "app/net/gateway/result/IGatewayResult";

import DataManager from "../../data/DataManager";
import * as Gaia from "lib/gaia/api/Gaia";

import ko = require("knockout");

import UserService from "app/net/service/UserService";
import IUserData from "app/net/service/VO/IUserData";

class ProfilePageController extends DefaultPageController
{
	viewModel: ProfilePageViewModel; 
	
	constructor()
	{
		super();
	}

	/**
	 *	After calling super.init, your pages DOM is ready
	 */
	init()
	{
		this.getUserInfo();
		super.init();
	}
	
	/**
	 *	Destruct your page objects here
	 *	- call destruct() on your own objects
	 *	- clear global event listeners (window.resize, window.scroll, window.keydown, etc)
	 *	- clear timeouts/intervals
	 *	- do null-checks on your objects before destructing them, and set them to null afterwards
	 */

	public getUserInfo()
	{
		DataManager.getInstance().UserService.getCurrentUser().then((result:IUserData) =>{
			this.viewModel.CurrentUser(result);
			console.log(this.viewModel.CurrentUser());
		});
	}

	destruct()
	{
		// Put your cleaning here
		
		// always call this last
		super.destruct();
	}
}

export default ProfilePageController;