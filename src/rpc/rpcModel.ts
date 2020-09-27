
export type rpcServerOpts = {

    serverID: string,
    host: string,
    port: number,
    env: string,
    rpcUserConfig: any
}

export type loginData = {

    roleName: string,
    password: string,
    serviceName?: string,
    loginTime: number,
    randomStr: string,
    opts: {
        isServer: boolean, //是否为服务端
        isClient: boolean,
        instanceId?: string
    }
}

export type producerData = {

    serviceName: string,
    serviceNO: number,
    registerServer: string //注册服务地址
    startTime: number, //在线时间
    socketId: string
};

export type consumerData = {

    loginTime: number,
    role: string, //角色
    socketId: string
};

export type connectingData = {

    client: boolean, //是否为客户端
    server: boolean  //是否为服务端
};