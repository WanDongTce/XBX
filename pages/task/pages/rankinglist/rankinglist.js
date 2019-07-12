var network = require("../../../../utils/main.js");
var app = getApp();
var page = 1;
var hasmore = '';


Page({
    data: {
        base: '../../../../',
        list: []
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function () {
        var that = this;
        that.getRankingList(false);
    },
    getRankingList(flag) {
        var that = this;
        if(!flag) page = 1;
        network.POST({
            url: 'v14/task/ranking-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page
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
                        list: a
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
        if (this.data.list.length > 0) {
            if (hasmore) {
                page++;
                this.getRankingList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    onUnload() {
        page = 1;
        hasmore = '';
    }
})