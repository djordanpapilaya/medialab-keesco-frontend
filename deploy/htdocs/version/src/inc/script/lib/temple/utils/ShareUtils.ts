import StringUtils from "lib/temple/utils/types/StringUtils";
import LocaleManager from "lib/temple/locale/LocaleManager";

/**
 * Utility class for easy sharing with support for Facebook, Twitter, Google+, LinkedIn.
 *
 * It contains functions for sharing to the different platforms and has support for direct sharing with data-tags in the html after you call the {{#crossLink "temple.utils.ShareUtils/init:method"}}{{/crossLink}} method first.
 *
 * @module Temple
 * @namespace temple.utils
 * @class ShareUtils
 * @author Arthur Dam <arthur@mediamonks.com>
 */
class ShareUtils
{
	private static facebookShareUrl:string = "https://www.facebook.com/sharer/sharer.php?u={url}";
	private static twitterShareUrl:string = "https://twitter.com/intent/tweet?url={url}&text={tweet}";
	private static plusShareUrl:string = "https://plusone.google.com/_/+1/confirm?hl={language}&url={url}";
	private static linkedinShareUrl:string = "http://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}&summary={text}";

	/**
	 * Function to init the sharing with html data-tags.
	 *
	 * Supported data-tags:
	 *
	 * - __data-share__
	 * - __data-share-type__
	 * - __data-share-url__
	 * - __data-share-text__ (Only supported when sharing with LinkedIn and Twitter.)
	 * - __data-share-title__ (Only supported when sharing with LinkedIn.)
	 *
	 * Example:
	 *
	 * ```
	 * <a data-share
	 * data-share-type="facebook"
	 * data-share-url="http://www.google.com/">share on facebook</a>
	 *
	 * <a data-share
	 * data-share-type="twitter"
	 * data-share-text="share onto your #twitter feed"
	 * data-share-url="http://www.google.com/">share on twitter</a>
	 *
	 * <a data-share
	 * data-share-type="plus"
	 * data-share-url="http://www.google.com/">share on plus</a>
	 *
	 * <a data-share
	 * data-share-type="linkedin"
	 * data-share-url="http://www.google.com/"
	 * data-share-text="share on linkedin"
	 * data-share-title="title">share on linkedin</a>
	 *```
	 *
	 * @method init
	 * @static
	 * @return {void}
	 **/
	public static init():void
	{
		$('body').on('tap', '[data-share]', (event:JQueryEventObject) => {
			var el = $(event.currentTarget);
			var type = el.attr('data-share-type');
			if(type === ShareType[ShareType.facebook])
			{
				ShareUtils.shareFacebook(el.attr('data-share-url') || window.location.href);
			} else if(type === ShareType[ShareType.twitter])
			{
				ShareUtils.shareTwitter(el.attr('data-share-url') || window.location.href, el.attr('data-share-text'));
			} else if(type === ShareType[ShareType.plus])
			{
				ShareUtils.shareGooglePlus(el.attr('data-share-url') || window.location.href)
			} else if(type === ShareType[ShareType.linkedin])
			{
				ShareUtils.shareLinkedIn(el.attr('data-share-url') || window.location.href, el.attr('data-share-title'), el.attr('data-share-text'))
			}
		});
	}

	/**
	 * Share on facebook using the sharer.php.
	 *
	 * @method shareFacebook
	 * @static
	 * @param {string} url The url to share.
	 * @return {void}
	 **/
	public static shareFacebook(url:string):void
	{
		if(typeof url == 'undefined') return;
		window.open(StringUtils.replaceVars(ShareUtils.facebookShareUrl, {url: url}), 'sharer','toolbar=0,status=0,width=626,height=436');
	}

	/**
	 * Share on twitter.
	 *
	 * @method shareTwitter
	 * @static
	 * @param {string} url The url to share.
	 * @param {string} text The text to share.
	 * @return {void}
	 **/
	public static shareTwitter(url:string, text:string):void
	{
		if(typeof text == 'undefined' || typeof url == 'undefined') return;

		window.open(StringUtils.replaceVars(ShareUtils.twitterShareUrl, {tweet: encodeURIComponent(text), url: url}), 'sharer','toolbar=0,status=0,width=575,height=370');
	}

	/**
	 * Share on Google+.
	 *
	 * @method shareGooglePlus
	 * @static
	 * @param {string} url The url to share.
	 * @return {void}
	 **/
	public static shareGooglePlus(url:string):void
	{
		if(typeof url == 'undefined') return;
		window.open(StringUtils.replaceVars(ShareUtils.plusShareUrl, {url: url, language: LocaleManager.getInstance().getLocale() || 'en'}), 'sharer','toolbar=0,status=0,width=550,height=350');
	}

	/**
	 * Share on LinkedIn.
	 *
	 * @method shareLinkedIn
	 * @static
	 * @param {string} url The url to share.
	 * @param {string} [title] The title to share.
	 * @param {string} [text] The text to share.
	 * @return {void}
	 **/
	public static shareLinkedIn(url:string, title?:string, text?:string):void
	{
		if(typeof url == 'undefined') return;
		if(typeof title == 'undefined') title = '';
		if(typeof text == 'undefined') text = '';
		window.open(StringUtils.replaceVars(ShareUtils.linkedinShareUrl, {url: encodeURIComponent(url), title: encodeURIComponent(title), text: encodeURIComponent(text)}), 'sharer','toolbar=0,status=0,width=520,height=570');
	}
}

enum ShareType {
	facebook, twitter, plus, linkedin
}

export default ShareUtils;
