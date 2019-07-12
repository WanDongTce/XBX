// pages/my/pages/myOrder/myOrderDetail/myOrderDetail.js
const network = require("../../../../../utils/main.js");
const app = getApp();
var order_sn = '';
Page({
    data: {
        list: [],
        order_sn: '',
        nodata: 1
    },
    onLoad: function (options) {
        //   console.log(options.ordersn)
        order_sn = options.ordersn;
        this.getList();
    },
    getList: function () {
        var that = this;
        network.POST({
            url: 'v13/shop-order/details',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "order_sn": order_sn
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        list: res.data.data[0].item,
                        nodata: 2
                    });
                } else {
                    that.setData({
                        nodata: 1,
                    })
                    console.log(that.data.nodata)
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            fail: function () {
                wx.hideLoading();
                that.setData({
                    nodata: 1
                })
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    cancelOrder(e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确认取消吗？',
            success: function (res) {
                if (res.confirm) {
                    network.POST({
                        url: 'v13/shop-order/order-close',
                        params: {
                            "mobile": app.userInfo.mobile,
                            "token": app.userInfo.token,
                            "order_sn": order_sn,
                            "reject_remark": ''
                        },
                        success: function (res) {
                            // console.log(res);
                            wx.hideLoading();
                            if (res.data.code == 200) {
                                wx.showToast({
                                    title: '已取消',
                                    icon: 'none',
                                });
                                that.getList();
                            } else {
                                wx.showToast({
                                    title: res.data.message,
                                    icon: 'none',
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
                } else if (res.cancel) { }
            }
        });
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
                that.pay();
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
            that.pay();
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
                "idsn": order_sn,
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
                            url: '/pages/my/pages/memberRenewalNew/memberRenewalNew',
                        })
                    }, function () {
                        wx.showToast({
                            title: '未支付成功',
                            icon: 'success',
                            duration: 3000
                        });
                        wx.navigateTo({
                            url: '/pages/my/pages/myOrder/myOrder?index=1'
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
    },
})