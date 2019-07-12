const network = require("../../../utils/main.js");
const app = getApp();
var url = '';

Page({
    data: {
        base: '../../../',
        list: []
    },
    onLoad(options) {
        // console.log(options);
        var flag = options.flag;
        this.compontNavbar = this.selectComponent("#compontNavbar");
        if (flag) {
            wx.setStorageSync('enterAddressListFlag', flag);
        } else {
            flag = wx.getStorageSync('enterAddressListFlag');
        }
        if (flag == 1) {
            url = '/pages/home/pages/integralMall/settlement/settlement';  
        } else if (flag == 2) {
            url = '/pages/home/pages/periphery/confirmOrder/confirmOrder';
        } else if (flag == 3) {
            url = '/pages/my/pages/myGift/myGift';
        } else {
            console.log('从管理地址页退回');
        }
    },
    onShow: function() {
        var that = this;
        that.getAddrList();
    },
    getAddrList: function() {
        var that = this;
        network.POST({
            url: 'v13/user-address/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function(res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        list: res.data.data[0].list
                    });

                    if (res.data.data[0].list.length == 0 && wx.getStorageSync('receivingAddress')) {
                        wx.removeStorageSync('receivingAddress');
                    }
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
                }
            },
            fail: function() {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    selectClick: function(e) {
        var id = e.currentTarget.dataset.id;
        var that = this;
        network.POST({
            url: 'v13/user-address/default',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "ad_id": id
            },
            success: function(res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.getAddrList();
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
                }
            },
            fail: function() {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    catchTapEdit: function(e) {
        // console.log(e.currentTarget.dataset.item);
        wx.setStorageSync('editAddress', e.currentTarget.dataset.item);
        wx.navigateTo({
            url: '/pages/common/editAddress/editAddress',
            complete(err) {
                // console.log(err);
                if (err.errMsg == 'navigateTo:fail webview count limit exceed') {
                    app.webViewLimitate();
                }
            }
        });
    },
    catchTapDel: function(e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '是否删除该地址？',
            success: function(res) {
                if (res.confirm) {
                    network.POST({
                        url: 'v13/user-address/del',
                        params: {
                            "mobile": app.userInfo.mobile,
                            "token": app.userInfo.token,
                            "ad_id": e.currentTarget.dataset.id
                        },
                        success: function(res) {
                            //   console.log(res);
                            wx.hideLoading();
                            if (res.data.code == 200) {
                                that.getAddrList();
                            } else {
                                wx.showToast({
                                    title: res.data.message,
                                    icon: 'none',
                                    duration: 1000
                                })
                            }
                        },
                        fail: function() {
                            wx.hideLoading();
                            wx.showToast({
                                title: '服务器异常',
                                icon: 'none',
                                duration: 1000
                            })
                        }
                    });
                } else if (res.cancel) {}
            }
        })
    },
    useAddr: function(e) {
        this.goback(e);
    },
    goback(e) {
        var that = this;
        wx.setStorageSync('receivingAddress', e.currentTarget.dataset.item);
        wx.navigateTo({
            url: url,
            complete(err) {
                // console.log(err);
                if (err.errMsg == 'navigateTo:fail webview count limit exceed') {
                    app.webViewLimitate();
                }
            }
        });
    }
})