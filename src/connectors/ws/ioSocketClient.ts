
import { EventEmitter } from 'events';
import * as client from 'socket.io-client';
import { RPCRequest, RPCResponse, SocketEventName } from "../../common/commonClass";

export class IOSocketClient extends EventEmitter {

    host: string;
    socketIO: any;
    state: boolean;
    reponseClient: any;

    requestMap: Map<number, Function>;
    requestNO: number;
    maxRespNum: number;
    socketID: string;
    notifyEmitter: Function;

    constructor(host: string, notifyEmitter: Function, delayTime = 0) {

        super();

        this.host = host;
        this.state = false;
        this.requestNO = 1;
        this.maxRespNum = 100000000;
        this.requestMap = new Map<number, Function>();
        this.lazyConnect(delayTime);
        this.notifyEmitter = notifyEmitter;
    }

    private getRequestNO(): number {

        if (this.requestNO > this.maxRespNum) {

            this.requestNO = 1;
        } else {

            ++this.requestNO;
        }

        return this.requestNO;
    }

    connect() {

        let self = this;

        const socketIO = client.connect(self.host, {

            forceNew: true,
            transports: ['websocket'],
        });

        socketIO.on(SocketEventName.Connection, (socketId: string) => {

            self.state = true;
            self.socketID = socketId;

            console.log("socketId-----", socketId);
        });

        //处理消息
        socketIO.on(SocketEventName.PushMsg, async (msg: string) => {

            let respMsg: RPCResponse;
            let tmpParams: RPCRequest = JSON.parse(msg);

            try {

                let data = await this.notifyEmitter(tmpParams.session, tmpParams.body);

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

                    socketIO.emit(SocketEventName.NotifyMsg, JSON.stringify(respMsg));
                }
            }
        });

        socketIO.on('close', () => {

            self.state = false;
        });

        socketIO.on('error', (err: any) => {

        });

        socketIO.on(SocketEventName.Disconnect, (reason: string) => {

            console.log(reason);
            self.state = false;
        });

        //监听消息 异步处理
        socketIO.on(SocketEventName.NotifyMsg, (msg: string) => {

            let result: RPCResponse = JSON.parse(msg);
            let id = result.requestID;
            let cb = this.requestMap.get(id);

            if (!!cb) {

                cb(result);
                this.requestMap.delete(id);
            }
        });

        self.socketIO = socketIO;
    };

    lazyConnect(delayTime: number): void {

        const self = this;

        if (!self.state) {

            setTimeout(() => {

                self.connect();

            }, delayTime);
        }
    }

    async sendMsg(session: object, body: any, notify: boolean = true) {

        const self = this;
        let tmpRequestNO = self.getRequestNO();

        let msg: RPCRequest = {

            requestID: tmpRequestNO,
            session: session,
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

                self.socketIO.emit(SocketEventName.PushMsg, JSON.stringify(msg));

                if (!notify) {

                    resolve({

                        requestID: tmpRequestNO,
                        data: null,
                        error: false, //仅代表是否请求成功
                    });
                } else {

                    self.requestMap.set(tmpRequestNO, (args: RPCResponse) => {

                        resolve(args);
                    });
                }
            }
        });

        return result;
    };
}