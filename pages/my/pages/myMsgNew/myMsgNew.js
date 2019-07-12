var network = require("../../../../utils/main.js");
var app = getApp();


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
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v9/message/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;                   
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
    onReachBottom: function () {
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
    // onUnload() {
    //     this.setData({
    //         showEmpty: false
    //     });
    //     page = 1;
    //     hasmore = null;
    // },
    toDetail: function (e) {
        var a = e.currentTarget.dataset.msgtype;
        wx.navigateTo({
            url: "/pages/my/pages/myMsgNew/myMsgDetail/myMsgDetail?msgtype=" + a
        });
    },
    
})