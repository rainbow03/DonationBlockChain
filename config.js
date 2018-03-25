"use strict";
exports.name = 'GuessBox';
exports.cookieSecret = 'GuessBox_Session';
exports.db = 'mongodb://127.0.0.1:25018/GuessBox';

/*白名单*/
exports.writeIp = ['127.0.0.1'];

/*web服务器地址*/
exports.webServerHost = 'http://127.0.0.1';
exports.webServerPort = 80;

/*服务器验证用*/
exports.agent_id = 'xat49800a24493434e';
exports.safekey = 'ae942b37c1b114c278a87b1e30d2daea';