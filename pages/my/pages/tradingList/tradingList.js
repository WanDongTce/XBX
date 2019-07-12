const network = require("../../../../utils/main.js");
const app = getApp();
var page= 1;
var limit = 20;
var hasmore = '';


Page({
    data: {
        list: [],
        showEmpty: false
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
    },
    onShow: function () {
        var that = this;
        that.getList(false);
    },
    getList(flag){
        var that = this;
        network.POST({
            url: 'v12/my-should/trading-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "limit": limit
            },
            success: function (res) {
                //   console.log(res);
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
                    // hasmore = res.data.data[0].hasmore;
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
    // onReachBottom: function () {
    //     var that = this;
    //     if (that.data.list.length > 0) {
    //         if (hasmore) {
    //             page++;
    //             that.getList(true);
    //         } else {
    //             wx.showToast({
    //                 title: '没有更多了',
    //                 image: '../../../images/error.png',
    //                 duration: 1000
    //             })
    //         }
    //     }
    // },
    onUnload: function () {
        page = 1;
        hasmore = '';
        this.setData({
            showEmpty: false
        });
    }
})