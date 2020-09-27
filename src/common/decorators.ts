import HeartBeat from "../util/heartBeat";
import { Component_Type } from "./commonClass";

type filterList = Array<Function>;

//命名为一个组件
export function Component(type = Component_Type.COMPONENT, name?: string) {

    return function (target: any) {

        return new Proxy(target, {

            construct: (target: any, args: any) => {

                let service = new target(...args);
                service[`is${type}`] = true;

                const app = service.app;
                if (!!app) {

                    if (!app.components) {

                        app.components = {};
                    }

                    app.components[name ? name : target.name] = service;
                }

                return service;
            }
        })
    }
};

//是否为一个控制层
export function Controller(name?: string) {

    return Component(Component_Type.CONTROLLER, name);
};

//添加方法注入
export function IOC(application: Function) {

    return function (target: Function) {

        let rootName = target.name.toLowerCase();

        Object.keys(target.prototype).forEach((t) => {

            let tName = t.toLowerCase();
            //进行属性名的再构造
            application.prototype[`${rootName}.${tName}`] = target.prototype[t];
        });
    };
};

//添加定时器
export function Timer(id: string, interval: number) {

    return function (target: any) {

        return new Proxy(target, {

            construct: (target: any, args: any) => {

                let service = new target(...args);
                let timer = new HeartBeat(service, id).init(interval);
                service[id] = timer;

                let serviceProxy = new Proxy(service, {

                    deleteProperty: (target, propKey) => {

                        if (propKey === id) {

                            Reflect.apply(timer.death, timer, [id]);
                        }

                        return Reflect.deleteProperty(target, propKey);
                    }
                });

                return serviceProxy;
            },
        });
    };
}

//过滤器 用于校验单个方法是否条件
export function Filter(middleware: filterList = []) {

    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

        const targetFn = descriptor.value;
        middleware.push(targetFn);

        descriptor.value = function (params: any = {}, next: Function) {

            //采用递归调用函数
            let index = -1;
            return dispatch(0);

            function dispatch(i: number) {

                if (i < index) {

                    return Promise.reject(new Error('next() called multiple times'));
                }

                index = i;
                let fn = middleware[i];

                if (i === middleware.length) {

                    fn = next;
                }

                if (!fn) {

                    return Promise.resolve();
                }

                try {

                    return Promise.resolve(fn(params, function next() {

                        return dispatch(i + 1);
                    }));

                } catch (err) {

                    return Promise.reject(err);
                }
            }
        }
    }
}

