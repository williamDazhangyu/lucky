"use strict";
exports.__esModule = true;
var http2 = require("http2");
var fs = require("fs");
var path = require("path");
var client = http2.connect('https://localhost:8443', {
    ca: fs.readFileSync(path.join(__dirname, '证书.pem'))
});
client.on('error', function (err) { return console.error(err); });
client.on('close', function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.log('关闭喽');
});
function sendMsg() {
    var req = client.request({ ':path': '/' });
    req.on('response', function (headers, flags) {
        for (var name_1 in headers) {
            console.log(name_1 + ": " + headers[name_1]);
        }
    });
    req.write("{'hello': 'world'}");
    req.setEncoding('utf8');
    var data = '';
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        console.log("The server says: " + data);
        client.close();
    });
    req.end('Jane');
}
sendMsg();
// sendMsg();
// setTimeout(()=>{
// }, 1000);
