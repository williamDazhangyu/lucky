
import { IOSocketClient } from "../connectors/ws/ioSocketClient";


/***
 * @version 1.0 rpc客户端服务
 * 
 */
export class RPCClient {

    socketClient: IOSocketClient;

    constructor(host: string) {

        this.socketClient = new IOSocketClient(host, (session: any, body: any) => {


        });
        this.socketClient.connect();
    }

    async dispatch(session: object, body: any, notify: boolean = true) {

        return await this.socketClient.sendMsg(session, body, notify);
    }
}