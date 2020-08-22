$(function () {
    //-------
    // alert(location.search.split("=")[1])
    function initForm() {
        var id = location.search.split("=")[1]
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg(res.message)
                layer.msg(res.message)
                // console.log(res);
                // 渲染到form表单中
                form.val("form-edit", res.data)
                //tinyMCE 赋值
                tinyMCE.activeEditor.setContent(res.data.content)
                //***.图片 */
                if (!res.data.cover_img) {
                    return layer.msg("未上传图像")
                }
                var newImgURL = baseURL + res.data.cover_img
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', newImgURL) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            }
        })
    }
    //-------
    // 加载文章分类
    var layer = layui.layer
    var form = layui.form
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg(res.message)
                var htmlStr = template('tpl-cates', res)
                $("[name=cate_id]").html(htmlStr)
                form.render()
                //渲染完毕再调用
                initForm()
            }
        })
    }
    initCate()
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        autoCropArea:1,//裁剪区所占比例
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 4.点击按钮选择图片
    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click()
    })
    // 5.设置图片
    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    //文章状态
    // var art_state = null
    var art_state = '已发布'
    // $("#btnSave1").on("click", function () {
    //     art_state='已发布'
    // })
    $("#btnSave2").on("click", function () {
        art_state = '草稿'
    })
    $("#form-pub").on("submit", function (e) {
        e.preventDefault()
        // 基于form表单快速创建一个formData对象
        var fd = new FormData(this)
        fd.append('state', art_state)
        // fd.forEach(function (value, key) {
        //     console.log(key, value);
        // })
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                console.log(...fd);
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 发布文章成功后，跳转到文章列表页面
                // location.href = '/article/art_list.html'
                window.parent.document.getElementById("art_list").click()
            }
        })
    }
})
