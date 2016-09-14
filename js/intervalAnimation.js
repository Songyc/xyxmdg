// 图片动画模块
var fn = {},
    intervalAnimationObject = {},
    swiperList = [];

$.extend(fn, {
    cleanAllIntervalAnimation: function (pageSelector) {
        var pageIntervalAnimation = intervalAnimationObject[pageSelector],
            timer;

        if (!pageIntervalAnimation) {
            return;
        }

        for (var key in pageIntervalAnimation) {
            if (!pageIntervalAnimation[key]) {
                continue;
            }
            if (pageIntervalAnimation[key] && (timer = pageIntervalAnimation[key].timer)) {
                clearInterval(timer);
            }
        }

        var animationUls = document.querySelectorAll(pageSelector + ' ' + '.interval-animation'),
            ul, li, item;

        for (var i = 0, l = animationUls.length; i < l; i++) {
            ul = animationUls[i];
            cur = ul.querySelector('li.cur');
            item = ul.querySelectorAll('li').item(0);
            cur && cur.classList.remove('cur');
            item && item.classList.add('cur');
        }
    },

    setAllIntervalAnimation: function (pageSelector) {
        var pageIntervalAnimation = intervalAnimationObject[pageSelector];

        if (!pageIntervalAnimation) {
            intervalAnimationObject[pageSelector] = pageIntervalAnimation = {};
        }

        var animationUls = document.querySelectorAll(pageSelector + ' ' + '.interval-animation'),
            ul, name, timer;

        for (var i = 0, l = animationUls.length; i < l; i++) {
            ul = animationUls[i];

            for (var j = 0, m = ul.classList.length; j < m; j++) {
                if (/^(.+)s$/.test(ul.classList[j])) {
                    name = RegExp.$1;
                    timer = fn.createIntervalAnimation(ul);

                    if (!pageIntervalAnimation[name]) {
                        pageIntervalAnimation[name] = {};
                    }

                    pageIntervalAnimation[name] = {
                        timer: timer,
                        name: name,
                        ul: ul
                    };

                    break;
                }
            }
        }
    },

    createIntervalAnimation: function(ul) {
        if (!ul) {
            return;
        }

        var index = 0,
            timer, cur, item,
            li = ul.querySelectorAll('li');

        timer = setInterval(function() {
            cur = ul.querySelector('.cur');
            item = li.item(++index) || li.item(index = 0);

            cur && cur.classList.remove('cur');
            item.classList.add('cur');
        }, 500);

        return timer;
    }
});