var network = require("../../../../utils/main.js");
var app = getApp();
var id = '';

Page({
    data: {
        base: '../../../../',
        info: '',
        flag: ''
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        id = options.id;
        this.setData({
            flag: options.flag
        });
    },
    onShow: function () {
        var that = this;
        that.getDetail();
    },
    getDetail() {
        var that = this;
        network.POST({
            url: 'v14/task/task-details',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "taskreceiveid": id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0];
                    that.setData({
                        info: a
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
    receiveReward() {
        var that = this;
        network.POST({
            url: 'v14/task/receive-reward',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "taskreceiveid": that.data.info.item.taskreceiveid
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '领取成功',
                        success: function(){
                            wx.switchTab({
                                url: '/pages/main/pages/task/task'
                            });
                        },
                        icon: 'none'
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
    joinProcess(e) {
        var that = this;
        var a = e.currentTarget.dataset;
        network.POST({
            url: 'v14/task/join-process',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "type": a.type,
                "taskreceiveid": id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.switchTab({
                        url: '/pages/main/pages/task/task'
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
    }
})