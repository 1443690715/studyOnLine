define(function (require, exports, module) {

	var $ = require('jquery');

	require('form');
    // 引入上传文件的插件
	require('uploadify');
	// 图片裁切的插件
	require('Jcrop');

	var preview = $('.preview img');
	var jcrop_api;

	function imgCrop () {

		if(jcrop_api) {
			jcrop_api.destroy();
		}
		
		preview.Jcrop({
			boxWidth: 400,//盒子宽度
			aspectRatio: 2//宽高比例
		}, function () {

			jcrop_api = this;

			// 在回调函数中设置默认选区
			var width = this.ui.stage.width;
			var height = this.ui.stage.height;

			var x, y, w, h;
			// 默认的裁切大小和摆放位置
			x = 0;
			y = (height - width / 2) / 2;
			w = width;
			h = width / 2;

			this.newSelection();
			this.setSelect([ x, y, w, h ]);

			// 配置预览区
  			thumbnail = this.initComponent('Thumbnailer', { width: 240, height: 120, thumb: '.thumb' });

  			$('.jcrop-thumb').css({
  				left: 0,
  				top: 0
  			})
		});
	}

	// 给图片的父元素添加事件，获取坐标，当裁切区域变化的时候
	preview.parent().on('cropmove cropend', function (selection, coords, c) {
		$('#x').val(c.x);
		$('#y').val(c.y);
		$('#w').val(c.w);
		$('#h').val(c.h);
	});

	// 裁切图片并上传
	$('#cutBtn').on('click', function () {
		// 获取此时按钮的状态
		var status = $(this).attr('data-status');
		// 如果是裁切状态那么就裁切，并且改变按钮状态为保存
		if(status == 'cut') {
			imgCrop();

			$(this).val('保存图片');
			$(this).attr('data-status', 'save');
			return;
		}
		// 将前端假裁切后的图片保存提交，提交的data数据在coords表单里面
		$('#coords').ajaxSubmit({
			url: '/course/crop',//保存的路径
			type: 'post',
			success: function (data) {
			// 成功以后的回调，即跳转到课时管理模块
				if(data.code == 10000) {
					location.href = '/course/lesson/' + data.result.cs_id;
				}
			}
		});

		return false;

	});

	// 上传文件，将裁切前的原图上传
	$('#upfile').uploadify({
		width: '85px',//按钮宽度
		height: 'auto',
		fileObjName: 'upfile', // 上传文件的key，相当于file表单name
		formData: {cs_id: $('#csId').val()}, // 参数，相当于jquery的data
		buttonClass: 'btn btn-success btn-sm',//给按钮添加类名 覆盖默认的样式
		fileSizeLimit: '2MB',//不能超过2mb
		fileTypeExts:  '*.gif; *.jpg; *.png',//文件的后缀
		buttonText: '选择图片',
		swf: '/assets/uploadify/uploadify.swf',//flash文件路径
		uploader: '/course/upfile',//上传路径
		itemTemplate: '<span></span>',//进度条
		onUploadSuccess: function (file, data) {
			// 上传成功的回调
			var data = JSON.parse(data);
			// 预览图片
			preview.attr('src', '/original/' + data.filename);
			// 将图片路径存入表单以便其显示
			$('#cover').val(data.filename);
			// 改变按钮状态
			$('#cutBtn').prop('disabled', false);
			$('#cutBtn').attr('data-status', 'cut');
			// $('#cutBtn').val('保存图片').attr('data-status', 'save');
			// // 调用裁切，显示默认的裁切区域
			// imgCrop();
		}
	});

});