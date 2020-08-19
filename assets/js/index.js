$(function () {
    getUserInfo()
    $("#btnLogout").on("click", function () {
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 清空本地存储中的token
            localStorage.removeItem('token')
            // 重新跳转到login.html
            location.href = '/login.html'
            //关闭confirm询问框
            layer.close(index);
        });
    })
})
//用户基本信息获取函数
//后面还要调用，所以要封装到入口函数外面
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     //重新登录，token有效期12h
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0)
                return layui.layer.msg(res.message)
            renderAvatar(res.data)
        }
        // 无论成功与否必定调用complete回调函数
        // complete: function (res) {
        //     // 在complete回调函数中可以使用res.responseJSON拿到服务器响应回来的数据
        //     console.log(111);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         localStorage.removeItem('token')
        //         location.href='/login.html'
        //     }
        // }
    })
}
//用户头像函数渲染函数
function renderAvatar(user) {
    // 获取名称
    var name = user.nickname || user.username
    // 设置欢迎文本
    $("#welcome").html("欢迎&nbsp" + name)
    // 按需渲染用户头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $(".layui-nav-img").attr("src", user.user_pic).show()
        $(".text-avatar").hide()
    }
    else {
        //渲染文本头像
        $(".layui-nav-img").hide()
        var first = name[0].toUpperCase()
        $(".text-avatar").html(first).show()
    }
}