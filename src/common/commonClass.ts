import { type } from "os";

//自定义的消息
export type AcceptorPkg = {

    source: string,  //调用的服务
    remote: string,  //远程的服务名称
    id: string & number,
    seq: number,
    msg: string,
};

export type AcceptorOpts = {

    whiteIPlist?: string[],
    pingInterval?: number,
    pingTimeout?: number,
    authFilter?: Function,
    ipVery?: boolean,//是否校验ip
    tokenVery?: boolean,//是否校验token
}

export type veryOpts = {

    ip?: string,
    query?: object
};

export type clientEntry = {

    socketId: string,
    socket: any,
    service: string, //抽象的方法名 如角色服务等
    ip: string, //ip地址连接为多少
    port: number, //具体的端口号
    serviceName: string,//具体的服务名称
    online: boolean //服务名称
};

export type Message = string;

export type socketMsgCb = () => {}

export function getAddressIP(remoteAddress: string) {

    let ip = '0.0.0.0';
    let isV4 = false;

    let ipStringArray = remoteAddress.split(':');

    if (Array.isArray(ipStringArray)) {

        let length = ipStringArray.length;
        if (length === 4) {

            let number = ipStringArray[length - 1];
            let regStr = "(?=(\\b|\\D))(((\\d{1,2})|(1\\d{1,2})|(2[0-4]\\d)|(25[0-5]))\\.){3}((\\d{1,2})|(1\\d{1,2})|(2[0-4]\\d)|(25[0-5]))(?=(\\b|\\D))";
            let reg = new RegExp(regStr);
            if (reg.test(number)) {

                ip = number;
                isV4 = true;
            }
        }
    }
    if (!isV4) {

        console.error("getPlayerIp..........", remoteAddress);
    }

    return ip;
};

export enum SocketEventName {

    PushMsg = "pushMsg",
    NotifyMsg = "notifyMsg",
    Disconnect = "disconnect",
    Login = "login",
    ServerDisConnect = "serverDisConnect",
    Connection = "connection"
};

export type RPCRequest = {

    requestID: number,  //请求唯一识别码
    session?: any,      //会话请求
    body?: object,      //请求数据
    notify: boolean,    //是否需要返回通知
    serviceName?: string  //服务名称
};

export type RPCResponse = {

    requestID: number,
    data: object,
    error: boolean, //仅代表是否请求成功
    reason?: string
};

export type Application = {

    components: {}
};

export type Context = {};

export enum Component_Type {

    COMPONENT = 'Component',
    CONTROLLER = 'Controller',
};

export type moduleService = {

    nameSpace: string,
    method: Function
}