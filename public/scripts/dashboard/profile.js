define(function (require, exports, module) {

	var $ = require('jquery');

	// 引入省市县插件，实现籍贯的填写
	require('region');

	// 引入表单插件，发送异步请求
	require('form');

	// 引入文件上传插件，上传头像
	require('uploadify');

	// 日期插件，出生日期和入职日期
	require('datepicker');

	// 汉化
	require('language');
	// 引入文本编辑器，实现个人介绍的文本输入
	var ck = require('ckeditor');
	ck.replace('teacherIntroduce');//参数为textarea标签中的id属性
	// 参数为input标签中的class属性datepicker
	$('.datepicker').datepicker({
		format: 'yyyy-mm-dd',
		language: 'zh-CN'
	});

	// 省市县，参数为省市县三个下拉框的父元素
	$('.hometown').region({
		url: '/region'
	});

	// 提交表单数据
	$('#updateTeacher').on('submit', function () {
        // 提交ckeditor数据
        for(instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].updateElement();
        }
		$(this).ajaxSubmit({
			url: '/update',
			type: 'post',
			success: function (data) 
				alert(data.msg);
				// 修改成功以后重新刷新页面
				if(data.code == 10000) {
					location.reload();
				}
			}
		});

		return false;
	});

	// flash实现头像上传
	$('#upfile').uploadify({
		buttonText: '',
		height: '120px',
		fileObjName: 'tc_avatar',
		swf: '/assets/uploadify/uploadify.swf', // flash文件路径
		uploader: '/upfile', // 后台接口
		itemTemplate: '<span></span>',//进度条
		onUploadSuccess: function (file, data) {
			
			var data = JSON.parse(data);
			$('.preview img').attr('src', '/avatars/' + data.filename);
		}
	});

});