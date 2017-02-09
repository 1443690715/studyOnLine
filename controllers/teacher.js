
var express = require('express');

// 引入讲师数据模型
var tcModel = require('../models/teacher');

var router = express.Router();

module.exports = router;

// 展示老师列表
router.get('/', function (req, res) {

	tcModel.show(function (err, result) {
		if(err) return;

		res.render('teachers/index', {teachers: result});
	});

});

// 展示添加讲师页面
router.get('/add', function (req, res) {
	res.render('teachers/add', {});
});

// 展示编辑讲师页面
router.get('/edit/:tc_id', function (req, res) {
	// 根据讲师id获取对应的讲师信息
	var tc_id = req.params.tc_id;

	tcModel.find(tc_id, function (err, result) {
		if(err) return;

		res.render('teachers/add', {teacher: result[0]});
	});

});

// 添加讲师保存
router.post('/add', function (req, res) {
	
	var body = req.body;
	
	tcModel.add(body, function (err, result) {

		if(err) return;

		// 响应结果
		res.json({
			code: 10000,
			msg: '添加成功！',
			result: {}
		});

	});

});

// 编辑讲师
router.post('/edit', function (req, res) {

	// 将得到数据更新至数据库
	tcModel.edit(req.body, function (err, result) {
		if(err) return;

		res.json({
			code: 10000,
			msg: '修改成功!',
			result: {}
		});
	});
});

// 查看讲师资料
router.post('/preview', function (req, res) {
	// 利用ID查询
	var tc_id = req.body.tc_id;

	tcModel.find(tc_id, function (err, result) {
		if(err) return;
		res.json(result[0]);

	});

});
// 删除教师信息
router.post('/delete', function (req, res) {
	// 利用ID查询
	var tc_id = req.body.tc_id;
	tcModel.delete(tc_id, function (err, result) {
		if(err) return;
		res.json({
			code:2,
			msg:'注销成功',
			result:result
		});

	});

});