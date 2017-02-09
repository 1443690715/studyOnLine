
var express = require('express');

var router = express.Router();

// 讲师表
var tcModel = require('../models/teacher');

module.exports = router;
// 渲染登陆页面
router.get('/', function (req, res) {
	res.render('login/index', {});
});

// 验证登陆信息
router.post('/', function (req, res) {

	var body = req.body;

	tcModel.authored(body, function (err, result) {
		if(err) console.log(err);

		// 记录登录状态
		req.session.loginfo = result[0];
		if(result[0] === undefined){
			res.json({
				code: 00000,
				msg: '用户名或者密码错误',
				result: {}
			});
		}else{
			res.json({
				code: 10000,
				msg: '登录成功!',
				result: {}
			});
		}
		
	});
});