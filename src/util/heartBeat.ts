
export default class Heartbeat {

    id: string;
    diff: number;
    timerId: any;
    interval: number; //间隔时长
    lastTime: number; //上次时间
    isDeath: boolean;
    service: any;

    constructor(service: any, id: string) {

        this.id = id;
        this.service = service;
        this.diff = 0;
        this.isDeath = true;

        if (!(service.eventLoop instanceof Function)) {

            throw new Error("no find service about eventLoop");
        }
    }

    init(interval: number, active: boolean = true) {

        this.interval = interval;
        this.isDeath = !active;
        this.pacemaker();
        return this;
    }

    pacemaker() {

        let self = this;
        clearTimeout(self.timerId);

        if (!self.isDeath) {

            self.lastTime = Date.now();
            self.timerId = setTimeout(async () => {

                let timeStamp = Date.now();
                self.diff = timeStamp - self.lastTime;
                self.lastTime = timeStamp;

                try {

                    await self.service.eventLoop(self.diff, self.id);
                } catch (e) {

                    console.error("eventLoop error", self.id, e.statck);
                }

                self.pacemaker();

            }, self.interval);
        }
    }

    death() {

        clearTimeout(this.timerId);
        this.isDeath = true;
    }
};