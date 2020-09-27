
import luckAPP from '../../src/app/app';
import APP1 from './testAPP/loadapp1';
import * as path from 'path';
import loaderES from '../../src/loader/loaderES';


describe('app-test', () => {

    it("app热启动", () => {

        const app = new luckAPP();
        let l1 = new APP1(app);

        console.log(app.get("APP1")["sayHello"]());
        setTimeout(() => {

            APP1.prototype.sayHello = function () {

                return "world";
            }
            console.log("动态加载的值", app.get("APP1")["sayHello"]());
        }, 1000);
    });

    it("app动态加载", () => {

        const app = new luckAPP();
        let baseDir = path.join(__dirname, path.sep, 'testAPP');

        loaderES.loadDir(baseDir, app).then((objList) => {

            console.log("动态加载的值", app.get("APP3")["sayHello"]());
        }).catch((e) => {

            console.error(e.message);
        });
    });
});
