
import { Loader } from '../../src/loader/loader';
import * as should from 'should';
import { EventEmitter } from 'events';

describe('loader-test', () => {

    it("加载文件夹", () => {

        const app = {};
        let dirPath = "/Users/zjx/Documents/codes/lucky/test/loader/testDir";
        const services = Loader.load(dirPath, app);
        should.notEqual(services, null);
    });

    it("加载文件", () => {

        const app = {};
        let dirPath = "/Users/zjx/Documents/codes/lucky/test/loader/testDir/b.js";
        const services = Loader.loadFile(dirPath, app);
        should.notEqual(services, null);
    });

    it("加载空目录", () => {

        const app = {};
        let dirPath = "/Users/zjx/Documents/codes/lucky/test/loader/empty";
        const services = Loader.load(dirPath, app);
        should.equal(services, null);
    });

    it("热更测试", () => {

        class App extends EventEmitter {

            services: {};

            constructor() {

                super();
                this.services = {};
            }
        };
        let app = new App();

        app.on("reload", (instances) => {

            app.services = instances;
        });

        let dirPath = "/Users/zjx/Documents/codes/lucky/test/loader/testDir";
        let services = Loader.load(dirPath, app);
        if (!!services) {

            //释放资源
            app.services = services;
        }

        //加载是否需要更新
        Loader.watchServices(dirPath, app);
        console.log("热更前:", app.services["Handler"]["hello"]());
        setTimeout(() => {

            console.log("热更后:", Reflect.apply(app.services["Handler"]["hello"], app.services["Handler"], []));
        }, 5000);
    });
});