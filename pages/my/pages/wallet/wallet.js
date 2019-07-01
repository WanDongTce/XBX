var network = require("../../../../utils/main.js");
var app = getApp();


Page({
    data: {
        account: {}
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function () {
        var that = this;
        network.getUserBankCard();
        that.getAccount();
    },
    getAccount: function () {
        var that = this;
        network.POST({
            url: 'v12/my-should/user-account',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0];
                    that.setData({
                        account: a
                    });
                    app.account = a;
                    // console.log(a);
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
    toRecharge(){
        wx.showToast({
            title: '敬请期待'
        });
        // wx.navigateTo({
        //     url: '/pages/my/pages/recharge/recharge'
        // })
    },
    toTrading(){
        wx.navigateTo({
            url: '/pages/my/pages/tradingList/tradingList'
        })
    }
})