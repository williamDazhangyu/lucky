import { Timer } from '../../src/common/decorators'
import HeartBeat from '../../src/util/heartBeat';

describe('heartBeat-test', () => {

    it("心跳是否正常", () => {

        function app() {

        }

        app.prototype.eventLoop = (diff: number, timerId: string) => {

            console.log('时间运行间隔', diff, timerId);
        }

        let heartBeatObj: HeartBeat = new HeartBeat(new app(), "heartBeatTestId");
        heartBeatObj.init(1000);

        setTimeout(() => {

            heartBeatObj.death();
        }, 10000);
    });


    it("注入定时器测试", () => {

        @Timer("heartBeatTestId2", 1000)
        class app {

            str: string;

            constructor(word: string) {

                this.str = word;
            }

            eventLoop(diff: number, timerId: string) {

                console.log('时间运行间隔', diff, timerId);
            }
        }

        let s = new app('hello');

        //移除定时器
        //console.log(Reflect.deleteProperty(s, 'heartBeatTestId'));
    });
});