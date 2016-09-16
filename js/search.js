// 投票模块
$.extend(fn, {
    vote: function (ele) {
        var url = voteUrl,
            enrollId = $(ele).attr('data-enrollId');

        fn.ajax(url, {
            enrollId: enrollId
        }, function (data) {

            if(parseFloat(data.code) === 1) {
                var number = $(ele).parent('.vote-box').find('.number');
                $(number).text( data.info.votedNum );
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
                '<i class="vote"' + ' data-enrollId="' + item.enrollId + '"></i>' +
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
                            if(data.retCode == 0) {
                                fn.createImg().src = data.files[0].url;
                            }
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
        fn.clearCanvasImg();    
        fn.drawText(context, name, id);

        var picList = [{
                src: src,
                base64: src,
                left: 334,
                top: 548,
                width: 182,
                height: 182,
                border: false
            },
            {
                src: 'http://www1.pclady.com.cn/zt/20160906/xyxmdg/images/p2/wanted.png',
                left: 70,
                top: 0,
                width: 386,
                height: 129,
                border: false
            },
            {
                src: $(this).attr('src'),
                left: 70,
                top: 134,
                width: 376,
                height: 398,
                border: true
            }
        ];

        fn.drawPic(context, picList, canvas, callback);
    },

    drawPic: function (context, picList, canvas, callback) {
        var l = picList.length,
            j = 0, copyPicList = picList;
        
        var ip = 'http://upc.pcauto.com.cn/interface/image2base64.jsp?url=',
            imgPath, count = 0, src;

        function drawImg(obj, callback) {
            var img = new Image;
            img.src = obj.base64;

            img.onload = function () {
                context.beginPath();
                context.drawImage(this, obj.left, obj.top, obj.width, obj.height);
                if(obj.border) {
                    context.lineWidth = 5;
                    context.strokeStyle = '#000';
                    context.strokeRect(obj.left, obj.top, obj.width, obj.height);
                }
                context.fill();
                count++;
                if(count == l) {
                    imgPath = canvas.toDataURL('images/png');
                    var canvasImg = fn.createImg();
                    canvasImg.src = imgPath;
                    callback && callback(imgPath);

                    canvasImg.onload = function () {
                        this.style.opacity = 1;
                    }

                    count = 0;
                }
            }
        }

        function getBase64(obj, callback, jcb) {
            src = obj.src;
            src = ip + src;
            $.ajax({
                url: src,
                data: {},
                dataType: 'jsonp',
                jsonpCallback: jcb,
                cache: true,
                success: function(data) {
                    var dataUrl = data.data;
                    obj.base64 = dataUrl;
                    drawImg(obj, callback);
                },
                error: function(e) {}
            });
        }

        for(var i = 0; i < l; i++) {
            if(picList[i].base64) {
                drawImg(picList[i], callback);
            }else {
                getBase64(picList[i], callback, 'jcb' + i);
            }
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
            img.style.opacity = 0;
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
        context.fillText('N0.' + number, 70, 570 + (l - 2) * 36);
    },

    clearCanvas: function(context) {
        context.clearRect(0, 0, this.width, this.height);
    },

    clearCanvasImg: function () {
        var canvasImg = document.querySelector("#canvasPic");

        if(canvasImg) {
            canvasImg.style.opacity = 0;
        }
    }
});

fn.initAjaxPage();

// jsonp回调函数
// function enrollist(data) {
//     fn.joinString(data);
// }

// 点赞
$(document).delegate('.vote', 'click', function (e) {
    fn.vote(this);
});

// $(document).delegate('.masker .vote-box', 'click', function (e) {
//     fn.vote(this);
// });

// 返回
$('.m-item2 .small-back').click(function () {
    $('.m-item2 .masker').removeClass('cur');
    var number = $(".masker .vote-box .number").text();
    $('.mark').parents('.item').find('.number').text(number);
    $('.mark').removeClass('mark');
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
   $(this).addClass("mark");
   setTimeout(function (){
        $('.m-item2 .masker').addClass('cur');
   }, 0);
   var number = $(this).parents('.item').find('.number').text();
   $(".masker .vote-box").attr('data-enrollId', $(this).attr('data-enrollId'));
   $(".masker .vote-box .number").text(number);
   fn.qrcode.call(this);
});
