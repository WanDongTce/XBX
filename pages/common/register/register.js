const network = require("../../../utils/main.js");
var md5 = require("../../../utils/md5.js");
var app = getApp();
var regMobile = /^1(3|4|5|7|8)\d{9}$/;
var regPassw = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
var c = 60;


Page({
    data: {
        base: '../../../',
        verifyCodeTime: "获取验证码",
        verify_color: false,
        showPassword: false,
        focus: false
    },
    onLoad(){
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    //手机号
    phoneInputEvent: function (e) {
        this.setData({
            mobile: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    //验证码
    identify: function (e) {
        var that = this;
        if (!that.data.verify_color){
            var mobile = that.data.mobile;
            var intervalId = null;

            if (!regMobile.test(mobile)) {
                wx.showToast({
                    title: '手机号不合法',
                    icon: 'none',
                    duration: 1000
                })
            } else {
                that.setData({
                    verify_color: true
                });
                intervalId = setInterval(function () {
                    c--;
                    that.setData({
                        verifyCodeTime: c + 's后重发'
                    })
                    if (c <= 0) {
                        clearInterval(intervalId);
                        c = 60;
                        that.setData({
                            verifyCodeTime: '获取验证码',
                            verify_color: false
                        })
                    }
                }, 1000);
                that.sendCode(mobile);
            }
        }
    },
    sendCode: function (mobile) {
        network.POST({
            url: 'v4/login/sendcode',
            params: {
                "mobile": mobile,
                "type": 3
            },
            success: function (res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '发送成功',
                        duration: 1000,
                        icon: 'none'
                    });
                    // c = 60;
                    // that.setData({
                    //     verifyCodeTime: '获取验证码',
                    //     verify_color: false
                    // })
                } else {
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
        })
    },
    //点击密码图片
    passwordtab: function (e) {
        var that = this;
        var a = that.data.showPassword;
        that.setData({
            showPassword: !a,
            focus: true
        })
    },
    //提交
    bindFormSubmit: function (e) {
        var that = this;
        // 手机号
        var phone = e.detail.value.modify_phone.replace(/^\s*|\s*$/, '');
        // 验证码
        var vcode = e.detail.value.modify_verifycode.replace(/^\s*|\s*$/, '');
        // 密码
        var password = e.detail.value.modify_passw.replace(/^\s*|\s*$/, '');

        if (!regMobile.test(phone)) {
            wx.showToast({
                title: '手机号不合法',
                icon: 'none',
                duration: 1000
            })
        }
        else if (password.length == 0) {
            wx.showToast({
                title: '密码不能为空',
                icon: 'none',
                duration: 1000
            })
        }
        else if (!regPassw.test(password)) {
            wx.showToast({
                title: '密码6-18位，包含至少一个字母和一个数字',
                icon: 'none'
            })
        }
        else if (vcode.length == 0) {
            wx.showToast({
                title: '请输入验证码',
                icon: 'none'
            })
        }
        else {
            network.POST({
                url: 'v11/login/register',
                params: {
                    'mobile': phone,
                    'password': md5.hexMD5(password),
                    'code': vcode
                },
                success: function (res) {
                    wx.hideLoading();
                    //   console.log(res);
                    if (res.data.code == 200) {
                        var a = res.data.data[0];
                        //   console.log(a);
                        wx.setStorage({
                            key: 'userInfo',
                            data: a
                        });
                        app.userInfo = a;

                        wx.navigateTo({
                            url: '/pages/common/login/login'
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
    toAgrmt: function () {
        wx.navigateTo({
            url: '/pages/common/agremt/agremt'
        })
    },
    onUnload(){
        c = 60;
        this.setData({
            verifyCodeTime: '获取验证码',
            verify_color: false
        })
    },
    onHide() {
        this.onUnload();
    }
})