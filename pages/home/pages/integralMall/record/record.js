const network = require("../../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = '';
Page({
    data: {
        base: '../../../../../',
        itemList: [],
        totalPoint: '',    //总积分
        showEmpty: false
    },
    onLoad: function (options) {
        var that = this;
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
        that.getItemList();
    },
    getItemList: function () {
        var that = this;
        network.POST({
            url: 'v14/shop-point/order-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "status": 0,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = that.data.itemList.concat(res.data.data[0].list);
                    that.setData({
                        itemList: a,
                        showEmpty: a.length == 0? true: false
                    });
                    //   console.log(that.data.totalPoint);
                    hasmore = res.data.data[0].hasmore;
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
    onReachBottom: function () {
        var that = this;
        if (that.data.itemList.length > 0){
            if (hasmore) {
                page++;
                that.getItemList();
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    onUnload: function(){
        page = 1;
        hasmore = '';
        this.setData({
            showEmpty: false
        });
    }
})