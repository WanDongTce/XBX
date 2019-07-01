// pages/my/pages/myOrder/myOrder.js
const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = '';
var flag = false;

Page({

    data: {
        showEmpty: false,
        tabs: [{ index: 0, title: '全部', width: '20%' }, { index: 1, title: '待支付', width: '20%' }, { index: 2, title: '待发货', width: '20%' }, { index: 3, title: '待收货', width: '20%' }, { index: 4, title: '已完成', width: '20%' }],
        tabindex: 1,
        list: [],
    },

    onLoad: function (options) {
        var that = this;
        this.compontNavbar = this.selectComponent("#compontNavbar");
        that.setData({
            tabindex: 0
        })
        that.getList(0, page, flag);
    },
    onShow: function () {

    },
    swiTab: function (e) {
        var that = this;
        var a = e.currentTarget.dataset.index;
        page = 1;
        hasmore = '';
        flag = false;
        that.setData({
            tabindex: a,
            list: [],
        });
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        that.getList(a, page, false);
    },
    getList: function (typenum, page, flag) {
        var that = this;
        network.POST({
            url: 'v13/shop-order/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "status": typenum,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (flag) {
                        a = that.data.list.concat(a);
                    }
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
                    })
                    hasmore = res.data.data[0].hasmore;
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
    onReachBottom: function () {
        var that = this;
        if (that.data.list.length > 0) {
            if (hasmore) {
                page++;
                that.getList(that.data.tabindex, page, true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                });
            }
        }
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
                            "order_sn": e.currentTarget.dataset.ordersn,
                            "reject_remark": ''
                        },
                        success: function (res) {
                            // console.log(res);
                            wx.hideLoading();
                            if (res.data.code == 200) {
                                wx.showToast({
                                    title: '已取消'
                                });
                                page = 1;
                                hasmore = '';
                                flag = false;
                                that.setData({
                                    tabindex: 0,
                                    list: [],
                                });
                                wx.pageScrollTo({
                                    scrollTop: 0,
                                    duration: 0
                                });
                                that.getList(0, page, flag);
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
                } else if (res.cancel) { }
            }
        });
    },

    judgeLogin: function (e) {
        var that = this;
        app.showLoading();
        var that = this;
        that.setData({
            ordersn_pay: e.currentTarget.dataset.ordersn
        })
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
                "idsn": that.data.ordersn_pay,
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
    tz_detail: function (e) {
        // console.log(e.currentTarget.dataset.ordersn)
        wx.navigateTo({
            url: '/pages/my/pages/myOrder/myOrderDetail/myOrderDetail?ordersn=' + e.currentTarget.dataset.ordersn,
        })
    },
})