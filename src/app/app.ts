

export default class LuckyAPP {

    components: {}

    constructor() {

        this.components = {}
    }

    get(name: string) {

        return this.components[name];
    }
}