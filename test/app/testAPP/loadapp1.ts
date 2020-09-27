
import luckAPP from '../../../src/app/app';
import { Controller } from '../../../src/common/decorators';

@Controller()
export default class APP1 {

    app: luckAPP;
    constructor(app: luckAPP) {

        this.app = app;
    }

    sayHello() {

        return 'hello';
    }
} 