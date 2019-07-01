const network = require("../../../../../utils/main.js");
const app = getApp();


Page({
    data: {
        base: '../../../../../',
        tabs: [{ index: 0, title: '积分使用', width: '30%' }, { index: 1, title: '积分获取', width: '30%' }],
        curIndex: 0,
        use_note: '',
        get_note: ''
    },
    onLoad(){
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    swiTab: function (e) {
        var a = e.currentTarget.dataset.index;
        this.setData({
            curIndex: a
        });
    },
    onShow: function () {
        var that = this;
        that.getInstructions();
    },
    getInstructions: function () {
        var that = this;
        network.POST({
            url: 'v14/shop-point/rules',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        use_note: res.data.data[0].use_that,
                        get_note: res.data.data[0].get_that
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
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    }
})