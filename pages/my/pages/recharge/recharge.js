const network = require("../../../../utils/main.js");
const md5 = require("../../../../utils/md5.js");
const app = getApp();
var password = '';

Page({
    data: {
        rechargeType: null, //0:银行卡，1:支付宝， 2:微信
        showPwd: false,
        total: 0
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        
    },
    saveMoney(e){
        this.setData({
            total: e.detail.value.replace(/^\s*|\s*$/, '')
        });
    },
    checkPayMethod(e) {
        var that = this;
        var a = e.currentTarget.dataset.type;
        that.setData({
            rechargeType: a
        });
    },
       
    next() {
        var that = this;
        if (that.data.rechargeType === null) {
            wx.showToast({
                title: "请选择支付方式"
            })
        } else {
            that.recharge()
        }
    },
    recharge() {
        var that = this;
        var total = that.data.total;
        console.log(that.data.rechargeType)
        console.log(total)
        if(total >= 10){
            network.POST({
                url: 'v12/pay/recharge',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "total": that.data.total,
                    "type": that.data.rechargeType,
                    
                },
                success: function (res) {
                    // console.log(res);
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        wx.showToast({
                            title: '充值成功',
                            success: function () {
                                wx.navigateTo({
                                    url: '/pages/my/pages/wallet/wallet'
                                })
                            }
                        })

                    } else {
                        wx.showToast({
                            title: res.data.message
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
        }else{
            wx.showToast({
                title: '金额不少于10元',
                icon: 'none',
            })
        }
    },
    judgeLogin: function (e) {
        var that = this;
        app.showLoading();
        var that = this;
        var a = e.detail;
        if (a.errMsg == 'getUserInfo:fail auth deny') {
            wx.hideLoading();
            wx.showToast({
                title: '需要您授权',
                icon: 'none'
            });
        } else {
            wx.hideLoading();
            if (app.openId) {
                // that.createOrder();
            }
            else {
                that.wxLogin();
            }

        }

    },

    wxLogin() {
        var that = this;
        network.wxLogin(function () {
            that.getOpenid();
        });
    },
    getOpenid: function () {
        var that = this;
        network.getOpenid(function () {
            // that.createOrder();
        });

    },
    createOrder() {
        var that = this;
        network.POST({
            url: 'v14/renewal/create-order',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "month": 1,
                "order_type": 5,
                // "order_type_id": 0,
            },
            success: function (res) {
                console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        payinfo: res.data.data[0].item
                    });
                    console.log(that.data.payinfo)
                    that.pay();
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
                    image: '../../../images/error.png',
                    duration: 1000
                })
            }
        });
    },
    pay: function (e) {
        console.log('pay_function')
        var that = this;
        network.POST({
            url: 'v13/shop-pay/order',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "idsn": that.data.payinfo.order_sn,
                "type": 3,
                "openid": app.openId
            },
            success: function (res) {
                console.log(res);
                // var a = res.data.data[0];
                wx.hideLoading();
                if (res.data.code == 200) {
                    network.wxPay(res.data.data[0], function (res) {
                        // console.log(res);
                        wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 3000
                        });
                        wx.navigateTo({
                            url: '/pages/home/home',
                        })
                    });

                } else {
                    wx.showToast({
                        title: res.data.message
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
    }
    
})