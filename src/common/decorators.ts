
//命名为一个组件
export function component(target: Function) {

    target.prototype.component = true;
    target.prototype.isComponent = () =>{

        return !!target.prototype.component;
    }
};

//是否为一个控制层
export function controller(target: Function) {

    target.prototype.controller = true;
    target.prototype.isController = () =>{

        return !!target.prototype.controller;
    }
};

//是否为一个服务
export function service(target: Function) {

    target.prototype.service = true;
    target.prototype.isService = () =>{

        return !!target.prototype.service;
    }
};

//是否可被客户端调用
// export function 

//是否支持rpc
// export 


