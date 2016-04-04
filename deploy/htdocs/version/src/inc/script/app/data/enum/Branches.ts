/**
 * @namespace app.data.enum
 * @class Branches
 */
class Branches
{
	public static INDEX:string = 'index';
	public static HOME:string = 'index/home';
	public static PROFILE:string = 'index/profile';
	public static ACHIEVEMENTS:string = 'index/achievements';
	public static ACHIEVEMENTS_DETAIL:string = 'index/achievements-detail';
	
}

// use in templates
window['Branches'] = Branches;

// use in classes
export default Branches;