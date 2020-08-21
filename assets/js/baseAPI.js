var baseURL = 'http://ajax.frontend.itheima.net'
//每次调用ajax时，会先调用这个函数。在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    //拼接url
    options.url = baseURL + options.url
    //统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    //全局统一挂载complete回调函数
    options.complete = function (res) {
        // 在complete回调函数中可以使用res.responseJSON拿到服务器响应回来的数据
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})