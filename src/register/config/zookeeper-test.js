

var Zookeeper = require('node-zookeeper-client');
var CONNECTION_STRING = "127.0.0.1:2181";
var OPTIONS = {
    sessionTimeout: 5000
}
var zk = Zookeeper.createClient(CONNECTION_STRING, OPTIONS);
zk.on('connected', function () {
    console.log("zk=====" zk);
    zk.close();
});

zk.getChildren('/', function () {
    
}
);

zk.connect();

