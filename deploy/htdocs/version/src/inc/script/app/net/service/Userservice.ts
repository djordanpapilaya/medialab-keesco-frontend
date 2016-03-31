import refdef from 'lib/ReferenceDefinitions';
import Promise = require('bluebird');
import AbstractService from './AbstractService';
import IGateway from 'app/net/gateway/IGateway';
import IGatewayResult from 'app/net/gateway/result/IGatewayResult';
import IResult from 'lib/temple/core/IResult';
import IUserData from 'VO/IUserData';

class UserService extends AbstractService {

	constructor(gateway:IGateway)
	{
		super(gateway, true);
	}

	public getCurrentUser():Promise<IGatewayResult<IUserData>>
	{
		return this.gateway.get('/users/3');
	}
}

export default UserService;