var network = require("../../../../utils/main.js")
var app = getApp();

var page = 1;
var hasmore = '';

Page({
    data: {
        IMGURL: app.imgUrl,
        list: [],
        showEmpty: false
    },
    onLoad: function(options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
        this.setData({
            idname:app.idname
        })
    },
    onShow(){
        var that = this;
        that.getList(false);
    },
    getList: function(flag) {
        var that = this;
        network.POST({
            url: "v14/card-bag/card-list",
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page
            },
            success: function(res) {
                // console.log(res);
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
                    // console.log(that.data.list);
                    hasmore = res.data.data[0].hasmore;
                }
            },
            fail: function() {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        })
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
    useCard(e){
        var that = this;
        var a = e.currentTarget.dataset;
        network.POST({
            url: "v14/card-bag/use-card",
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "card": a.card,
                "sequence": a.sequence
            },
            success: function (res) {
                console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    page = 1;
                    that.getList(false);
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
        })
    },
    onUnload(){
        page = 1;
        hasmore = '';
    }
})