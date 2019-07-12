var network = require("../../../../../utils/main.js");
var app = getApp();
Page({
    data: {
        status: ''
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function () {
        var that = this;
        that.getCerStatus();  
    },
    getCerStatus() {
        var that = this;
        network.POST({
            url: 'v12/my-should/user-certification',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        status: res.data.data[0].status
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
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    }
})