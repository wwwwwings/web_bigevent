$(function () {
    var form = layui.form
    //自定义验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6)
                return '昵称长度为1~6'
        }
    })
    //用户渲染
    var layer = layui.layer
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0)
                    return layer.msg(res.message)
                // 成功后，渲染
                form.val('formUserInfo', res.data)
            }
        })
    }
    initUserInfo()

    $("#btnReset").on("click", function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault()
        initUserInfo()
    })
    // 修改用户信息
    $(".layui-form").on("submit", function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg(res.message)
                layer.msg(res.message)
                // 调用父页面的方法，重新渲染用户头像和信息
                window.parent.getUserInfo()
            }
        })
    })
})
