const network = require("../../../../../utils/main.js");
const app = getApp();
var page = 1;
var flag = false;
var subId = 0;
var hasmore = null;


Page({
    data: {
        tabs: [],
        list: [],
        selectedTab: 0,
        barterList: [],
        showEmpty: false,
        refreshFlag: true,
        base: '../../../../../'
    },
    onLoad: function (options) {
        this.empty = this.selectComponent("#empty");
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function () {
        var that = this;
        if (that.data.refreshFlag){
            that.setData({
                tabs: app.classBarter
            });
            // console.log(app.classBarter)
            that.getList(false);  
        }
    },
    swiScrollTab: function (e) {
        subId = e.currentTarget.dataset.index;
        this.setData({
            selectedTab: subId
        });
        // console.log(subId);
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        page = 1;
        this.getList(false);
    },
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v14/easy-goods/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "type_id": that.data.selectedTab,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (flag) {
                        a = that.data.barterList.concat(a);
                    }
                    that.setData({
                        barterList: a,
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
        if (that.data.barterList.length > 0 && !that.data.isShowFullImg){
            if (hasmore) {
                page++;
                that.getList(true);
            } else{
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    previewImg(e) {
        this.setData({
            refreshFlag: false
        });
        // console.log(e);
        var a = e.currentTarget.dataset;
        // console.log(a);
        var b = [];
        for (var i = 0; i < a.imgs.length; i++) {
            b.push(a.imgs[i].url);
        }

        network.previewImg(a.img, b);
    },
    tz_detail: function (e) {
        wx.navigateTo({
            url: '/pages/home/pages/barter/barterDetail/barterDetail?id=' + e.currentTarget.dataset.myid
        })
    },
    onUnload: function(){
        this.setData({
            showEmpty: false
        });
    }
})