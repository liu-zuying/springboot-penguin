/**
 * 模块JavaScript
 */
var app = {
    data:{
        nowTime: null
    },
    // 封装相关的ajax的url
    URL: {
        now: function () {
            return "/time/now";
        },
        checkLoginUrl: function () {
            return "/account/api/login";
        },
        logoutUrl: function () {
            return "/account/logout";
        },
        homeUrl: function () {
            return "/";
        },
        problemsetUrl: function () {
            return "/problemset/list";
        },
        contestIndexUrl: function () {
            return "/contest/index";
        },
        contestDetailUrl: function () {
            return "/contest/";
        },
        updateAccountUrl: function () {
            return "/account/api/updateAccount";
        },
        updatePasswordUrl: function () {
            return "/account/api/updatePassword";
        },
        submitGradeUrl: function () {
            return "/grade/api/submitContest"
        },
        addPostUrl: function () {
            return "/post/api/addPost"
        },
        updatePostUrl: function () {
            return "/post/api/updatePost"
        },
        deletePostUrl: function () {
            return "/post/api/deletePost/";
        },
        discussUrl: function () {
            return "/discuss";
        },
        addCommentUrl: function () {
            return "/comment/api/addComment";
        },
        addReplyUrl: function () {
            return "/reply/api/addReply";
        },
        myDiscussPostUrl: function () {
            return "/account/myDiscussPost";
        },
        myExamUrl: function () {
            return "/account/myExam";
        },
    },
    /**
     * 全局初始化:服务器时间获取,登录功能,退出登录
     */
    init: function () {
        $.get(app.URL.now(), {}, function (result) {
            if (result && result['success']) {
                //console.log(result['data']);
                app.data.nowTime = app.toTimeStamp(result['data']);
                console.log("服务器当前的时间==========" + app.data.nowTime);
            } else {
                console.log('结果:' + result);
                console.log('result' + result);
            }
        });
        /**
         * 服务器时间动态显示
         */
        window.setInterval("app.run();", 1000);
        /**
         * 记住登录开关效果
         */
        $('.ui.toggle.checkbox').checkbox();
        /**
         * 登录模态框关闭按钮触发
         */
        $('#loginModalCloseButton').click(function (e) {
            $('#loginModal').modal('hide');
        });
        /**
         * 登录模态框登录按钮触发
         */
        $('#loginModalSubmitButton').click(function (e) {
            app.checkLogin();
        });
        /**
         * 退出登录
         */
        $('#logout').click(function (e) {
            window.location.href = app.URL.logoutUrl();
        });
        /**
         * 登录错误提示消息可关闭
         */
        $('#loginModalErrorMessage,.close').on('click', function() {
            $(this).closest('#loginModalErrorMessage').transition('fade');
            //$('#loginModalErrorMessage').addClass('hidden');
        });
    },
    convertTime: function (localDateTime) {
        var year = localDateTime.year;
        var monthValue = localDateTime.monthValue;
        var dayOfMonth = localDateTime.dayOfMonth;
        var hour = localDateTime.hour;
        var minute = localDateTime.minute;
        var second = localDateTime.second;
        return year + "-" + monthValue + "-" + dayOfMonth + " " + hour + ":" + minute + ":" + second;
    },
    toTimeStamp: function (localDateTime) {
        var currTime = localDateTime.year + "-" + localDateTime.monthValue
            + "-" + localDateTime.dayOfMonth + " " + localDateTime.hour
            + ":" + localDateTime.minute + ":" + localDateTime.second;
        //console.log("currTime = " + currTime);
        //console.log("new Date(currTime).valueOf() = " + new Date(currTime).valueOf());
        return new Date(currTime).valueOf();
    },
    /**
     * 时间戳转化为年 月 日 时 分 秒
     * number: 传入时间戳
     * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
     */
    formatTime: function (number, format) {

        var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
        var returnArr = [];

        var date = new Date(number);
        returnArr.push(date.getFullYear());
        returnArr.push(app.formatNumber(date.getMonth() + 1));
        returnArr.push(app.formatNumber(date.getDate()));

        returnArr.push(app.formatNumber(date.getHours()));
        returnArr.push(app.formatNumber(date.getMinutes()));
        returnArr.push(app.formatNumber(date.getSeconds()));

        for (var i in returnArr) {
            format = format.replace(formateArr[i], returnArr[i]);
        }
        return format;
    },
    formatNumber: function (n) {
        n = n.toString();
        return n[1] ? n : '0' + n;
    },
    /**
     * 服务器时间
     */
    run: function () {
        this.data.nowTime = this.data.nowTime + 1000;
        //console.log("this.data.nowTime = " + this.data.nowTime);
        document.getElementById("current_server_timer").innerHTML =
            app.formatTime(this.data.nowTime, "Y-M-D h:m:s");
    },
    /**
     * 登录模态框显示
     */
    showLogin: function() {
        var username = $.cookie('penguinUsername');
        var password = $.cookie('penguinPassword');
        $('#username').val(username);
        $('#password').val(password);
        $('#loginModal').modal({
            /**
             * 必须点击相关按钮才能关闭
             */
            closable  : false,
            /**
             * 模糊背景
             */
            blurring: true,
        }).modal('show');
    },
    /**
     * 验证用户名和密码是否合法
     */
    checkUsernameAndPassword: function (username, password) {
        if (username == null || username == ''
            || username.replace(/(^s*)|(s*$)/g, "").length == 0) {
            $('#loginModalErrorMessage').html('<i class="close icon"></i><div class="header">错误提示</div>\n' +
                '                <p>'+'账号不能为空'+'</p>');
            $('#loginModalErrorMessage').removeClass('hidden');
            return false;
        }
        if (password == null || password == ''
            || password.replace(/(^s*)|(s*$)/g, "").length == 0) {
            $('#loginModalErrorMessage').html('<i class="close icon"></i><div class="header">错误提示</div>\n' +
                '                <p>'+'密码不能为空'+'</p>');
            $('#loginModalErrorMessage').removeClass('hidden');
            return false;
        }
        return true;
    },
    /**
     * 验证登录
     */
    checkLogin: function () {
        var username = $('#username').val();
        var password = $('#password').val();
        if (app.checkUsernameAndPassword(username, password)) {
            //调用后端API
            $.post(app.URL.checkLoginUrl(), {
                username: username,
                password: password
            }, function (result) {
                // console.log("result.success = " + result.success);
                // console.log("result.success = " + result['success']);
                // console.log(result);
                if (result && result['success']) {
                    if ($('#rememberMe').is(":checked")) {
                        // 把账号信息记入cookie
                        $.cookie('penguinUsername', username, {expires: 7, path: '/'});
                        $.cookie('penguinPassword', password, {expires: 7, path: '/'});
                    }
                    // 验证通过 刷新页面
                    window.location.reload();
                } else {
                    $('#loginModalErrorMessage').html('<i class="close icon"></i><div class="header">错误提示</div>\n' +
                        '                <p>'+result.message+'</p>');
                    $('#loginModalErrorMessage').removeClass('hidden');
                }
            }, "json");
        }
    },
};