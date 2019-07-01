var network = require("../../../../utils/main.js");
var app = getApp();
var regCard = /^([1-9]{1})(\d{15}|\d{18})$/;
var regMobile = /^1(3|4|5|7|8)\d{9}$/;
var count = 60;
var interval = null;

Page({
    data: {
        card: '',
        uname: app.userInfo.register_realname,
        mobile: '',
        mobileStr: '',
        cardInfo: '',
        status: 1,
        code: '',
        idfCode: '获取验证码',
        isClick: true
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    saveCardNo(e){
        this.setData({
            card: e.detail.value.replace(/^\s*|\s*$/, '')
        });
    },
    saveMobile(e){
        this.setData({
            mobile: e.detail.value.replace(/^\s*|\s*$/, '')
        });
    },
    saveCode(e) {
        this.setData({
            code: e.detail.value.replace(/^\s*|\s*$/, '')
        });
    },
    getCode(){
        var that = this;
        if (that.data.isClick){
            var mobile = that.data.mobile; 
            if (!mobile) {
                wx.showToast({
                    title: '请输入手机号',
                    icon: 'none',
                })
            } else if (!regMobile.test(mobile)) {
                wx.showToast({
                    title: '手机号格式错误',
                    icon: 'none',
                })
            } else {
                that.sendCode(mobile);
                that.setData({
                    isClick: false
                });
                interval = setInterval(function () {
                    count--;
                    that.setData({
                        idfCode: count + 's后重发'
                    })
                    if (count <= 0) {
                        clearInterval(interval);
                        count = 60;
                        that.setData({
                            idfCode: '获取验证码',
                            isClick: true
                        })
                    }
                }, 1000);
            }
        }
    },
    sendCode: function (mobile) {
        network.POST({
            url: 'v12/my-should/bankcard-send-code',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "bmobile": mobile
            },
            success: function (res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '发送成功',
                        duration: 1000
                    });
                    // count = 60;
                    // that.setData({
                    //     idfCode: '获取验证码'
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
        });
    },
    next: function () {
        var that = this;
        var status = that.data.status;
        switch (parseInt(status)){
            case 1:
                that.step1();
                break;
            case 2:
                that.step2();
                break;
            case 3:
                that.step3();
                break;
        }  
    },
    step1(){
        var that = this;
        var uname = that.data.uname;
        var card = that.data.card;
        if (!uname) {
            wx.showToast({
                title: '请输入姓名',
                icon: 'none',
            })
        } else if (!card) {
            wx.showToast({
                title: '请输入卡号',
                icon: 'none',
            })
        } else if (!regCard.test(card)) {
            wx.showToast({
                title: '卡号格式错误',
                icon: 'none',
            })
        } else {
            that.bankcardCheck(card);
        }
    },
    step2() {
        var that = this;
        var mobile = that.data.mobile;

        if (!mobile) {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none',
            })
        } else if (!regMobile.test(mobile)) {
            wx.showToast({
                title: '手机号格式错误',
                icon: 'none',
            })
        } else {
            that.setData({
                status: 3,
                mobileStr: mobile.substr(0, 3) + "*****" + mobile.substr(8)
            });
            wx.setNavigationBarTitle({
                title: '验证手机号'
            });
        }
    },
    step3() {
        var that = this;
        network.POST({
            url: 'v12/my-should/bankcard-add',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "bank_number": that.data.card,
                "bmobile": that.data.mobile,
                "code": that.data.code
            },
            success: function (res) {
                // console.log(res.data.data[0]);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.navigateTo({
                        url: '/pages/my/pages/wallet/wallet'
                    })
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
        }); 
    },
    bankcardCheck(card){
        var that = this;
        network.POST({
            url: 'v12/my-should/bankcard-check',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "bank_number": card
            },
            success: function (res) {
                // console.log(res.data.data[0]);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        status: 2,
                        cardInfo: res.data.data[0]
                    });
                    wx.setNavigationBarTitle({
                        title: '填写银行卡信息'
                    });
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
        });
    },
    onUnload(){
        this.setData({
            card: '',
            uname: '',
            mobile: '',
            mobileStr: '',
            cardType: '',
            status: 1,
            code: '',
            idfCode: '获取验证码',
            isClick: true
        });
        count = 60;
        interval = null;
    },
    onHide(){
        this.onUnload();
    }
})
