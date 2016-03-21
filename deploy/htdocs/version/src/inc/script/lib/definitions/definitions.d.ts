// import all definitions
// don't reference this file from your typescript files, instead use the TS file:
// import refdef from "lib/ReferenceDefinitions";

///<reference path="../require/require.d.ts" />
///<reference path="../gsap/greensock.d.ts" />
///<reference path="../jquery/jquery.d.ts" />
///<reference path="../jquery/jquery.cookie.d.ts" />
///<reference path="../history/history.d.ts" />
///<reference path="../../test/jasmine.d.ts" />
///<reference path="../modernizr/modernizr.d.ts" />
///<reference path="../knockout/knockout.mediamonks.d.ts" />
///<reference path="../createjs/createjs.d.ts" />
///<reference path="../createjs/preloadjs.d.ts" />
///<reference path="../createjs/soundjs.d.ts" />
///<reference path="../sockjs/sockjs.d.ts" />
///<reference path="../bluebird/bluebird.d.ts" />

///<reference path="touch.d.ts" />


// export files as typescript module in which a javascript define() is used instead of a typescript export.
// this way they can be imported as "import externals from "lib/externals";" in a typescript file.
declare module "lib/externals"
{
	// dummy export, needed for not removing the import
	var ext:any;
	export default ext;
}

declare module "app/config/config"
{
	// dummy export, needed for not removing the import
	var cfg:any;
	export default cfg;
}


// declare global libaries and variables that have no typescript definitions
declare var DEBUG:boolean;
declare var RELEASE:boolean;
declare var isMobile:boolean;
declare var XRegExp:any;

declare type Class = any;
declare type int = number;
declare type uint = number;
declare type float = number;
declare type URI = string;
