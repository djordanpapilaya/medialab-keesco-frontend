import def from "lib/ReferenceDefinitions";
import EventDispatcher from "lib/temple/events/EventDispatcher";
import SocketEvent from "lib/temple/net/sockets/SocketEvent";
import IResult from "lib/temple/core/IResult";
import MobileDetect from "lib/temple/utils/MobileDetect";
import ISocketResult from "./ISocketResult";

/**
 *
 * @module Temple
 * @namespace temple.net.sockets
 * @class SocketService
 */
class SocketService extends EventDispatcher
{
	private _socket:SockJS;

	private _handleSocketOpened:EventListener;
	private _handleSocketMessage:EventListener;
	private _handleSocketClosed:EventListener;

	private _uniqueCallbackId:number = 0;
	private _reconnectTier:number = 0;
	private _reconnectTimeout:number;
	private _reconnectDelayTiers:number[] = [
		10 * 1000,
		20 * 1000,
		30 * 1000
	];
	private _maxRandomReconnectDelay:number = 5 * 1000;

	private _getServersTimeout:number = 2 * 1000;
	private _maxRandomGetServersDelay:number = 4 * 1000;

	private _connect:boolean = false;

	private _servers:string[];
	private _currentServerIndex:number;
	private _port:number;

	private _protocol:string;

	/**
	 * The url to connect to.
	 *
	 * @property url
	 * @type {string}
	 */
	public url:string;

	/**
	 * Whether debug is enabled or disabled. If debug is enabled logs will be outputted to the console.
	 *
	 * @property debug
	 * @type {boolean}
	 */
	public debug:boolean;

	/**
	 * Creates a new SocketService that will establish a connection to a socketserver with [SockJS](https://github.com/sockjs/sockjs-client). To establish a connection a MediaMonks specific connection stategy is used.
	 *
	 * Socket connect strategy:
	 *
	 * The client loads a list of servers from the given url.
	 * The response also contains a preferred server index and a port to connect to.
	 * The first connection with SockJS is made to the preferred server.
	 * If the first connection fails, the code will try all the servers in the list one after another until a connection is established.
	 * If no connection can be made to all of the servers in the list. A tiered (10s, 20s, 30s) timeout will start with a random delay.
	 * After the timeout is completed the process is repeated until a connection can be made.
	 *
	 * @class SocketService
	 * @constructor
	 *
	 * @param {string} url The url to connect to.
	 * @param {boolean} [debug=true] Whether debug is enabled or disabled. If debug is enabled logs will be outputted to the console.
	 */
	constructor(url:string, debug:boolean = true)
	{
		super();

		this.url = url;
		this.debug = debug;
	}

	/**
	 * Connects to a server.
	 *
	 * @method connect
	 * @returns {void}
	 */
	public connect():void
	{
		this._connect = true;

		if (this.isConnected())
		{
			// make sure we have disconnected
			if (this.debug) console.error('SocketService::Connect::AlreadyConnected');
			return;
		}

		if (this.debug) console.log('SocketService::Connect');

		this._servers = [];
		this._currentServerIndex = 0;

		this._reconnectTier = 0;
		this.forceConnect();
	}

	/**
	 * Returns if there is already a connection to the server.
	 *
	 * @method isConnected
	 * @returns {boolean}
	 */
	public isConnected():boolean
	{
		return typeof this._socket != 'undefined' && this._socket.readyState == SockJS.OPEN;
	}

	/**
	 * Disconnects the client from the server.
	 *
	 * @method disconnect
	 * @returns {void}
	 */
	public disconnect():void
	{
		this._connect = false;

		clearTimeout(this._reconnectTimeout);

		if (typeof this._socket == 'undefined')
		{
			return;
		}

		if (this.debug) console.log('SocketService::Disconnect');

		// remove event listeners
		// prevents handleSocketClosed from firing
		// remove the event listener so it doesn't attempt to reconnect
		this.removeEventListeners(this._socket);

		var result = this._socket.close();

		if (this.debug) console.log('SocketService::Disconnect( ' + result + ' )');

		this._socket = undefined;
	}

	/**
	 * Sends a message to the socket server.
	 *
	 * @method send
	 * @param {string} type The type of the message to send.
	 * @param {string} [action] The action of the message to send.
	 * @param {any} [data] The data of the message to send.
	 * @returns {void}
	 */
	public send(type:string, action?:string, data?:any):void
	{
		if (!this.isConnected()) throw new Error("Not connected");

		var message:ISocketMessage = {t: type};

		if (typeof data != 'undefined')
		{
			message["d"] = data;
		}
		if (typeof action != 'undefined')
		{
			message["a"] = action;
		}

		if (this.debug)
		{
			console.log("send", message);
		}

		this._socket.send(JSON.stringify(message));
	}

