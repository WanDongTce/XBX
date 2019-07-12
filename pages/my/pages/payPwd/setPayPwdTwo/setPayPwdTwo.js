var network = require("../../../../../utils/main.js");
var md5 = require("../../../../../utils/md5.js");
var app = getApp();
var code = '';
var titFlag = '';

Page({
    data: {
        password: [],
        showKeyboard: true,
        pwd1: '',
        pwd2: '',
        flag: 2,
        title: ''
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.pwdKeyboard = this.selectComponent("#keyboard");
        code = options.code;
        titFlag = options.flag;
        if (titFlag == 1) {
            this.setData({
                title: '设置支付密码'
            });
        } else {
            this.setData({
                title: '找回支付密码'
            });
        }
    },
    watchPwd(e) {
        // console.log(e);
        var arr = e.detail;
        var that = this;
        that.setData({
            password: arr
        });
        if (arr.length == 6) {
            that.getPwd();
        }
    },
    getPwd(e) {
        var that = this;
        var flag = that.data.flag;
        var pwd = that.data.password.join('');
        // that.hideKeyboard();

        switch (parseInt(flag)) {
            case 2:
                that.setData({
                    pwd1: pwd
                });
                break;
            case 3:
                that.setData({
                    pwd2: pwd
                });
                that.send();
                break;
        }

        flag < 3 && flag++;
        that.setData({
            flag: flag,
            password: []
        });
    },
    send() {
        var that = this;
        network.POST({
            url: 'v12/pay-setting/set-pwd',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "code": code,
                "password1": md5.hexMD5(that.data.pwd1),
                "password2": md5.hexMD5(that.data.pwd2)
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '设置成功',
                        success: function () {
                            wx.redirectTo({
                                url: '/pages/my/pages/wallet/wallet'
                            });
                        }
                    });
                } else {
                    that.setData({
                        password: [],
                        pwd: '',
                        pwd1: '',
                        pwd2: '',
                        flag: 1
                    });
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            fail: function () {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    hideKeyboard() {
        this.setData({
            showKeyboard: false,
            password: []
        });
    },
    showKeyboardFn() {
        this.setData({
            showKeyboard: true
        });
    },
    onUnload(){
        code = '';
        titFlag = '';
        this.setData({
            password: [],
            pwd1: '',
            pwd2: '',
            flag: 2
        });
    }
})