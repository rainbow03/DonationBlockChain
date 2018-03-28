'use strict';
const Account = require('../controllers/account');
module.exports = function(app) {
	app.get('/api/account/list', Account.getAccounts); //获取账号列表
	app.post('/api/account/balance', Account.refreshBalance); //获取账号余额
	app.post('/api/account/transfer', Account.sendCoin); //转账
}