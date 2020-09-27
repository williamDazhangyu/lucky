import http = require('http');
import { BaseConnector } from '../baseConnector';
import * as sio from 'socket.io';
import { Message, SocketEventName, RPCRequest, RPCResponse } from "../../common/commonClass";
import { EventEmitter } from 'events';
import { IOSocketServer } from './ioSocketServer';
const uuid = require('uuid');

type AllowRequestFunction = (req: http.IncomingMessage, fn: (err: string | null | undefined, success: boolean) => void) => void;
type Transport = "polling" | "websocket";
type resultMapValue = {
    callBack: Function,
    socketId: string
};

export interface ServerOptions {

    pingTimeout?: number;
    pingInterval?: number;
    upgradeTimeout?: number;
    maxHttpBufferSize?: number;
    allowRequest?: AllowRequestFunction;
    transports?: Transport[];
    allowUpgrades?: boolean;
    perMessageDeflate?: any;
    httpCompression?: any;
    cookie?: string | boolean;
    cookiePath?: string | boolean;
    cookieHttpOnly?: boolean;
    wsEngine?: "ws" | "uws";
    initialPacket?: Message;
}

export class IOSocketManager extends EventEmitter implements BaseConnector {

    host?: string;
    state: boolean;
    port: number;
    opts: ServerOptions;
    sockets: Map<string, IOSocketServer>;
    server: any;
    notifyEmitter: Function;

    requestMap: Map<number, resultMapValue>;
    requestNO: number;
    maxRespNum: number;

    constructor(port: number, opts: ServerOptions, notifyEmitter: Function) {

        super();
        this.state = false;
        this.port = port;
        this.opts = opts;
        this.sockets = new Map<string, IOSocketServer>();
        this.notifyEmitter = notifyEmitter;

        this.requestNO = 1;
        this.maxRespNum = 100000000;
        this.requestMap = new Map<number, resultMapValue>();
    }

    private getRequestNO(): number {

        if (this.requestNO > this.maxRespNum) {

            this.requestNO = 1;
        } else {

            ++this.requestNO;
        }

        return this.requestNO;
    }

    /***
     * @version 1.0 实现
     * 
     */
    start(): void {

        if (this.state) {

            console.error(new Error('端口已被初始化'));
            return;
        }

        this.opts.pingInterval
        const io = sio(this.port, this.opts);

        let self = this;

        io.on('error', (err: Error) => {

            console.error("ws:%s", err.stack);

        });

        io.on(SocketEventName.Connection, (socket: sio.Socket) => {

            if (!self.state) {

                return;
            }

            let socketId = uuid.v4().replace(/-/g, '');
            const tmpSocket = new IOSocketServer(socketId, socket, self);
            self.sockets.set(socketId, tmpSocket);
            self.notifyEmitter(SocketEventName.Connection, socketId);
        });

        self.on(SocketEventName.Login, (socketId: string, msg: string)=>{

            self.notifyEmitter(SocketEventName.Login, socketId, msg);
        });

        //处理消息
        self.on(SocketEventName.PushMsg, async (socketId: string, msg: string) => {

            let respMsg: RPCResponse;
            let tmpParams: RPCRequest = JSON.parse(msg);

            try {

                let data = await this.notifyEmitter(SocketEventName.PushMsg, socketId, tmpParams);

                respMsg = {

                    requestID: tmpParams.requestID,
                    data: data,
                    error: false
                };
            } catch (e) {

                console.log("调用失败：" + e);

                respMsg = {

                    requestID: tmpParams.requestID,
                    data: null,
                    error: true
                }
            } finally {

                if (tmpParams.notify) {

                    this.broadcast(JSON.stringify(respMsg), [socketId]);
                }
            }
        });

        self.on(SocketEventName.NotifyMsg, (socketId: string, msg: string) => {

            let result: RPCResponse = JSON.parse(msg);
            let id = result.requestID;
            let tmpResult = this.requestMap.get(id);

            if (!!tmpResult && tmpResult.socketId === socketId) {

                tmpResult.callBack(result);
                this.requestMap.delete(id);
            }
        });

        self.on(SocketEventName.Disconnect, (socketId, msg) => {

            console.log("disconnect%s:%s", socketId, msg);
            self.sockets.delete(socketId);
            self.notifyEmitter(SocketEventName.Disconnect, socketId);
        });

        this.server = io;
        this.state = true;
    }

    stop() {

        for (let socketItem of this.sockets) {

            socketItem[1].disconnect('stop server');
        }

        this.sockets = new Map<string, IOSocketServer>();
        this.state = false;
    }

    getState(): boolean {

        return this.state;
    }

    broadcast(msg: string, socketIds?: string[]): void {

        if (!socketIds) {

            for (let socketItem of this.sockets) {

                socketItem[1].NotifyMsg(msg);
            }
        } else {

            socketIds.forEach((socketId: string) => {

                let socketItem: IOSocketServer = this.sockets.get(socketId);
                if (!!socketItem) {

                    socketItem.NotifyMsg(msg);
                }
            });
        }
    }

    disconnect(socketId: string): void {

        let socketItem: IOSocketServer = this.sockets.get(socketId);
        if (!!socketItem) {

            socketItem.disconnect(SocketEventName.ServerDisConnect);
            this.notifyEmitter(SocketEventName.ServerDisConnect, socketId)
        }
    }

    async sendMsg(body: any, notify: boolean = true, socketId: string) {

        const self = this;
        let tmpRequestNO = self.getRequestNO();

        let msg: RPCRequest = {

            requestID: tmpRequestNO,
            body: body,
            notify: notify
        }

        let result: RPCResponse = await new Promise((resolve, reject) => {

            if (!self.state) {

                resolve({

                    requestID: tmpRequestNO,
                    data: null,
                    error: true, //仅代表是否请求成功
                    reason: 'connecter disconnect'
                });
            } else {

                let socketInfo = self.sockets.get(socketId);
                if (!socketInfo || !socketInfo.state) {

                    resolve({

                        requestID: tmpRequestNO,
                        data: null,
                        error: true, //仅代表是否请求成功
                        reason: 'connecter missing'
                    });
                } else {

                    socketInfo.pushMsg(JSON.stringify(msg));
                    if (!notify) {

                        resolve({

                            requestID: tmpRequestNO,
                            data: null,
                            error: false, //仅代表是否请求成功
                        });
                    } else {

                        let tmpValue: resultMapValue = {

                            callBack: (args: RPCResponse) => {

                                resolve(args);
                            },
                            socketId: socketId
                        }
                        self.requestMap.set(tmpRequestNO, tmpValue);
                    }
                }
            }
        });

        return result;
    };
};

export function IOSocketFactory(port: number, notifyEmitter: any, opts?: ServerOptions) {

    return new IOSocketManager(port, opts || {}, notifyEmitter);
}
