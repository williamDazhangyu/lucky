
import {Loader} from '../../src/loader/loader';
import * as should from 'should';

describe('loader-test',  () => {

    it("加载文件夹", ()=>{

        const app = {};
        let dirPath = "/Users/zjx/Documents/codes/lucky/test/loader/testDir";
        const services = Loader.load(dirPath, app);
        should.notEqual(services, false);
    });

    it("加载文件", ()=>{

        const app = {};
        let dirPath = "/Users/zjx/Documents/codes/lucky/test/loader/testDir/b.js";
        const services = Loader.loadFile(dirPath, app);
        should.notEqual(services, false);
    });

    it("加载空目录", ()=>{

        const app = {};
        let dirPath = "/Users/zjx/Documents/codes/lucky/test/loader/empty";
        const services = Loader.load(dirPath, app);
        should.equal(services, false);
    });

    it("热更测试", ()=>{

        const app:any = {};
        let dirPath = "/Users/zjx/Documents/codes/lucky/test/loader/testDir";
        Loader.load(dirPath, app, true);
        console.log("热更前:", app.instancesMap.get("Handler").hello());
        setTimeout(()=>{

            console.log("热更后:", app.instancesMap.get("Handler").hello());
        }, 5000);
    }, );
});