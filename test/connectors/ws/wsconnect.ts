
/***
 * @version 1.0 测试连接
 * 
 */
import { IOSocketFactory } from '../../../src/connectors/ws/ioSocketManager';
import { IOSocketClient } from '../../../src/connectors/ws/ioSocketClient';
import { RPCResponse } from '../../../src/common/commonClass';

describe("测试socket.io连接", () => {

    it("客户端连接", () => {

        //启动服务端
        const serverS = IOSocketFactory(3000, async (session: any, body: object) => {

            return body;
        });
        serverS.start();

        //客户端进行连接
        const socketC = new IOSocketClient("ws://localhost:3000", async (session: any, body: any)=>{

              return body;
        });

        const socketC2 = new IOSocketClient("ws://localhost:3000", async (session: any, body: any)=>{

            return body;
      });

        //延迟发送消息确保已连接
        setTimeout(async () => {

            let timeStamp = Date.now();
            let result:RPCResponse = await socketC.sendMsg(null, 'hello');
            console.log("客户端收到消息：%s 耗时：", result.data, Date.now() - timeStamp);

            timeStamp = Date.now();
            let serverResult: RPCResponse = await serverS.sendMsg("myServer msg", true, socketC.socketID);
            console.log("服务端收到消息：%s 耗时：", serverResult.data, Date.now() - timeStamp);

            timeStamp = Date.now();
            let result2:RPCResponse = await socketC2.sendMsg(null, 'hello2');
            console.log("客户端收到消息：%s 耗时：", result2.data, Date.now() - timeStamp);

        }, 100);

    });
});