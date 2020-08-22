$(function () {
    var layer = layui.layer
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg(res.message)
                // layer.msg(res.message)
                var htmlStr = template('tpl_table', res)
                $("tbody").html(htmlStr)
            }
        })
    }
    initArtCateList()
    $("#btnAddCate").on("click", function () {
        indexAdd = layer.open({
            type: '1',
            area: ['500px', '260px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });
    })
    // 通过代理的形式为表单进行ajax请求
    var indexAdd = null
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',

            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg(res.message)
                layer.msg(res.message)
                initArtCateList()
                layer.close(indexAdd)
            }
        })
    })
    var indexEdit = null
    var form = layui.form
    // 通过代理的形式为btn-edit绑定点击事件
    $("body").on("click", ".btn-edit", function () {
        indexEdit = indexAdd = layer.open({
            type: '1',
            area: ['500px', '260px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        });
        var id = $(this).attr("data-id")
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })
    // 通过代理的形式为修改分类的表单绑定事件
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg(res.message)
                layer.msg(res.message)
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })
    // 通过代理的形式为删除按钮绑定事件
    $("body").on("click", ".btn-delete", function () {
        var id = $(this).attr("data-id")
        layer.confirm('是否要删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0)
                        return layer.msg(res.message)
                    layer.msg(res.message)
                    initArtCateList()
                }
            })
            layer.close(index);
        });
    })
})