/**
 * Module dependencies.
 */

const express = require('express');
const routes = require('./routes');
const http = require('http');
const https = require('https');
const path = require('path');
//const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');
const fs = require('fs');
const net = require('net');

const app = express();
app.use(cors()); //解决跨域
// all environments

const httpPort = 3000;
const httpsPort = 443;


app.set('port', httpPort);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/staticApi', express.static('api'));
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser({
	uploadDir: __dirname + "/public/userUpload/",
	keepExtensions: true,
	limit: 3000000000
}));
/*
 * 加入会话机制
 */
app.use(express.cookieParser()); //cookie解析中间件
app.use(express.session({
	secret: config.cookieSecret, //加密，防止串改
	key: config.name, //读取setting.js里面的db作为cookie名字
	cookie: {
		maxAge: 1000 * 60 * 60 * 24
	}, //设置1天过期
	/*	store: new MongoStore({
		db: config.db
	})*/
}));

app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

/*var dburl = require("./config").db; //数据库地址
mongoose.connect(dburl, function(err, data) {
	if (err) {
		console.warn(err);
	}
});

app.on('close', function(errno) {
	mongoose.disconnect();
});*/

http.createServer(app).listen(httpPort, function() {
	console.log('GuessBox HTTP Server listening on port ' + httpPort);
});

/*var options = {
    key: fs.readFileSync('./cert/2_www.xatcloud.cn.key','utf8'),
    cert: fs.readFileSync('./cert/1_www.xatcloud.cn_bundle.crt','utf8')
};
https.createServer(options, app).listen(httpsPort, function(){
	console.log('CRPDB HTTPS Server listening on port '+ httpsPort);
});

net.createServer(function(socket){
    socket.once('data', function(buf){
        console.log(buf[0],'https buf[0]');
        // https数据流的第一位是十六进制“16”，转换成十进制就是22
        var address = buf[0];
        address === 22 ? httpsPort : httpPort;
        address === 80 ? httpsPort : httpPort;
        //创建一个指向https或http服务器的链接
        var proxy = net.createConnection(address, function() {
            proxy.write(buf);
            //反向代理的过程，tcp接受的数据交给代理链接，代理链接服务器端返回数据交由socket返回给客户端
            socket.pipe(proxy).pipe(socket);
        });
        
        
        proxy.on('error', function(err) {
            console.log(err);
        });
    });
    
    socket.on('error', function(err) {
        console.log(err);
    });
}).listen(3344);*/

routes(app);