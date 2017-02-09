
var express = require('express');
// 引入教师数据处理模块
var tcModal = require('../models/teacher');
//引入地区数据表
var region = require('../models/region.json');
// 进入path模块，用来操作路径
var path = require('path');
// __dirname指的是当前目录
var rootPath = path.join(__dirname, '../');

// 引入图片上传包：此处用来上传头像
var multer  = require('multer');

// 自定义存储路径和文件名
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, rootPath + 'uploads/avatars');
	},
	filename: function (req, file, cb) {

		// 原始名 + 时间 + 原始后缀
		var originalname = file.originalname;
		var lastIndex = originalname.lastIndexOf('.');

		var filename = originalname.slice(0, lastIndex);
		var fileExt = originalname.slice(lastIndex);

		cb(null, filename + '-' + Date.now() + fileExt);
	}
})

var upload = multer({ storage: storage });


var router = express.Router();

module.exports = router;
//首页面展示
router.get('/', function (req, res) {

	res.render('dashboard/index', {name: '五邑大学'});
});

//个人中心展示
router.get('/settings', function (req, res) {

	// 根据用户登时的id，查询他的个人资料，做渲染
	var tc_id = req.session.loginfo.tc_id;

	tcModal.find(tc_id, function (err, result) {
		if(err) return;
		res.render('dashboard/settings', result[0]);
	});
});

// 修改个人中心
router.post('/update', function (req, res) {
	console.log(req.body)
	// 用户修改后提交数据
	var body = req.body;
	// 更新数据库
	tcModal.update(body, function (err, result) {
		if(err) console.log(err);

		res.json({
			code: 10000,
			msg: '更新成功!',
			result: {}
		});
		
	});
});

// 修改密码
router.get('/repass', function (req, res) {
	res.render('dashboard/repass', {});
});

//省市县数据
router.get('/region', function (req, res) {

	res.json(region);

});

// 上传头像
router.post('/upfile', upload.single('tc_avatar'), function (req, res) {
	// 此时的tc_avatar就是fileObjName属性的值
	var body = {
		tc_id: req.session.loginfo.tc_id,
		//此时的req.file是经过multer.diskStorage()处理过的，filename也它自定义好的
		tc_avatar: req.file.filename
	}

	// 根据老师id：tc_id，将上传的头像的文件名存储到数据库中，至于文件已经存储到了自定义的路径中
	tcModal.update(body, function (err, result) {
		if(err) return;
		// 上传成功以后将该文件名返回给前端人员，让其根据路径及该文件名做渲染
		res.json(req.file);
	});

});

