
import * as fs from 'fs';
import * as path from 'path';
import { moduleService } from '../common/commonClass';

/***
 * @version 1.0 使用import的动态加载模式进行加载
 * 
 */
export default class loaderES {

    static async loadDir(dirPath: string, ...args: any[]) {

        let sList: Map<string, moduleService> = new Map();

        if (!dirPath) {

            console.error("dirPath is empty");
            return null;
        }

        //获取路径
        try {

            dirPath = fs.realpathSync(dirPath);
        } catch (err) {

            console.error("dir loader is failed");
            return null;
        }

        if (!fs.statSync(dirPath).isDirectory()) {

            console.error("dir is empty");
            return null;
        }

        let files = fs.readdirSync(dirPath);
        if (files.length === 0) {

            return null;
        }

        for (let filePath of files) {

            let realPath = path.join(dirPath, filePath);
            let childList = await this.loadFile(realPath, ...args);

            if (!!childList) {

                for (let key of childList.keys()) {

                    sList.set(key, childList.get(key));
                }
            }
        }

        return sList;
    }

    static async loadFile(filePath: string, ...args: any[]) {

        if (!fs.statSync(filePath).isFile()
            || (!filePath.endsWith(".js") && !filePath.endsWith(".ts"))) {

            throw (new Error("this is not ts or js file!"));
        }

        let moduleClass = await import(filePath);
        let classNameList = Object.keys(moduleClass);
        let sList: Map<string, moduleService> = new Map();

        classNameList.forEach((name) => {

            const tmpModuleClass = moduleClass[name];
            //并进行实例化操作
            const fn = new tmpModuleClass(...args);
            sList.set(tmpModuleClass.name, fn);
        });

        return sList;
    }
}