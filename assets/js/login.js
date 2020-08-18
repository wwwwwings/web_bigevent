$(function () {
    // 点击“去注册”，隐藏登录区域
    $("#link_reg").on("click", function () {
        $(".login-box").hide()
        $(".reg-box").show()
    })
    // 点击“去登录”，隐藏注册区域
    $("#link_login").on("click", function () {
        $(".login-box").show()
        $(".reg-box").hide()
    })
    //从layui身上获取form对象
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 自定义pwd校验规则
        pwd: [
            /^[\S]{6,16}$/,
            '密码必须6到16位，且不能出现空格'
        ],
        //校验密码相同规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容，还需拿到密码框的内容
            var pwd = $(".reg-box input[name=password]").val()
            if (pwd !== value)
                return '两次密码不一致'
        }
    })
    //监听注册表单的事件
    $("#form_reg").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            // data: {
            //     username: $("#form_reg input[name=username]").val(),
            //     password: $("#form_reg input[name=password]").val()
            // },
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg(res.message)
                layer.msg("注册成功，请登录")
                $("#link_login").click()

                // 表单充值
                $("#form_reg")[0].reset()
            }
        })
    })
    //监听登录表单的事件
    $("#form_login").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg(res.message)
                layer.msg("登录成功")
                //将登录成功得到的字符串储存到localstorage
                localStorage.setItem("token",res.token)
                location.href = '/index.html'
            }
        })
    })
})