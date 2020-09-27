
import { Filter } from '../../src/common/decorators'
import { Context } from '../../src/common/commonClass';

describe('filter-test', () => {

    let testFilterONE = async (ctx: any, next: Function) => {

        console.log("one");
        next();
        console.log("sssss");
    }

    let testFilterTWO = (ctx: any, next: Function) => {

        console.log("two");
        next();
    }

    it("过滤器单独测试", () => {

        class APP {

            constructor() {

            }

            @Filter([testFilterONE, testFilterTWO])
            sayHello(ctx: Context) {

                console.log(JSON.stringify(ctx));
            }
        }

        let s = new APP();

        let p: Context = { h: "hello" };
        s.sayHello(p);
    });

    it("过滤器并发", () => {

        class APP {

            constructor() {

            }

            @Filter([testFilterONE])
            @Filter([testFilterTWO])
            sayHello(ctx: Context) {

                console.log(JSON.stringify(ctx));
            }
        }

        let s = new APP();

        let p: Context = { h: "hello" };
        s.sayHello(p);
    });
});