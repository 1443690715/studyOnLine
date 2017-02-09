
define(function (require, exports, module) {

    var $ = require('jquery');
    // 引入模板引擎
    var template = require('template');
    // 获取模态框id
    var teacherModal = $('#teacherModal');
    // 事件委托
    $('#teacherList').on('click', 'a.delete', function () {
        // 获取到该老师的id
        var tc_id = $(this).attr('data-id');

        $.ajax({
            url: '/teacher/delete',
            type: 'post',
            data: {tc_id: tc_id},
            success: function (info) {
                alert(info.msg)
                if( info.code == 2){
                    location.href = '/teacher';
                }
            
            }
        });

        return false;
    });

});