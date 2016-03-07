define(["require", "exports", "lib/temple/utils/types/StringUtils", "lib/temple/locale/LocaleManager"], function (require, exports, StringUtils_1, LocaleManager_1) {
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
    var ShareUtils = (function () {
        function ShareUtils() {
        }
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
        ShareUtils.init = function () {
            $('body').on('tap', '[data-share]', function (event) {
                var el = $(event.currentTarget);
                var type = el.attr('data-share-type');
                if (type === ShareType[ShareType.facebook]) {
                    ShareUtils.shareFacebook(el.attr('data-share-url') || window.location.href);
                }
                else if (type === ShareType[ShareType.twitter]) {
                    ShareUtils.shareTwitter(el.attr('data-share-url') || window.location.href, el.attr('data-share-text'));
                }
                else if (type === ShareType[ShareType.plus]) {
                    ShareUtils.shareGooglePlus(el.attr('data-share-url') || window.location.href);
                }
                else if (type === ShareType[ShareType.linkedin]) {
                    ShareUtils.shareLinkedIn(el.attr('data-share-url') || window.location.href, el.attr('data-share-title'), el.attr('data-share-text'));
                }
            });
        };
        /**
         * Share on facebook using the sharer.php.
         *
         * @method shareFacebook
         * @static
         * @param {string} url The url to share.
         * @return {void}
         **/
        ShareUtils.shareFacebook = function (url) {
            if (typeof url == 'undefined')
                return;
            window.open(StringUtils_1.default.replaceVars(ShareUtils.facebookShareUrl, { url: url }), 'sharer', 'toolbar=0,status=0,width=626,height=436');
        };
        /**
         * Share on twitter.
         *
         * @method shareTwitter
         * @static
         * @param {string} url The url to share.
         * @param {string} text The text to share.
         * @return {void}
         **/
        ShareUtils.shareTwitter = function (url, text) {
            if (typeof text == 'undefined' || typeof url == 'undefined')
                return;
            window.open(StringUtils_1.default.replaceVars(ShareUtils.twitterShareUrl, { tweet: encodeURIComponent(text), url: url }), 'sharer', 'toolbar=0,status=0,width=575,height=370');
        };
        /**
         * Share on Google+.
         *
         * @method shareGooglePlus
         * @static
         * @param {string} url The url to share.
         * @return {void}
         **/
        ShareUtils.shareGooglePlus = function (url) {
            if (typeof url == 'undefined')
                return;
            window.open(StringUtils_1.default.replaceVars(ShareUtils.plusShareUrl, { url: url, language: LocaleManager_1.default.getInstance().getLocale() || 'en' }), 'sharer', 'toolbar=0,status=0,width=550,height=350');
        };
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
        ShareUtils.shareLinkedIn = function (url, title, text) {
            if (typeof url == 'undefined')
                return;
            if (typeof title == 'undefined')
                title = '';
            if (typeof text == 'undefined')
                text = '';
            window.open(StringUtils_1.default.replaceVars(ShareUtils.linkedinShareUrl, { url: encodeURIComponent(url), title: encodeURIComponent(title), text: encodeURIComponent(text) }), 'sharer', 'toolbar=0,status=0,width=520,height=570');
        };
        ShareUtils.facebookShareUrl = "https://www.facebook.com/sharer/sharer.php?u={url}";
        ShareUtils.twitterShareUrl = "https://twitter.com/intent/tweet?url={url}&text={tweet}";
        ShareUtils.plusShareUrl = "https://plusone.google.com/_/+1/confirm?hl={language}&url={url}";
        ShareUtils.linkedinShareUrl = "http://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}&summary={text}";
        return ShareUtils;
    })();
    var ShareType;
    (function (ShareType) {
        ShareType[ShareType["facebook"] = 0] = "facebook";
        ShareType[ShareType["twitter"] = 1] = "twitter";
        ShareType[ShareType["plus"] = 2] = "plus";
        ShareType[ShareType["linkedin"] = 3] = "linkedin";
    })(ShareType || (ShareType = {}));
    exports.default = ShareUtils;
});
