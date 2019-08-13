const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = null;
var search = '';
var gametype = 0;
var grade = '';//app.userInfo.grade_id;

Page({
    data: {
        base: '../../../../',
        IMGURL: app.imgUrl,
        list: [],
        typeList: [],
        sctdTabIdx: 0,
        showEmpty: false  
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
    },
    onShow: function () {
        var that = this;
        that.getType();
        // that.getList(true); 
      that.component = that.selectComponent("#component")
      that.component.customMethod()
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    getType: function () {
        this.setData({
            typeList: app.studyOptions.game
        });
        // console.log(this.data.typeList);
    },
    getList: function (tabFlag) {
        var that = this;
        network.POST({
            // url: 'v14/study/game-list',
            url: 'v14/study/rec-game-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                // "search": search,
                // "nianji": grade,
                // "gametype": gametype
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (tabFlag) {
                        a = that.data.list.concat(a);
                    }
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0? true : false
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
        if(that.data.list.length > 0){
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
    toDetail: function (e) {
        // console.log(e);
        var a = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '/pages/home/pages/game/gameDetail/gameDetail?info=' + JSON.stringify(a)
        })
    },
    tabClkFn: function(e){
        var that = this;
        var a = e.target.dataset.idx;
        if(that.data.sctdTabIdx != a) {
            that.setData({
                sctdTabIdx: a
            });
            gametype = a;
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
            });
            page = 1;
            hasmore = '';
            that.getList(false);
        }
    },
    onUnload: function () {
        page = 1;
        hasmore = null;
        gametype = 0;
        this.setData({
            showEmpty: false
        });
    },
    goBack: function () {
        wx.navigateBack({
            delta: 1
        });
    },
    tz_webview:function(e){
        var a= e.currentTarget.dataset.game;
        

            wx.navigateTo({
                url: "/pages/common/webView/webView?src=" + a + '?' + 'token='+app.userInfo.token
            })
    

        // var a = e.currentTarget.dataset;
        // var href = a.href.slice(0, a.href.indexOf('?'));
        // var p = a.href.slice(a.href.indexOf('?') + 1);
        // wx.navigateTo({
        //     url: "/pages/common/webView/webView?src=" + href + '&' + p + '&miniPro=1'
        // });
    }
})