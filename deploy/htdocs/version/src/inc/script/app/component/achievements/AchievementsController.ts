import AbstractComponentController from 'lib/temple/component/AbstractComponentController';

import AchievementsOptions from 'app/component/achievements/AchievementsOptions';
import AchievementsViewModel from 'app/component/achievements/AchievementsViewModel';

class AchievementsController extends AbstractComponentController
{
    options:AchievementsOptions;
    viewModel:AchievementsViewModel;

    constructor(element:HTMLElement, options?:any)
    {
        super(element, options);
    }

    /**
     *	After calling super.init, your pages DOM is ready
     */
    init()
    {
        super.init();
    }

    destruct()
    {
        super.destruct();
    }
}

export default AchievementsController;