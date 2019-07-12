var network = require("../../../../utils/main.js");
var app = getApp();



Page({
    data: {
        showEmpty: false,
        list: []
    },
    onLoad() {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
    },
    onShow: function () {
        var that = this;
        that.getList();
    },
    getList: function () {
        var that = this;
        network.POST({
            url: 'v11/baike/my-about-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data;
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
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
    del(e){
        var that = this;
        network.POST({
            url: 'v11/baike/about-delete',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": e.currentTarget.dataset.id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.getList();
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
    toDetail: function (e) {
        var a = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/find/pages/encyDetail/encyDetail?id=' + a
        });
    }
})