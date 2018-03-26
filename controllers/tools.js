var fs = require('fs');
var path = require('path');
var config = require('../config');


//校验手机号
exports.checkMobile = function checkMobile(sMobile) {
	if (sMobile.length != 11) {
		return false;
	}
	if (!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(sMobile))) {
		return false;
	}
	return true;
}


//上传图片
exports.uploadImg = function(req, res) {
	if (!req.files.usr_file) {
		return res.json({
			'status': false,
			'img_url': null,
			'message': '没有提交任何内容'
		});
	}
	if (req.files.usr_file.size >= 2 * 1024 * 1024) {
		return res.json({
			'status': false,
			'img_url': null,
			'message': '图片大于2M，不允许上传'
		});
	}
	if (!req.files.usr_file.path) {
		return res.json({
			'status': false,
			'img_url': null,
			'message': '找不到文件路径，上传失败'
		});
	}
	var folderName = req.body.folderName;
	if (!folderName) {
		folderName = 'other'
	}
	var file_name = req.files.usr_file.path.match(/[^\\]+$/);
	var target_path = './public/userUpload/' + folderName + '/' + file_name;
	fs.rename(req.files.usr_file.path, target_path, function(err) {
		if (err) {
			return res.send({
				'status': false,
				'img_url': null,
				'message': '系统错误：' + err
			});
		}
		var img_url = config.webServerHost + ':' + config.webServerPort + '/userUpload/' + folderName + '/' + file_name;
		if (config.webServerPort == '80') {
			img_url = config.webServerHost + '/userUpload/' + folderName + '/' + file_name;
		}
		//var img_url= '/userUpload/' + folderName + '/' + file_name;
		res.json({
			'status': true,
			'img_url': img_url
		});
	})
}

exports.uploadImg2 = function(req, res) {
	if (!req.files.imgFile) {
		return res.json({
			'status': false,
			'img_url': null,
			'message': '没有提交任何内容'
		});
	}
	if (req.files.imgFile.size >= 2 * 1024 * 1024) {
		return res.json({
			'status': false,
			'img_url': null,
			'message': '图片大于2M，不允许上传'
		});
	}
	if (!req.files.imgFile.path) {
		return res.json({
			'status': false,
			'img_url': null,
			'message': '找不到文件路径，上传失败'
		});
	}
	var folderName = req.body.folderName;
	if (!folderName) {
		folderName = 'other'
	}
	var file_name = req.files.imgFile.path.match(/[^\\]+$/);
	var target_path = './public/userUpload/' + folderName + '/' + file_name;
	fs.rename(req.files.imgFile.path, target_path, function(err) {
		if (err) {
			return res.send({
				'status': false,
				'img_url': null,
				'message': '系统错误：' + err
			});
		}
		var img_url = config.webServerHost + ':' + config.webServerPort + '/userUpload/' + folderName + '/' + file_name;
		if (config.webServerPort == '80') {
			img_url = config.webServerHost + '/userUpload/' + folderName + '/' + file_name;
		}
		//var img_url= '/userUpload/' + folderName + '/' + file_name;
		res.json({
			'error': 0,
			'url': img_url
		});
	})
}

//多文件上传
exports.uploadFeedImgs = function(req, res) {
	if (!req.files.usr_file) {
		return res.json({
			'status': false,
			'img_url': null,
			'message': '没有提交任何内容'
		});
	}
	var fileArr = req.files.usr_file;
	var newArr = [];
	if (fileArr.length > 0) {
		fileArr.forEach(function(file) {
			if (file.size >= 2 * 1024 * 1024) {
				return res.json({
					'status': false,
					'img_url': null,
					'message': '有图片大于2M，不允许上传'
				});
			}
			if (!file.path) {
				return res.json({
					'status': false,
					'img_url': null,
					'message': '找不到文件路径，上传失败'
				});
			}
			var file_name = file.path.match(/[^\\]+$/);
			var target_path = './public/userUpload/feed/' + file_name;
			fs.rename(file.path, target_path, function(err) {
				if (err) {
					return res.json({
						'status': false,
						'message': '系统错误：' + err
					});
				}

			})
			var img_url = config.webServerHost + ':' + config.webServerPort + '/userUpload/feed/' + file_name;
			if (config.webServerPort == '80') {
				img_url = config.webServerHost + '/userUpload/feed/' + file_name;
			}
			newArr.push(img_url);
		})
		res.json({
			'status': true,
			'img_url': newArr
		});
	} else {
		if (req.files.usr_file.size >= 2 * 1024 * 1024) {
			return res.json({
				'status': false,
				'img_url': null,
				'message': '图片大于2M，不允许上传'
			});
		}
		if (!req.files.usr_file.path) {
			return res.json({
				'status': false,
				'img_url': null,
				'message': '找不到文件路径，上传失败'
			});
		}
		var file_name = req.files.usr_file.path.match(/[^\\]+$/);
		var target_path = './public/userUpload/feed/' + file_name;
		fs.rename(req.files.usr_file.path, target_path, function(err) {
			if (err) {
				return res.send({
					'status': false,
					'img_url': null,
					'message': '系统错误：' + err
				});
			}
			var img_url = config.webServerHost + ':' + config.webServerPort + '/userUpload/feed/' + file_name;
			if (config.webServerPort == '80') {
				img_url = config.webServerHost + '/userUpload/feed/' + file_name;
			}
			//var img_url= '/userUpload/' + folderName + '/' + file_name;
			var newArr = [];
			newArr.push(img_url);
			res.json({
				'status': true,
				'img_url': newArr
			});
		});
	}
}