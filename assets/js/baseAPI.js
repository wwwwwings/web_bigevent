var baseURL = 'http://ajax.frontend.itheima.net'
//每次调用ajax时，会先调用这个函数。在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    console.log(options.url);
    options.url = baseURL + options.url
})