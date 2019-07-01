const network = require("../../../utils/main.js");
var md5 = require("../../../utils/md5.js");
var app = getApp();
// console.log(app);

Page({
    data: {
        base: '../../../',
        IMGURL: app.imgUrl,
        username: '',
        password: ''
    },
    onLoad: function (options) {
        network.getAllAdress();
    },
    userNameInput: function (e) {
        this.setData({
            username: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    passWordInput: function (e) {
        this.setData({
            password: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    loginBtnClick: function () {
        var that = this;
        var username = that.data.username;
        var password = that.data.password;

        if (username.length == 0 || password.length == 0) {
            wx.showToast({
                title: '不能为空',
                icon: 'none',
                duration: 1000
            })
        }
        else if (!(/^1(3|4|5|7|8)\d{9}$/.test(username))) {
            wx.showToast({
                title: '手机号不合法',
                icon: 'none',
                duration: 1000
            })
        }
        else {
            network.POST({
                url: 'v11/login/index',
                params: {
                    "mobile": username,
                    "password": md5.hexMD5(password),
                    "version_number": "0",
                    "lng": '',
                    "lat": '',
                    "login_source": 1
                },
                success: function (res) {
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        var a = res.data.data[0];
                        wx.setStorage({
                            key: 'userInfo',
                            data: a
                        });
                        app.userInfo = a;

                        if (a.step == 8) {
                            wx.switchTab({
                                url: '/pages/main/pages/home/home'
                            });
                        } else {
                            wx.navigateTo({
                                url: '/pages/common/presonalInfo/presonalInfo'
                            });
                        }
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
    tz_forget: function (options) {
        wx.navigateTo({
            url: '/pages/common/forget_password/forget_password'
        })
    },
    tz_register: function (options) {
        wx.navigateTo({
            url: '/pages/common/register/register'
        })
    }
})