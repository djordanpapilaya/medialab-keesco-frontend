/**
 * This class contains some utility functions for Regular Expressions.
 *
 * @module Temple
 * @namespace temple.utils.types
 * @class RegExpUtils
 * @author Arjan van Wijk
 */
class RegExpUtils
{
	/**
	 * Searches text for all matches to the regular expression given in pattern and return the result.
	 * Modelled like the php [preg_match_all](http://php.net/manual/en/function.preg-match-all.php).
	 *
	 * @method pregMatchAll
	 * @static
	 * @param {RegExp} regExp The regular expression.
	 * @param {string} content The string to search for.
	 * @return {any[]}
	 */
	public static pregMatchAll(regExp:RegExp, content:string):any[]
	{
		var resultList:any[] = [];

		var result:any = regExp.exec(content);

		var index:number = -1;
		while(result != null && index != result.index)
		{
			for(var i:number = 0; i < result.length; ++i)
			{
				if(true)
				{
					if(resultList[i] == null)
					{
						resultList[i] = [];
					}
					resultList[i].push(result[i] != undefined ? result[i] : '');
				}
				else
				{
					// PREG_SET_ORDER implementatie
				}
			}
			index = result.index;
			result = regExp.exec(content);
		}
		return resultList;
	}

	/**
	 * Searches for a match to the regular expression given in pattern.
	 * Modelled like the php [preg_match](http://php.net/manual/en/function.preg-match.php).
	 *
	 * @method pregMatch
	 * @static
	 * @param {RegExp} regExp The regular expression.
	 * @param {string} content The string to search for.
	 * @return {any[]}
	 */
	public static pregMatch(regExp:RegExp, content:string):any[]
	{
		var resultList:any[] = [];

		var result:any = regExp.exec(content);
		if(result != null)
		{
			for(var i:number = 0; i < result.length; ++i)
			{
				resultList.push(result[i] != undefined ? result[i] : '');
			}
		}
		return resultList;
	}
}

export default RegExpUtils;