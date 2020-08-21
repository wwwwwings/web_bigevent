$(function () {
    var form = layui.form
    //定义检验规则
    form.verify({
        pwd: [/[\S]{6,12}/, '密码应6-12位'],
        samePwd: function (value) {
            if (value === $("[name=oldPwd]").val())
                return '新旧密码不能相同'
        },
        rePwd: function (value) {
            if (value !== $("[name=newPwd]").val())
                return '两次密码不一致'
        }
    })
    //表单提交
    $(".layui-form").on("submit", function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            data: $(this).serialize(),
            url: '/my/updatepwd',
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg(res.message)
                layer.msg(res.message)
                $(".layui-form")[0].reset()
            }
        })
    })
})