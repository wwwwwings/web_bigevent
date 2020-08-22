$(function () {
    // 定义一个查询的参数对象，将来请求数据的时候需要将其提交到服务器
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',  //文章分类id
        state: ''  //文章状态
    }
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 美化时间过滤器
    template.defaults.imports.dateFormat = function (dateStr) {
        var dt = new Date(dateStr)
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth())
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    var layer = layui.layer
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg(res.message)
                var htmlStr = template('tpl-table', res)
                $("tbody").html(htmlStr)
                // 渲染分页
                renderPage(res.total)
            }
        })
    }
    initTable()
    // 初始化文章分类
    var form = layui.form
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg(res.message)
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                $("[name=cate_id]").html(htmlStr)
                // 重新渲染
                form.render()
            }
        })
    }
    initCate()
    // 为筛选表单绑定事件
    $("#form-search").on("submit", function (e) {
        e.preventDefault()
        var cate_id = $("[name=cate_id]").val()
        var state = $("[name=state]").val()
        q.cate_id = cate_id
        q.state = state
        // console.log(q.cate_id,q.state);
        initTable()
    })
    // 分页方法
    var laypage = layui.laypage
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox',    //分页容器id
            count: total,   //总数据条数
            limit: q.pagesize,  //每页几条数据
            curr: q.pagenum,    //默认被选中的分页
            //分页时发生jump回调函数
            //点击页码or触发laypage.render
            jump: function (obj, first) {
                q.pagenum = obj.curr    //最新的页码值赋值给q
                q.pagesize = obj.limit  //最新的条目数赋值给q
                if (!first) //第一次first是true 其余为undefined
                    initTable()
            },
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10]
        })
    }
    // 给删除按钮代理事件
    $("tbody").on("click", ".btn-delete", function () {
        var len = $(".btn-delete").length
        console.log(len);
        var id = $(this).attr('data-id')
        layer.confirm('是否要删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // console.log(id);
                    if (res.status !== 0)
                        return layer.msg(res.message)
                    layer.msg(res.message)
                    //当数据删除后，须判断当前页是否还有内容，若没有应页码减一
                    if (len == 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum - 1
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})