
define(function (require, exports, module) {

	var $ = require('jquery');
    // 引入模板引擎
	var template = require('template');
	// 获取模态框id
	var teacherModal = $('#teacherModal');
	// 事件委托
	$('#teacherList').on('click', 'a.preview', function () {
		// 获取到该老师的id
		var tc_id = $(this).attr('data-id');
		// 请求该老师的资料
		$.ajax({
			url: '/teacher/preview',
			type: 'post',
			data: {tc_id: tc_id},
			success: function (info) {
				console.log(info);
				template.config("escape", false);
				// 用前端模板引擎进行数据渲染
				var html = template('teacherTpl', info);
				
				teacherModal.find('table').html(html);

				// 在展示模态前将数据请求过来
				teacherModal.modal();
			}
		});

		return false;
	});

});