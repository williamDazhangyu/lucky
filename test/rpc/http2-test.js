"use strict";
exports.__esModule = true;
var http2 = require("http2");
var fs = require("fs");
var path = require("path");
var realPath = __dirname;
var server = http2.createSecureServer({
    key: fs.readFileSync(path.join(realPath, '密钥.pem')),
    cert: fs.readFileSync(path.join(realPath, '证书.pem'))
});
server.on('error', function (err) { return console.error(err); });
server.on('stream', function (stream, headers) {
    // 流是一个双工流。
    stream.respond({
        'content-type': 'application/json; charset=utf-8',
        ':status': 200
    });
    stream.end("aaaaa");
});
// server.on('request', (req, res)=>{
//       console.log(req, res);
// });
server.listen(8443);
