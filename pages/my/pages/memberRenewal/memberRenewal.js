const network = require("../../../../utils/main.js");
const app = getApp();

Page({
    data: {
        IMGURL: app.imgUrl,
        count: 1,
        info: '',
        renInfo: ''
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function () {
        var that = this;
        that.getUserInfo();
        that.getRenInfo();
    },
    getUserInfo: function () {
        var that = this;
        network.getUserInfo(function (res) {
            wx.hideLoading();
            if (res.data.code == 200) {
                var a = res.data.data[0].item;
                // console.log(a);
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
        });
    },
    getRenInfo(){
        var that = this;
        network.POST({
            url: 'v14/renewal/index',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        renInfo: res.data.data[0].item
                    });
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
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    modfyCountFn(e) {
        var that = this;
        var count = that.data.count;
        var a = e.currentTarget.dataset.flag;
        if (a == 1) {
            if (count > 1) {
                count--;
                that.setData({ count: count });
            }
        } else {
            count++;
            that.setData({ count: count });
        }
    },
    createOrder(){
        var that = this;
        network.POST({
            url: 'v14/renewal/create-order',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "month": that.data.count
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.navigateTo({
                        url: '/pages/my/pages/memberPay/memberPay?info=' + JSON.stringify(res.data.data[0].item)
                    })
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
    onUnload: function () {

    }
})