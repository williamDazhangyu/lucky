
import { IOSocketFactory, IOSocketManager } from "../connectors/ws/ioSocketManager";
import { RPCRequest, SocketEventName } from "../common/commonClass";
import cryptoUtil from "../util/cryptoUtil";
import { connectingData, producerData, rpcServerOpts, loginData, consumerData } from "./rpcModel";

export class RPCServer {

    socketServer: IOSocketManager;
    opts: rpcServerOpts;
    connectingList: Map<string, connectingData>; //socketId 编号
    producerList: Map<string, Array<producerData>>; //服务名称 
    consumerList: Map<string, consumerData>; //服务名称

    //初始化连接
    constructor(opts: rpcServerOpts) {

        this.socketServer = IOSocketFactory(opts.port, this.notifyEmitter);
        this.opts = opts;
        this.producerList = new Map<string, Array<producerData>>();
    }

    private async notifyEmitter(...args: any[]) {

        if (args.length < 2) {

            return false;
        }

        let eventName = args[0];
        let socketId = args[1];

        switch (eventName) {

            case SocketEventName.Login: {

                let msg = JSON.parse(args[2]);
                let token: string = msg.token;
                let iv: string = msg.iv;
                let env: string = this.opts.env;
                let rpcUserConfig = this.opts.rpcUserConfig[env];

                if (!!token && iv && rpcUserConfig) {

                    //进行解密
                    let params = cryptoUtil.aesDecode(rpcUserConfig.serverKey, iv, token);
                    let data: loginData = JSON.parse(params);
                    if (!!data.password &&
                        data.password === rpcUserConfig[data.roleName]) {

                        if ((Date.now() - data.loginTime) < 60 * 1000) {

                            this.registerService(data, socketId);
                            break;
                        }
                    }
                }

                this.notifyEmitter(SocketEventName.Disconnect, socketId);
                break;
            }

            case SocketEventName.Connection: {
                break;
            }
            case SocketEventName.PushMsg: {

                //进行调用


                break;
            }
            case SocketEventName.Disconnect: {


                break;
            }
            default: {

                break;
            }
        }
    }

    start() {

        this.socketServer.start();
        //向其他集群进行消息发送
    }

    //注册服务
    async registerService(data: loginData, socketId: string) {

        //进行注册
        let cData: connectingData = {

            client: !!data.opts.isClient,
            server: !!data.opts.isServer
        };

        this.connectingList.set(socketId, cData);
        if (cData.client) {

            let clientData: consumerData = {

                loginTime: Date.now(),
                role: data.roleName,
                socketId: socketId
            };
            this.consumerList.set(socketId, clientData);
        }
        if (cData.server && data.serviceName) {

            let serverData: producerData = {

                serviceName: data.serviceName,
                serviceNO: 0,
                registerServer: this.opts.serverID, //注册服务地址
                startTime: Date.now(), //在线时间
                socketId: socketId
            }

            let currServiceList = this.producerList.get(data.serviceName);

            //todo
            //同步通知给其他集群服务
            serverData.serviceNO = currServiceList.length;
            currServiceList.push(serverData);
            this.producerList.set(data.serviceName, currServiceList);
        }
    }

    //被通知添加服务
    

    //移除服务


    //接收消息来了的请求
    async handlerMsg(params: RPCRequest) {

        let tmpServiceName = params.serviceName;

        if (!tmpServiceName) {

            //立即进行返回
            return params.body;
        }


        // let socketId = ;

        // //进行发送
        // let result = await this.socketServer.sendMsg(params.body, params.notify, socketId);

        // if (result.error) {

        // }

        // return result.data;
    }

    //消费服务连接

    //同步其他rpc服务



}