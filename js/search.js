// 摩登girl模块
var url = 'http://play9.pclady.com.cn/lady160310/action/enrolllist.jsp?schoolId=1&search=39&callback=enrollist',
    humanUrl = 'http://play9.pclady.com.cn/lady160310/action/enrolllist.jsp?schoolId=1&search=39',          // 人气地址
    recentUrl = 'http://play9.pclady.com.cn/lady160310/action/enrolllist.jsp';         // 最新地址
    callback = 'enrollist',
    swiperList = [];

$.extend(fn, {
    ajax: function (url, obj) {
        $.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(data) {
                fn.joinString(data);
            },
            error: function(e) {}
        });
    },
    // 初始化当前swiper
    initSwiper2: function (force) {
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
        if (!data) {
            return;
        }

        if (!data.enrolls || !data.enrolls.length) {
            return;
        }

        var str = '',
            item, l = data.enrolls.length,
            pageNumber, curPageNumber,
            swiperContainer = document.querySelector('.swiper-container2 .swiper-wrapper');

        for (var i = 0; i < l; i++) {
            item = data.enrolls[i];

            if (i % 4 === 0) {
                str += '<div class="swiper-slide">';
            }

            str +=
                '<div class="item">' +
                '<div class="pic">' +
                '<img src="' + item.photo + '" data-src="' + item.photo + '" class="swiper-lazy" alt="">' +
                '<p class="md-girl">' +
                '<span>摩登Girl NO.' + item.enrollId + '</span>' +
                '</p>' +
                '</div>' +
                '<div class="info vote-box">' +
                '<div class="name">' + item.name + '</div>' +
                '<i class="vote"></i>' +
                '<span class="number">' + item.votes + '</span>' +
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
            fn.countPage();

            fn.initSwiper2(true);
        }
    },

    tips: function (selector) {
        $(selector).addClass('cur');

        setTimeout(function () {
            $(selector).removeClass('cur');
        }, 1500);
    }
});

// jsonp回调函数
function enrollist(data) {
    fn.joinString(data);
}

// 点赞
$(document).delegate('.vote', 'click', function (e) {
    if(!$(this).hasClass('cur')) {
        var number = $(this).parent().find('.number');
        $(number).text( parseFloat($(number).text()) + 1 );
        $(this).addClass('cur');
        fn.tips('.tips .vote-li');
    }
});

// 返回
$('.m-item2 .small-back').click(function () {
    $('.m-item2 .masker').removeClass('cur');
    setTimeout(function () {
        $('.m-item2 .masker').hide()
    }, 300);
});

// 人气，最新, 搜索
$(document).delegate('.sort-search span', 'click', function (e) {
    var commonUrl = url,
        value = '';

    $(this).parents('.sort-search').find('span.cur').removeClass('cur');
    $(this).addClass('cur');

    if($(this).hasClass('search-icon')) {
        commonUrl = commonUrl;
        value = $(this).siblings('.search').val();
    } 

    if($(this).hasClass('recent')) {
        commonUrl = recentUrl;
    }

    if($(this).hasClass('human')) {
        commonUrl = humanUrl;
    }

    fn.ajax(commonUrl, {search: value || '', callback: callback, schoolId: 1});
});

$(document).delegate('.swiper-container2 .item img', 'click', function (e) {
   $('.m-item2 .masker').show();
   setTimeout(function (){
        $('.m-item2 .masker').addClass('cur');
   }, 0);
   fn.draw();
});