	/**
	 * Sends a request to the socket server. The request method is a shortcut method that calls the {{#crossLink "temple.net.sockets.SocketService/send:method"}}{{/crossLink}} method and handles the response from the server in the form of a seperate socket message with the same action.
	 *
	 * @method request
	 * @param {string} action The action of the request to send. The action is also used to link the message from the server to the request.
	 * @param {any} [data] The data of the request to send.
	 * @param {(result:IResult<any>) => any} [callback] The callback that is called when the server responds with a message with the same action as the request.
	 * @returns {void}
	 */
	public request(action:string, data?:any, callback?:(result:ISocketResult<any, any>) => any)
	{
		var handler = this.addEventListener(SocketEvent.MESSAGE, (event:SocketEvent) =>
		{
			if (event.action == action)
			{
				handler.destruct();

				callback(event.data);
			}
		});

		this.send(REQUEST, action, data);
	}

	private forceConnect():void
	{
		if (this.debug) console.log('SocketService::ForceConnect');

		if (!this.url) throw new Error("URL not set");

		if(!this._connect) return;

		if(this._servers.length > 0 && this._currentServerIndex < this._servers.length)
		{
			if (!this._protocol) this._protocol = this.url.substr(0, this.url.indexOf("://") + 3);

			if (this.debug) console.log("SocketService::Connect to server: '" + (this._protocol + this._servers[this._currentServerIndex] + ':' + this._port) + "'");
			if (this.debug) console.log("SocketService::Protocols: ", this.getProtocols());

			this._socket = new SockJS(this._protocol + this._servers[this._currentServerIndex] + ':' + this._port + '/soccom', undefined, {
				debug: false,
				devel: true,
				protocols_whitelist: this.getProtocols()
			});

			this.addEventListeners(this._socket);
		}
		else
		{
			this.getServers();
		}
	}

	private getServers()
	{
		if (this.debug) console.log("SocketService::getServers: '" + this.url + "'");

		$.ajax(this.url, {
			timeout: 5000,
			dataType: "jsonp",
			jsonpCallback:"connectCb"
		}).done((data:{servers:string[]; preferred:number; port:number}) =>
		{
			if(data && data.servers && data.servers.length > 0)
			{
				if (this.debug) console.log('SocketService::Servers loaded', data);

				this._servers = data.servers;
				this._port = data.port;

				if(data.preferred && !isNaN(data.preferred) && data.preferred < this._servers.length && data.preferred > 0)
				{
					this._servers.unshift(this._servers.splice(data.preferred, 1)[0]);
				}

				this.forceConnect();
			}
			else
			{
				this.dispatchEvent(new SocketEvent(SocketEvent.NO_SERVERS_AVAILABLE));
				if (this.debug) console.log('SocketService::Unable to load servers');

				this.reconnect();
			}
		}).error(() =>
		{
			this.dispatchEvent(new SocketEvent(SocketEvent.NO_SERVERS_AVAILABLE));
			if (this.debug) console.log('SocketService::Unable to load servers');

			this.reconnect();
		});
	}

	private getProtocols()
	{
		var mobileDetect:MobileDetect = new MobileDetect();

		//fix for native android browser that has websocket support in browser and webview but can't connect in webview
		if(mobileDetect.is('androidos') && !mobileDetect.is('chrome') && !mobileDetect.is('firefox') && !mobileDetect.is('opera'))
		{
			return ['xdr-streaming', 'xhr-streaming', 'iframe-eventsource', 'iframe-htmlfile', 'xdr-polling', 'xhr-polling', 'iframe-xhr-polling', 'jsonp-polling'];
		}

		return window['WebSocket'] ? ['websocket'] : ['xdr-streaming', 'xhr-streaming', 'iframe-eventsource', 'xdr-polling', 'xhr-polling', 'iframe-xhr-polling', 'jsonp-polling', 'iframe-htmlfile'];
	}

