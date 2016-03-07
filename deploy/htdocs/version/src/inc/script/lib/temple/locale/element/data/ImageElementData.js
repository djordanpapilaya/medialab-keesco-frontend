var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "./AbstractElementData"], function (require, exports, AbstractElementData_1) {
    /**
     * @module Temple
     * @namespace temple.locale.element.data
     * @extend temple.locale.element.data.AbstractElementData
     * @class ImageElementData
     */
    var ImageElementData = (function (_super) {
        __extends(ImageElementData, _super);
        function ImageElementData(element, url) {
            _super.call(this, element);
            this.url = url;
        }
        return ImageElementData;
    })(AbstractElementData_1.default);
    exports.default = ImageElementData;
});
