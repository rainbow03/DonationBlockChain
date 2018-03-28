var Web3 = require('web3');
if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}
var contract = require('truffle-contract');
var dnc_artifact = require('../build/contracts/DNC.json');
var DNC = contract(dnc_artifact);
DNC.setProvider(web3.currentProvider);
DNC.defaults({
	from: web3.eth.coinbase
});
//获取账号
exports.getAccounts = function(req, res) {
	web3.eth.getAccounts(function(err, accounts) {
		if (err) {
			return res.json({
				status: 1,
				message: err
			});
		}
		if (accounts.length == 0) {
			return res.json({
				status: 1,
				message: 'Could not get any accounts!'
			});
		}
		res.json({
			status: 0,
			resources: accounts
		});
	});
}

//刷新余额
exports.refreshBalance = function(req, res) {
	var account = req.body.account;
	if (!account) {
		return res.json({
			status: 1,
			message: 'no account'
		});
	}
	var gbt;
	DNC.deployed().then(function(instance) {
		gbt = instance;
		return gbt.balanceOf(account, {
			from: account
		});
	}).then(function(value) {
		res.json({
			status: 0,
			resources: value.valueOf()
		});
	}).catch(function(e) {
		console.warn(e);
		res.json({
			status: 1,
			message: e.message
		});
	});
}

//转账
exports.sendCoin = function(req, res) {
	var amount = req.body.amount;
	var sender = req.body.sender;
	var receiver = req.body.receiver;
	if (!amount) {
		return res.json({
			status: 1,
			message: 'no amount'
		});
	}
	if (!sender) {
		return res.json({
			status: 1,
			message: 'no sender'
		});
	}
	if (!receiver) {
		return res.json({
			status: 1,
			message: 'no receiver'
		});
	}
	if (sender == receiver) {
		return res.json({
			status: 1,
			message: 'The address is not the same'
		});
	}
	var gbt;
	DNC.deployed().then(function(instance) {
		gbt = instance;
		return gbt.transfer(receiver, amount, {
			form: sender
		});
	}).then(function(state) {
		if (!state) {
			return res.json({
				status: 1,
				message: 'Error 500'
			});
		}
		res.json({
			status: 0
		});
	}).catch(function(e) {
		console.log(e);
		res.json({
			status: 1,
			message: e.message
		});
	});
}