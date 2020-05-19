//代表是一个组件

import { component } from '../../../src/common/decorators';

@component
class Handler {

    hello(): string {

        return "hello"
    }
}

export = Handler;
