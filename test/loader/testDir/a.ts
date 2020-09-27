//代表是一个组件

import { component } from '../../../src/common/decorators';

@component
class Handler {

    testHello: string;

    constructor() {

        this.testHello = "world";
    }

    hello(): string {

        return this.testHello;
    }
}

export = Handler;
