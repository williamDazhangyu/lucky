import * as http2 from 'http2';
import * as fs from 'fs';
import * as path from 'path';

const client = http2.connect('https://localhost:8443', {
    ca: fs.readFileSync(path.join(__dirname, '证书.pem'))
});
client.on('error', (err) => console.error(err));

client.on('close', (...args) => {

    console.log('关闭喽');
});

function sendMsg() {

    const req = client.request({ ':path': '/' });
    req.write("hello");
    req.on('response', (headers, flags) => {

        for (const name in headers) {
            console.log(`${name}: ${headers[name]}`);
        }
        
    });

    req.setEncoding('utf8');

    let data = '';
    req.on('data', (chunk) => {
        data += chunk;
    });

    req.on('end', () => {
        console.log(`The server says: ${data}`);
        client.close();
    });
    req.end();
}

sendMsg();
// sendMsg();
// setTimeout(()=>{

// }, 1000);