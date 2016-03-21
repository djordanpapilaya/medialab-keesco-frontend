import AbstractComponentController from 'lib/temple/component/AbstractComponentController';
import AbstractComponentViewModel from 'lib/temple/component/AbstractComponentViewModel';

import AchievementsController from 'app/component/achievements/AchievementsController';

import ko = require('knockout');

class AchievementsViewModel extends AbstractComponentViewModel
{
    controller:AchievementsController;

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

export default AchievementsViewModel;