var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var config = require('../config');

//定义VerificationCode对象模型

var VerificationCodeSchema = new Schema({
	modelId: {
		type: String,
		default: ''
	},
	//验证码
	code: {
		type: String,
		default: ''
	},
	//时间
	time: {
		type: Number,
		default: new Date().getTime()
	},
	//手机号
	mobile: {
		type: String,
		default: ''
	}
});

//访问VerificationCode对象模型
mongoose.model('VerificationCode', VerificationCodeSchema);
var VerificationCode = mongoose.model('VerificationCode');

//新增
exports.add = function(code, mobile, modelId, callback) {
	VerificationCode.findOne({
		mobile: mobile,
		modelId: modelId
	}, function(err0, doc0) {
		if (err0) {
			return callback(err0);
		}
		if (doc0) {
			doc0.code = code;
			doc0.time = new Date().getTime() + 5 * 60 * 1000;
			doc0.save(function(err1) {
				if (err1) {
					return callback(err1);
				}
				callback(null, doc0);
			});
			return;
		}
		var newVerificationCode = new VerificationCode();
		newVerificationCode.modelId = modelId;
		newVerificationCode.code = code;
		newVerificationCode.mobile = mobile;
		newVerificationCode.time = new Date().getTime() + 5 * 60 * 1000;
		newVerificationCode.save(function(err) {
			if (err) {
				util.log("FATAL:" + err);
				return callback(err);
			}
			callback(null, doc0);
		});
	});
}

var findCodeByMobile = exports.findCodeByMobile = function(mobile, modelId, callback) {
	VerificationCode.findOne({
		mobile: mobile,
		modelId: modelId
	}, function(err, doc) {
		if (err) {
			util.log('FATAL ' + err);
			return callback(err, null);
		}
		callback(null, doc);
	});
}

//修改验证码
exports.editVerificationCode = function(mobile, modelId, verificationCode, callback) {
	VerificationCode.findOne({
		mobile: mobile,
		modelId: modelId
	}, function(err, doc) {
		if (err) {
			util.log('FATAL ' + err);
			return callback(err);
		}
		if (!doc) {
			return callback('该手机号还未注册');
		}
		doc.verificationCode = verificationCode;
		doc.verificationTime = new Date().getTime() + 5 * 60 * 1000; //过期时间
		doc.save(function(err2, result2) {
			if (err2) {
				util.log('FATAL ' + err2);
				return callback(err2);
			}
			callback(null);
		});
	});
}