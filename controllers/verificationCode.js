const tools = require('./tools');
const verificationCodeDB = require('../dao/verificationCodeDao');
const alicloudSms = require('../runtimeConfig/alicloudSms');

/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 */
const SMSClient = require('@alicloud/sms-sdk')
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = alicloudSms.accessKeyId;
const secretAccessKey = alicloudSms.secretAccessKey;
const SignName = alicloudSms.SignName;
const TemplateCode = alicloudSms.TemplateCode;
//初始化sms_client
let smsClient = new SMSClient({
	accessKeyId,
	secretAccessKey
});

//发送短信
exports.verificationCode = function(req, res) {
	var modelId = req.body.modelId;
	var nonce_str = num6();
	var rec_num = req.body.rec_num;
	if (!rec_num) {
		return res.json({
			status: false,
			message: 'no rec_num'
		});
	}
	if (rec_num == '13643713298' || rec_num == '13643713297') {
		return res.json({
			status: false,
			message: '测试账号的验证码为 888555'
		});
	}
	if (!modelId) {
		return res.json({
			status: false,
			message: 'no modelId'
		});
	}
	var state = tools.checkMobile(rec_num);
	if (!state) {
		return res.json({
			status: false,
			message: '请输入正确的手机号码'
		});
	}
	smsClient.sendSMS({
		PhoneNumbers: rec_num,
		SignName: SignName,
		TemplateCode: TemplateCode,
		TemplateParam: '{"code":"' + nonce_str + '"}'
	}).then(function(data) {
		let {
			Code
		} = data
		if (Code === 'OK') {
			//处理返回参数
			console.log('验证码发送成功，开始绑定用户临时验证码', rec_num, modelId, nonce_str);
			verificationCodeDB.add(nonce_str, rec_num, modelId, function(err) {
				if (err) {
					return res.json({
						status: false,
						message: err
					})
				}
				res.json({
					status: true
				});
			});
		}
	}, function(err) {
		console.warn('error_response:', err);
		return res.json({
			status: false,
			message: '短信服务器出错，请稍后再试'
		});
	});
}

function num6() {
	var chars = '0123456789';
	var maxPos = chars.length;
	var noceStr = "";
	for (var i = 0; i < 6; i++) {
		noceStr = noceStr + chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return noceStr; //随机数
}