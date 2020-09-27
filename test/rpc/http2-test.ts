
import * as http2 from 'http2';
import * as fs from 'fs';
import * as path from 'path';
import { IncomingHttpHeaders } from 'http2';

let realPath:string = __dirname;
const server = http2.createSecureServer({
    key: fs.readFileSync(path.join(realPath, '密钥.pem')),
    cert: fs.readFileSync(path.join(realPath, '证书.pem'))
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers: IncomingHttpHeaders) => {

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