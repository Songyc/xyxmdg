var rPhone = /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
    nemptymsg = '姓名不能为空',
    pemptymsg = '手机号不能为空',
    pfailmsg = '手机号码不对哦，不要失联好吗',
    chosephotomsg = '请先上传图片',
    netfailmsg = '可能是网络问题，提交信息失败';

// 验证模块
$.extend(fn, {
	checkPhoneNumber: function (value, selector) {
		if(value === '') {
            fn.tips(selector, pemptymsg);
            return;
        }
        if(!rPhone.test(value)) {
            fn.tips(selector, pfailmsg);
            return false;
        }
        return true;
	},

    checkName: function (value, selector) {
       if(value === '') {
            fn.tips(selector, nemptymsg);
            return;
        }
        return true; 
    }
});

// 剪切模块
$.extend(fn, {
    clip: function () {
        var body_width = $('body').width();
        var body_height = $('body').height();
          
        $("#clipArea").photoClip({
            width: body_width * 0.8,
            height: body_width * 0.8,
            file: "#file",
            view: "#hit",
            ok: "#clipBtn",
            loadStart: function () {
                //console.log("照片读取中");
                $('.lazy_tip span').text('');
                $('.lazy_cover,.lazy_tip').show();
            },
            loadComplete: function () {
                //console.log("照片读取完成");
                $('.lazy_cover,.lazy_tip').hide();
            },
            clipFinish: function (dataURL) {
                $('#hit').attr('src', dataURL);
                fn.saveImageInfo();
            }
        });  
    },

    saveImageInfo: function () {
        var filename = $('#hit').attr('fileName');
        var img_data = $('#hit').attr('src');
        if(img_data==""){alert('null');}
        fn.render(img_data);
    },

    render: function (src) {
        var MAX_HEIGHT = 320;  //Image 缩放尺寸 
        var MAX_WIDTH = 320;
        // 创建一个 Image 对象  
        var image = new Image();  
        
        // 绑定 load 事件处理器，加载完成后执行  
        image.onload = function(){
            // 获取 canvas DOM 对象
            var canvas = document.getElementById("myCanvas");

            // 如果高度超标  
            if(image.height > MAX_HEIGHT) {  
                // 宽度等比例缩放 *=  
                image.width *= MAX_HEIGHT / image.height;  
                image.height = MAX_HEIGHT;  
            } 
            if(image.height > MAX_WIDTH) {  
                // 宽度等比例缩放 *=  
                image.width *= MAX_WIDTH / image.width;  
                image.width = MAX_WIDTH;  
            }   
            // 获取 canvas的 2d 环境对象,  
            // 可以理解Context是管理员，canvas是房子  
            var ctx = canvas.getContext("2d");  
            // canvas清屏  
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            canvas.width = image.width;        // 重置canvas宽高  
            canvas.height = image.height;  
            // 将图像绘制到canvas上  
            ctx.drawImage(image, 0, 0, image.width, image.height);  
            // !!! 注意，image 没有加入到 dom之中  
            
            var dataurl = canvas.toDataURL("image/jpeg"); 
            var imagedata =  encodeURIComponent(dataurl); 
            fn.dosuccess(dataurl);//成功后处理
        };  
        // 设置src属性，浏览器会自动加载。  
        // 记住必须先绑定render()事件，才能设置src属性，否则会出同步问题。  
        image.src = src;
    },

    dosuccess: function (dataurl) {
        var twebsite = fn.getWebsit();
        $('#upc').hide();
        $("#ppic").attr('src',dataurl);
        $.post("http://upc.pclady.com.cn/upload_quick_base64.jsp?referer=http://play10.pclady.com.cn/",{
            application:'play',
            readExif:'yes',
            keepSrc:'yes',
            website:twebsite,
            data : dataurl
        },function(data){
            if(data.retCode<1){
                var fnum = data.files.length;
                if(fnum>0){//有返回图片再处理

                    for(var i=0;i<fnum;i++){
                        if(data.files[i].isorg==1){//取原图
                            turlB = data.files[i].url;
                            $("#ppic").attr('src',turlB);
                            isdon = false;
                            document.getElementById('ppic').src=turlB;
                            //  document.getElementById('abc').innerHTML = '返回的图片URL是：'+turlB;
                            $("#ppic").attr("data-isload",1);
                            $("#Jconfirm").removeClass("button-disabled");
                        }
                    }
                }
            }else{
                alert("上传失败，请重试！");
            }
        },"json");
    },

    getWebsit: function () {
        if (navigator.userAgent.toLowerCase().match(/micromessenger/i) != "micromessenger") return ;
        var website;
        switch (window.location.hostname.replace(/\w+((\.\w+)+)/, "$1")) {
            case ".pconline.com.cn":
            website = 'pconline';
                break;
            case ".pcauto.com.cn":
            website = 'pcauto';
                break;
            case ".pclady.com.cn":
            website = 'pclady';
                break;
            case ".pcbaby.com.cn":
            website = 'pcbaby';
                break;
            case ".pcgames.com.cn":
            website = 'pcgames';
                break;
            case ".pchouse.com.cn":
            website = 'pchouse';
                break;
            default :
            website = 'pconline'; //默认是电脑网，可能会导致上传失败。
                break;
        }
        return website;
    }
});

// 上传照片
$("#clip, #JreChose").click(function () {
    $("#upc").show();
    swiper.lockSwipes();
});

// 重选
$("#cancel").on("touchstart",function(){
    $("#upc").hide(); 
    swiper.unlockSwipes();
});

// 确定
$("#Jconfirm").click(function () {

    var status = $("#ppic").attr("data-isload");

    if(status === '1') {   
        $(".m-item4 li.cur").removeClass("cur");
        $(".m-item4 li").last().addClass("cur");

        var src = $("#ppic").attr("src")
        $("#Jhead").attr("src", src);
    }
});

// 提交
$("#Jcommit").click(function () {
    var name = $(".form .name input").val(),
        phone = $(".form .phone input").val(),
        photo = $("#Jhead").attr("src"),
        url, data, callback;

    if(!fn.checkName(name, '.tips .phone-li')) {
        return;
    }

    if(!fn.checkPhoneNumber(phone, '.tips .phone-li')) {
        return;
    }

    url = enrollUrl;
    data = {
        name: name,
        phone: phone,
        photo: photo
    }

    callback = function (data) {
        if(data) {
            fn.tips('.tips .phone-li', data.msg);
        }else{
            fn.tips('.tips .phone-li', netfailmsg);
        }
    }
    fn.ajax(url, data, callback);
});