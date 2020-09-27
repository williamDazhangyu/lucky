const RE_SERVICE = /(?<server>\S+?)\.+(?<service>\S+?)\.+(?<method>\S+)/;

const matchobj = RE_SERVICE.exec("aa1...bb2...cc3.dd4.ee6");
if (!!matchobj) {

    let { server, service, method } = matchobj.groups;
    console.log(server, service, method);
}