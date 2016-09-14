// 投票模块
$.extend(fn, {
    vote: function (ele) {
        var url = voteUrl,
            enrollId = $(ele).attr('data-enrollId');

        fn.ajax(url, {
            enrollId: 11
        }, function (data) {

            if(data.code === '1') {
                var number = $(ele).parent().find('.number');
                $(number).text( parseFloat($(number).text()) + 1 );
                $(ele).addClass('cur');
            }

            fn.tips('.tips .vote-li', data);
        });
    },

    tips: function (selector, data) {
        var msg;

        if(typeof data === 'string') {
            msg = data;
        }else if(typeof data === 'object'){
            msg = data.msg;

            if(data.code === '1') {
                $(selector).addClass('success');
            }
        }

        $(selector).addClass('cur');

        $('p', selector).text(msg);
        
        setTimeout(function () {
            $(selector).removeClass('cur success');
        }, 1500);
    }
});

// 查询列表模块
$.extend(fn, {
    ajax: function (url, obj, fn) {
        $.ajax({
            url: url,
            data: obj,
            dataType: 'json',
            success: function(data) {
                fn(data);
            },
            error: function(e) {}
        });
    },
    // 初始化当前swiper
    initSwiper2: function (force, msg) {
        if (!swiperList[1] || force) {
            var swiper2 = new Swiper('.swiper-container2', {
                nextButton: '.m-item2 .swiper-button-next',
                prevButton: '.m-item2 .swiper-button-prev',
                onSlideChangeEnd: function() {
                    fn.countPage();
                }
            });
            swiperList[1] = swiper2;
            fn.countPage();

            if(msg) {
                fn.tips('.tips .search-li', msg);
            }
        }
    },
    // 计算页码
    countPage: function () {
        var totalPage = document.querySelectorAll('.swiper-container2 .swiper-slide').length,
            pageNumber = document.querySelector('.pageNumber'),
            curPage = 0;

        if (totalPage !== 1) {
            curPage = swiperList[1].activeIndex;
        }

        pageNumber.textContent = (curPage + 1) + '/' + totalPage;
    },
    // 拼接字符串
    joinString: function(data) {
        var swiperContainer = document.querySelector('.swiper-container2 .swiper-wrapper'),
            enList;

        swiperContainer.innerHTML = '';

        if (data.code !== 1) {
            return;
        }

        if(typeof data.info === "object") {
            enList = [];
            enList.push(data.info);
        }else {
            enList = data.enList;
        }

        if(!enList || !enList.length) {
            return;
        }

        var str = '', item, l = enList.length,
            pageNumber, curPageNumber;

        for (var i = 0; i < l; i++) {
            item = enList[i];

            if (i % 4 === 0) {
                str += '<div class="swiper-slide">';
            }

            str +=
                '<div class="item">' +
                '<div class="pic">' +
                '<img src="' + item.photo + '" data-src="' + item.photo + '" data-enrollId="' + item.enrollId + '" data-name="' + item.name + '" class="swiper-lazy" alt="">' +
                '<p class="md-girl">' +
                '<span>摩登Girl NO.' + item.enrollId + '</span>' +
                '</p>' +
                '</div>' +
                '<div class="info vote-box">' +
                '<div class="name">' + item.name + '</div>' +
                '<i class="vote"></i>' +
                '<span class="number">' + item.votedNum + '</span>' +
                '</div>' +
                '</div>';

            if (i % 4 === 3) {
                str += '</div>';
            }
        }
        if (!str) {
            return;
        }

        swiperContainer.innerHTML = str;

        if (swiperList[1] && swiperList[1].destroy) {
            swiperList[1].destroy();
            swiperList[1] = null;
            fn.initSwiper2(true, data.msg);
        }
    },

    initAjaxPage: function () {
        var type = 0,
            url = getRankUrl;

        fn.ajax(url, {type: type}, function(data) {
            fn.joinString(data);
        });
    },
});

// 生成二维码
$.extend(fn, {
    qrcode: function () {
        var url = '',
            id = $(this).attr('data-enrollId'),
            src = $(this).attr('src'),
            self = this;

        url += '?userID=' + id;

        // var url = 'http://www1.pclady.com.cn/wap/zt/gz20160318/prettygirl/index.html?userID=0519';
        var qrcode = new QRCode('qrcode', {
            text: url,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H,
            success: function(a) {
                // console.log(a); // 获取到当前二维码的base64编码
                setTimeout(function() {
                    fn.draw.call(self, a._base64Src, function(src) {
                        $.post("http://upc.pclady.com.cn/upload_quick_base64.jsp?referer=http://play10.pclady.com.cn/", {
                            application: 'play',
                            readExif: 'yes',
                            keepSrc: 'yes',
                            data: src
                        }, function(data) {
                            console.log(data);
                        }, "json");
                    });
                }, 200);
            }
        });

        fn.setAllIntervalAnimation('.m-item2');
    }
});

