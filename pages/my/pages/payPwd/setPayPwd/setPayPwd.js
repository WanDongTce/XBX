var network = require("../../../../../utils/main.js");
var app = getApp();
var c = 60;
var flag = '';

Page({
    data: {
        verifyCodeTime: "获取验证码",
        verify_color: false,
        showPassword: false,
        mobile: '',
        title: ''
    },
    onLoad: function (options) {
        var that = this;
        var a = app.userInfo.mobile.substr(0, 3) + "*****" + app.userInfo.mobile.substr(8);
        this.compontNavbar = this.selectComponent("#compontNavbar");
        that.setData({
            mobile: a
        });

        flag = options.flag;
        if (flag == 1) {
            this.setData({
                title: '设置支付密码'
            });
        } else {
            this.setData({
                title: '找回支付密码'
            });
        }

    },
    identify: function (e) {
        var that = this;
        if (!that.data.verify_color) {
            var intervalId = null;
            intervalId = setInterval(function () {
                c--;
                that.setData({
                    verifyCodeTime: c + 's后重发',
                    verify_color: true
                })
                if (c == 0) {
                    clearInterval(intervalId);
                    that.setData({
                        verifyCodeTime: '获取验证码',
                        verify_color: false
                    })
                }
            }, 1000);
            that.sendCode();
        }

    },
    sendCode: function () {
        network.POST({
            url: 'v12/pay-setting/send-code',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '发送成功',
                        duration: 1000
                    })
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
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
        })
    },
    bindFormSubmit: function (e) {
        var vcode = e.detail.value.verifycode.replace(/^\s*|\s*$/, '');
        if (!vcode) {
            wx.showToast({
                title: '请输入验证码',
                icon: 'none',
                duration: 1000
            });
        }
        else {
            network.POST({
                url: 'v12/pay-setting/check-code',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "code": vcode
                },
                success: function (res) {
                    wx.hideLoading();
                    // console.log(res);
                    if (res.data.code == 200) {
                        wx.redirectTo({
                            url: '/pages/my/pages/payPwd/setPayPwdTwo/setPayPwdTwo?flag=' + flag + '&code=' + vcode
                        });
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 1000
                        })
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
            })
        }
    },
    onUnload(){
        flag = '';
        c = 60;
    }
})