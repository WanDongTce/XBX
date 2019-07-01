const network = require("../../../utils/main.js");
var md5 = require("../../../utils/md5.js");
var app = getApp();


var regMobile = /^1(3|4|5|7|8)\d{9}$/;
var regPassw = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
var c = 60;

Page({

    data: {
        menu_content_left: true,
        menu_content_right: false,
        passwordimg_left: '../../../images/see_off.png',
        passwordimg: '../../../images/see_off.png',
        passwordtype_left: 'password',
        passwordtype: 'password',

        user_left_phone: '',
        user_left_password: '',

        user_right_phone: '',
        user_right_password: '',

        verifyCodeTime: "获取验证码",
        verify_color: false,

        base:'../../../',

    },
    onLoad: function (options) {
        this.setData({
            appverson: app.appverson,
            logoimg: app.logoimg
        })
        network.getAllAdress();
        
    },
    onShow: function () {

    },
    //输入左侧的电话
    user_left_phone: function (e) {
        this.setData({
            user_left_phone: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    //输入左侧的密码
    user_left_password: function (e) {
        this.setData({
            user_left_password: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    //点击左侧的登录
    click_left_login: function (e) {
        var that = this;
        var user_left_phone = that.data.user_left_phone;
        var user_left_password = that.data.user_left_password;
        if (user_left_phone.length == 0 || user_left_password.length == 0) {
            wx.showToast({
                title: '不能为空',
                icon: 'none',
                duration: 1000
            })
        }
        else if (!(/^1(3|4|5|7|8)\d{9}$/.test(user_left_phone))) {
            wx.showToast({
                title: '手机号不合法',
                image: '../../../images/error.png',
                duration: 1000
            })
        }
        else {
            network.POST({
                url: 'v11/login/index',
                params: {
                    "mobile": user_left_phone,
                    "password": md5.hexMD5(user_left_password),
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


    //输入右侧的电话
    user_right_phone: function (e) {
        this.setData({
            user_right_phone: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    //输入右侧的密码
    user_right_password: function (e) {
        this.setData({
            user_right_password: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    //点击右侧的注册
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
                        // var a = res.data.data[0];
                        // wx.setStorage({
                        //     key: 'userInfo',
                        //     data: a
                        // });
                        // app.userInfo = a;
                        // if (a.step == 8) {
                        //     wx.switchTab({
                        //         url: '/pages/main/pages/home/home'
                        //     });
                        // } else {
                        //     wx.navigateTo({
                        //         url: '/pages/common/presonalInfo/presonalInfo'
                        //     });
                        // }
                      network.POST({
                        url: 'v11/login/index',
                        params: {
                          'mobile': phone,
                          'password': md5.hexMD5(password),
                          "version_number": "0",
                          "lng": '',
                          "lat": '',
                          "login_source": 1
                        },
                        success: function (resnew) {
                          wx.hideLoading();
                          //   console.log(res);
                          if (resnew.data.code == 200) {
                            var a = resnew.data.data[0];
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
    //验证码
    identify: function (e) {
        var that = this;
        if (!that.data.verify_color) {
            var user_right_phone = that.data.user_right_phone;
            var intervalId = null;

            if (!regMobile.test(user_right_phone)) {
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
                that.sendCode(user_right_phone);
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
    //点击切换
    tab_topbox_left: function () {
        var that = this;
        that.setData({
            menu_content_left: true,
            menu_content_right: false,
        })
    },
    tab_topbox_right: function () {
        var that = this;
        that.setData({
            menu_content_left: false,
            menu_content_right: true,
        })
    },

    //点击密码图片
    passwordimg: function () {
        var that = this;
        if (that.data.passwordtype == 'password') {
            that.setData({
                passwordimg: '../../../images/see_on.png',
                passwordtype: 'text',
            })
        }
        else {
            that.setData({
                passwordimg: '../../../images/see_off.png',
                passwordtype: 'password',
            })
        }
    },
    passwordimg_left: function () {
        var that = this;
        if (that.data.passwordtype_left == 'password') {
            that.setData({
                passwordimg_left: '../../../images/see_on.png',
                passwordtype_left: 'text',
            })
        }
        else {
            that.setData({
                passwordimg_left: '../../../images/see_off.png',
                passwordtype_left: 'password',
            })
        }
    },
    toAgrmt: function () {
        wx.navigateTo({
            url: '/pages/common/agremt/agremt'
        })
    },
})