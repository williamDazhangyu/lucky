
import {IOC, Controller, Component} from '../../src/common/decorators';
import { Application } from '../../src/common/commonClass';

describe('ioc-test', () => {

    // it("注入类", () => {

    //     class APP {

    //         constructor() {

    //         }
    //     }

    //     let app = new APP();

    //     @IOC(APP)
    //     class Test1 {

    //         constructor() {

    //         }

    //         hello() {

    //             return 'hello';
    //         }

    //         world() {

    //             return "world";
    //         }
    //     }

    //     console.log(app["test1.hello"]());
    // });

      it("反转注入类", ()=>{

          let app: Application = {

            components: {}
          };

          @Controller()
          class cc {

            app: Application;

            constructor(app: Application) {

               this.app = app;
            }

            sayHello(){

                console.log("hello");
            }
          }

          let testC = new cc(app);

          // app.components["cc"]['sayHello']();

          testC.toString();
      });
});