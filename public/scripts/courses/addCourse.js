define(function (require, exports, module) {

	var $ = require('jquery');

	require('form');
	// 添加课程
	$('#addCourse').on('submit', function () {

		$(this).ajaxSubmit({
			url: '/course/add',
			type: 'post',
			success: function (data) {
				// 添加成功以后跳到基本信息页面
				if(data.code == 10000) {
					location.href = '/course/basic/' + data.result.insertId;
				}
			}
		});

		return false;

	})

})