
import { Socket } from '../baseConnector';
import { EventEmitter } from 'events';
import * as sio from 'socket.io';
import { Message, SocketEventName } from "../../common/commonClass";

export class IOSocketServer extends EventEmitter implements Socket {

    id: string;
    state: boolean;
    remoteAddress: string;
    socketInfo: sio.Socket;
    socketManager: any;

    constructor(id: string, socketInfo: sio.Socket, socketManager: any) {

        super();
        this.id = id;
        this.state = false;
        this.remoteAddress = socketInfo.handshake.address;
        this.socketInfo = socketInfo;
        this.socketManager = socketManager;
        this.connect();
    }

    connect(): void {

        this.state = true;

        let socketInfo = this.socketInfo;
        let self = this;

        socketInfo.on(SocketEventName.Login, (msg: string)=>{

            if (!self.state) {

                return false;
            }

            let socketManager = self.socketManager;
            socketManager.emit(SocketEventName.Login, self.id, msg);
        });

        socketInfo.on(SocketEventName.PushMsg, (msg: string) => {

            //接收到了消息
            if (!self.state) {

                return false;
            }

            let socketManager = self.socketManager;
            socketManager.emit(SocketEventName.PushMsg, self.id, msg);
        });

        socketInfo.on(SocketEventName.NotifyMsg, (msg: string) => {

            let socketManager = self.socketManager;
            socketManager.emit(SocketEventName.NotifyMsg, self.id, msg);
        });

        socketInfo.on(SocketEventName.Disconnect, (reason: string) => {

            self.disconnect(reason);
        });

        socketInfo.emit(SocketEventName.Connection, self.id);
    }

    disconnect(reason: any): void {

        this.state = false;
        let socketManager = this.socketManager;

        socketManager.emit(SocketEventName.Disconnect, this.id, reason);
    }

    pushMsg(msg: Message) {

        this.socketInfo.emit(SocketEventName.PushMsg, msg);
        return true;
    }

    NotifyMsg(msg: string): boolean {

        if (!this.state) {

            return false;
        }

        this.socketInfo.emit(SocketEventName.NotifyMsg, msg);
        return true;
    }
}