	private reconnect():void
	{
		if (this.debug) console.log('SocketService::reconnect');

		clearTimeout(this._reconnectTimeout);

		var delay:number = 0;

		if(this._servers.length == 0)
		{
			if (this.debug) console.log('SocketService::No servers loaded');

			this._servers = [];
			this._currentServerIndex = 0;

			delay = this._getServersTimeout + Math.round(Math.random() * this._maxRandomGetServersDelay);
		}
		else if(this._currentServerIndex == this._servers.length - 1)
		{
			this._servers = [];
			this._currentServerIndex = 0;

			if (this.debug) console.log('SocketService::No servers left');

			delay = this._reconnectDelayTiers[this._reconnectTier] + Math.round(Math.random() * this._maxRandomReconnectDelay);

			this._reconnectTier = Math.min(this._reconnectTier + 1, this._reconnectDelayTiers.length - 1);

			this.dispatchEvent(new SocketEvent(SocketEvent.UNABLE_TO_CONNECT));
		}
		else
		{
			if (this.debug) console.log('SocketService::Try next server');

			this._currentServerIndex++;

			delay = 0;
		}

		if (this.debug) console.log('SocketService::Reconnect( ' + delay + ' )');

		this._reconnectTimeout = setTimeout(() =>
		{
			this.forceConnect();
		}, delay);

		this.dispatchEvent(new SocketEvent(SocketEvent.RECONNECT));
	}

	private addEventListeners(socket:SockJS):void
	{
		this._uniqueCallbackId = new Date().getTime();

		if (this.debug) console.log('SocketService::AddEventListeners( ' + this._uniqueCallbackId + ' )');

		this._handleSocketOpened = <EventListener>this.handleSocketOpened.bind(this, this._uniqueCallbackId);
		this._handleSocketMessage = <EventListener>this.handleSocketMessage.bind(this, this._uniqueCallbackId);
		this._handleSocketClosed = <EventListener>this.handleSocketClosed.bind(this, this._uniqueCallbackId);

		socket.addEventListener('open', this._handleSocketOpened);
		socket.addEventListener('message', this._handleSocketMessage);
		socket.addEventListener('close', this._handleSocketClosed);
	}

	private removeEventListeners(socket:SockJS):void
	{
		socket.removeEventListener('open', this._handleSocketOpened);
		socket.removeEventListener('message', this._handleSocketMessage);
		socket.removeEventListener('close', this._handleSocketClosed);
	}

	private handleSocketOpened(uniqueCallbackId:number):void
	{
		if (uniqueCallbackId != this._uniqueCallbackId)
		{
			if (this.debug) console.log('SocketService::Callback::Opened::Conflict( ' + uniqueCallbackId + ', ' + this._uniqueCallbackId + ' )');

			return;
		}
		if (this.debug)
		{
			console.log('SocketService::Callback::Opened::NoConflict( ' + uniqueCallbackId + ', ' + this._uniqueCallbackId + ' )');
			console.log('SocketService::ConnectionOpened');
		}

		clearTimeout(this._reconnectTimeout);

		// reset the reconnect tier
		this._reconnectTier = 0;
		this._currentServerIndex = 0;
		this._servers = [];

		this.dispatchEvent(new SocketEvent(SocketEvent.OPENED));
	}

	private handleSocketClosed(uniqueCallbackId:number, e:any):void
	{
		if (uniqueCallbackId != this._uniqueCallbackId)
		{
			if (this.debug) console.log('SocketService::Callback::Closed::Conflict( ' + uniqueCallbackId + ', ' + this._uniqueCallbackId + ' )');
			return;
		}
		if (this.debug)
		{
			console.log('SocketService::Callback::Closed::NoConflict( ' + uniqueCallbackId + ', ' + this._uniqueCallbackId + ' )');
			console.warn('SocketService::ConnectionClosed');
		}

		this.reconnect();
		this.dispatchEvent(new SocketEvent(SocketEvent.CLOSED));
	}

	private handleSocketMessage(uniqueCallbackId:number, e:SockJSData):void
	{
		if (uniqueCallbackId != this._uniqueCallbackId)
		{
			if (this.debug) console.warn('SocketService::Callback::Message::Conflict( ' + uniqueCallbackId + ', ' + this._uniqueCallbackId + ' )');
			return;
		}

		if (this.debug)
		{
			console.log('SocketService::HandleSocketMessage', e);
			console.log('SocketService::Callback::Message::NoConflict( ' + uniqueCallbackId + ', ' + this._uniqueCallbackId + ' )');
		}

		var message:ISocketMessage = <ISocketMessage> JSON.parse(e.data);

		if (this.debug) console.log('SocketService::', message.t + ": " + message.a, message.d);

		this.dispatchEvent(new SocketEvent(SocketEvent.MESSAGE, message.a, message.e, message.d, message.n ? new Date(message.n * 1000) : null));
	}
}

interface SockJSData
{
	data:string;
}

interface ISocketMessage
{
	/**
	 * Type
	 */
	t:string;

	/**
	 * Action
	 */
	a?:string;

	/**
	 * Event
	 */
	e?:string;

	/**
	 * Data
	 */
	d?:any;

	/**
	 * unix time
	 */
	n?:number;
}

var REQUEST:string = "request";

export default SocketService;