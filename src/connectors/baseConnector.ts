
import { Message } from '../common/commonClass';

export interface Socket {

    id: string;
    state: boolean;
    remoteAddress: string;
    socketInfo: any;
    socketManager: any;

    connect(): void;
    disconnect(reason: any): void;

    //用于发送消息
    pushMsg(msg: Message): boolean;

    //用于通知消息
    NotifyMsg(msg: Message): boolean;
}


export interface BaseConnector {

    host?: string;
    state: boolean;
    port: number;
    sockets: Map<string, Socket>;
    notifyEmitter: Function; //用于接收通知的方法

    start(): void;
    stop(): void;

    getState(): boolean;
    broadcast(msg: any, socketIds?: Array<string>): void;
    disconnect(socketIds: string): void;
}