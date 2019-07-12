var network = require("../../../../utils/main.js");
var app = getApp();
var page = 1;
var hasmore = null;

Page({
    data: {
        IMGURL: app.imgUrl,
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
            url: 'v9/message/index',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if(flag){
                        a = that.data.list.concat(a);
                    }
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
                    });

                    hasmore = res.data.data[0].hasmore;
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
    toDetail: function (e) {
        var that = this;
        var a = e.currentTarget.dataset.item;
        // console.log(a);
        var typeid = parseInt(a.resourcetypeid);
        var resourceid = a.resourceid;
        
        if(a.read == 2){
            that.setReaded(a.id);
        }

        switch (typeid) {
            case 1: //作业即答
                var href = a.href.slice(0, a.href.indexOf('?'));
                var p = a.href.slice(a.href.indexOf('?') + 1);
                wx.navigateTo({
                    url: "/pages/common/webView/webView?src=" + href + '&' + p + '&type=1&miniPro=1'
                });
                break;
            case 3:// 申请我的
                if (a.read == 2) {
                    wx.navigateTo({
                        url: '/pages/my/pages/myBarter/myBarter'
                    });
                } else {
                    wx.navigateTo({
                        url: '/pages/my/pages/myBarterDetail/myBarterDetail?id=' + resourceid + '&direction=1'
                    });
                }
                break;
            case 4://我的申请被同意
                wx.navigateTo({
                    url: '/pages/my/pages/myBarterDetail/myBarterDetail?id=' + resourceid + '&direction=2'
                });
                break;
        }
    },
    setReaded: function (id) {
        var that = this;
        network.POST({
            url: 'v9/message/set-read',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "messageid": id
            },
            success: function (res) {
                // console.log(res);
                if (res.data.code == 200) {
                    
                } else {
                    console.log(res.data.message);
                }
            },
            fail: function (err) {
                console.log(err);
            }
        }, true);
    },
    onUnload() {
        this.setData({
            showEmpty: false
        });
        page = 1;
        hasmore = null;
    }
})