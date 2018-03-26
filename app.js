const express = require('express');
const routes = require('./routes');
const http = require('http');
const https = require('https');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');
const fs = require('fs');
const net = require('net');

const app = express();
app.use(cors());

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

app.use(express.cookieParser());
app.use(express.session({
    secret: config.cookieSecret,
    key: config.name,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var dburl = require("./config").db;
mongoose.connect(dburl, function(err, data) {
    if (err) {
        console.warn(err);
    }
});

app.on('close', function(errno) {
    mongoose.disconnect();
});

http.createServer(app).listen(httpPort, function() {
    console.log('HTTP Server listening on port ' + httpPort);
});

routes(app);