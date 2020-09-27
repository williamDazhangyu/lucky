
import luckAPP from '../../../src/app/app';
import { Controller } from '../../../src/common/decorators';

@Controller()
export class APP2 {

    app: luckAPP;
    constructor(app: luckAPP) {

        this.app = app;
    }

    sayHello() {

        return 'world';
    }
}

@Controller()
export class APP3 {

    app: luckAPP;
    constructor(app: luckAPP) {

        this.app = app;
    }

    sayHello() {

        return 'world';
    }
}