// Canvas生成图片模块
$.extend(fn, {
    createCanvas: function () {

        var masker = document.querySelector('.m-item2 .masker-bg'),
            canvas = masker.querySelector("#canvas"), voteBox;

        if(!canvas) {
            canvas = document.createElement('canvas');
            voteBox = masker.querySelector('.vote-box');

            canvas.id = 'canvas';
            canvas.className = 'canvas';
            canvas.width = 520;
            canvas.height = 730;

            masker.insertBefore(canvas, voteBox);
        }

        return canvas;
    },

    draw: function (src, callback) {
        var canvas = fn.createCanvas(),
            context = canvas.getContext('2d'),
            name = $(this).attr('data-name'),
            id = $(this).attr('data-enrollId'),
            imgPath;

        fn.clearCanvas.call(canvas, context);    
        fn.drawText(context, name, 'N0.' + id);

        var picList = [{
                src: 'www1.pclady.com/zt/20160906/xyxmdg/images/p2/wanted.png',
                left: 70,
                top: 0,
                width: 386,
                height: 129
            }, 
            {
                src: $(this).attr('src'),
                left: 70,
                top: 134,
                width: 376,
                height: 398
            }, 
            {
                src: src,
                left: 334,
                top: 548,
                width: 182,
                height: 182
            }
        ];

        fn.drawPic(context, picList, canvas, callback);
    },

    drawPic: function (context, picList, canvas, callback) {
        var l = picList.length,
            j = 0;
        context.beginPath();

        function getBase64(src, callback) {
            var ip = 'http://upc.pcauto.com.cn/interface/image2base64.jsp?url=';
            src = ip + src;

            $.ajax({
                url: src,
                data: {},
                dataType: 'jsonp',
                jsonpCallback: 'cb',
                success: function(data) {
                    var dataUrl = data.data;
                },
                error: function(e) {}
            });
        }

        function loadImg(obj, border) {
            var img = new Image(),
                imgPath;

            img.src = obj.src;

            img.onload = function () {
                context.drawImage(this, obj.left, obj.top, obj.width, obj.height);
                if(border) {
                    context.lineWidth = 5;
                    context.strokeStyle = '#000';
                    context.strokeRect(obj.left, obj.top, obj.width, obj.height);
                }
                context.fill();

                j++;
                if(j === l) {
                    var canvasImg = fn.createImg();

                        imgPath = canvas.toDataURL("image/png");
                        callback && callback.call(this, imgPath);
                        this.src = imgPath;
                    // canvasImg.onload = function () {

                    // }
                    canvasImg.crossOrigin = "anonymous";
                    // img.src = 'http://192.168.50.224/Song_yc/160906_xyxmdg/images/music_close.png';
                    j = 0;
                }
            }
        }

        for(var i = 0; i < l; i++) {
            loadImg(picList[i], i == 1 ? true : false);
        }
    },

    createImg: function () {

        var masker = document.querySelector('.m-item2 .masker-bg'),
            img = masker.querySelector("#canvasPic"), voteBox;

        if(!img) {
            img = document.createElement('img');
            voteBox = masker.querySelector('.vote-box');

            img.id = 'canvasPic';
            img.className = 'canvasPic';
            img.width = 520;
            img.height = 730;
            // img.src = 'http://www.atool.org/placeholder.png?size=520x700';
            

            masker.insertBefore(img, voteBox);
        }

        return img;
    },

    drawText: function (context, name, number) {
        var arr = ['Hi,我是', '我被摩登通缉了！现在参加了', '全国高校摩登Girl的活动', '编号', '长按识别二维码给我点赞投票吧'],
            l = arr.length;

        context.beginPath();
        context.font = '22px/36px 宋体';
        context.fillStyle = '#303030';

        for(var i = 0; i < l; i++) {
            context.fillText(arr[i], 0, 570 + i * 36);
        }

        context.beginPath();
        context.font = '26px/36px 宋体';
        context.fillStyle = '#976835';
        context.fillText(name, 85, 570);
        context.fillText(number, 70, 570 + (l - 2) * 36);
    },

    clearCanvas: function(context) {
        context.clearRect(0, 0, this.width, this.height);
    },

    clearImg: function (img) {
        $(img).remove();
    }
});


$.extend(fn, {
    getBase64: function (src) {
        var ip = 'http://upc.pcauto.com.cn/interface/image2base64.jsp?url=';
        src = ip + src;

        $.ajax({
            url: 'http://upc.pcauto.com.cn/interface/image2base64.jsp?url=http://www1.pclady.com.cn/zt/20160906/xyxmdg/images/p3/03.png',
            data: {},
            dataType: 'jsonp',
            jsonpCallback: 'cb',
            success: function(data) {
                console.log(data);
            },
            error: function(e) {}
        });
    },

    getPic: function (base64) {

    }
})

fn.initAjaxPage();

// jsonp回调函数
// function enrollist(data) {
//     fn.joinString(data);
// }

fn.getBase64('http://www1.pclady.com.cn/zt/20160906/xyxmdg/images/p3/03.png');

// 点赞
$(document).delegate('.vote', 'click', function (e) {
    fn.vote(this);
});

// 返回
$('.m-item2 .small-back').click(function () {
    $('.m-item2 .masker').removeClass('cur');
    setTimeout(function () {
        $('.m-item2 .masker').hide()
    }, 300);
    fn.cleanAllIntervalAnimation(".m-item2");
});

// 人气，最新, 搜索
$(document).delegate('.sort-search span', 'click', function (e) {
    var data = {},
        url = getRankUrl;

    if($(this).hasClass('cur')) {
        return;
    }

    if($(this).hasClass('search-icon')) {
        url = userInfoUrl;
        data.eid = $(this).siblings('.search').val();
    }else {
        $(this).parents('.sort-search').find('span.cur').removeClass('cur');
        $(this).addClass('cur');
        data.type = $(this).attr('data-type');
    }

    fn.ajax(url, data, function (data) {
        fn.joinString(data);
    });
});

$(document).delegate('.swiper-container2 .item img', 'click', function (e) {
   $('.m-item2 .masker').show();
   setTimeout(function (){
        $('.m-item2 .masker').addClass('cur');
   }, 0);

   fn.qrcode.call(this);
});
