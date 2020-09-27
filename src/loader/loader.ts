
import * as fs from 'fs';
import { sep } from 'path';

export type LoaderServices = {

    namespace: string,
    method: Function
};

export class Loader {

    /***
     * @version 1.0 重新加载模块
     * 
     */
    static requireUncached(module: string) {

        let mpath = require.resolve(module);

        Reflect.deleteProperty(require.cache, mpath);
        return require(module);
    }

    /***
     * @version 1.0 加载文件
     * 
     */
    static loadFile(filePath: string, context: any): LoaderServices {

        if (!fs.existsSync(filePath)) {

            return null;
        }

        if (!fs.statSync(filePath).isFile()
            || (!filePath.endsWith(".js") && !filePath.endsWith(".ts"))) {

            console.error("不是一个js/ts文件");
            return null;
        }

        let m = this.requireUncached(filePath);

        if (!m) {
            return null;
        }

        let instance = m;
        let fNames = filePath.split(sep);
        let fName = fNames[fNames.length - 1];
        fName = fName.substring(0, fName.length - ".js".length);

        if (m instanceof Function) {

            //这一步很关键 生成主要的方法 进行调用
            instance = new m(context);
            if (m.name) {

                fName = m.name;
            }
        }

        let s: LoaderServices = {

            namespace: fName,
            method: instance
        };

        return s;
    };


    /***
     * @version 1.0 加载文件夹 并不会递归子目录
     * 
     */
    static load(mpath: string, context: any): {} {

        if (!mpath) {

            console.error("mpath 为字符串");
            return null;
        }

        //获取路径
        try {

            mpath = fs.realpathSync(mpath);
        } catch (err) {

            console.error("加载文件失败");
            return null;
        }

        if (!fs.statSync(mpath).isDirectory()) {

            return null;
        }

        let files = fs.readdirSync(mpath);
        if (files.length === 0) {

            return null;
        }

        let instances = {};
        files.forEach((filePath) => {

            let completePath = mpath + sep + filePath;

            let lresult = this.loadFile(completePath, context);

            if (!!lresult) {

                instances[lresult.namespace] = lresult.method;
            }
        });

        return instances;
    };

    static watchServices(mpath: string, context: any) {

        if (typeof context.emit != 'function') {

            return false;
        }

        //添加热更方法 但是对于docker等环境的部署 可能监测不到
        fs.watch(mpath, function (event, filename) {

            if (event === 'change') {

                console.log("热更加载----", filename);
                let instances = Loader.load(mpath, context);
                context.emit("reload", instances);
            }
        });

        return true;
    }
}