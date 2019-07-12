const network = require("../../../../utils/main.js");
const app = getApp();
var hasmore = '';
var page = 1;
Page({
    data: {
        base: '../../../../',
        list: [],
        showEmpty: false,
        address: '',
        hasAddress: false
    },
    onLoad: function(options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
    },
    onShow: function() {
        this.getList(false);
    },
    getList: function(flag) {
        var that = this;
        network.POST({
            url: 'v13/ngift/receive-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
            },
            success: function(res) {
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
                    });
                    hasmore = res.data.data[0].hasmore;
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
    onReachBottom: function() {
        var that = this;
        if (that.data.list.length > 0) {
            if (hasmore) {
                page++;
                that.getList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    btn_receive: function(e) {
        var that = this;
        var a = wx.getStorageSync('receivingAddress');
        var c = a ? true : false;
        that.setData({
            address: a,
            hasAddress: c
        });
        if (c) {
            // console.log(that.data.hasAddress)
            network.POST({
                url: 'v13/ngift/is-receive',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "receivelogid": e.currentTarget.dataset.receiveid,
                    "ad_id": a.id,
                },
                success: function(res) {
                    // console.log(res);
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        that.getList(false);
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
        } else {
            wx.navigateTo({
                url: '/pages/common/address/address?flag=3'
            })
        }
    },
    onUnload(){
        hasmore = '';
        page = 1;
    }
})