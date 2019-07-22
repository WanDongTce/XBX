const network = require("../../../../../utils/main.js");
const app = getApp();
// console.log(app);
var page = 1;
var hasmore = null;
var search = '';
var nianji = "";
var gametype = '';

Page({
    data: {
        base: '../../../../../',
        IMGURL: app.imgUrl,
        isShowOption: false,
        sctdOptIdx: null,
        animationData: null,
        list: [],
        options: [],
        nianji: nianji,
        gametype: gametype,
        showEmpty: false,
        tabTitle: ''
    },
    onLoad: function (options) {
        this.empty = this.selectComponent("#empty");
        this.compontNavbar = this.selectComponent("#compontNavbar");
        gametype = options.gametype;
        this.setData({
            gametype: options.gametype,
            tabTitle: options.title
        });
    },
    onShow: function () {
        var that = this;
      that.getList(nianji);
    },
    /*
    inputFn: function(e){
        search = e.detail.value.replace(/^\s*|\s*$/, '');
        // console.log(search);
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        page = 1;
        this.getList(false);
    },
    */
    getList: function (tabFlag) {
        var that = this;
        that.hideOption();
      console.log(nianji)
        network.POST({
            url: 'v14/study/game-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "search": search,
                "nianji": nianji,
                "gametype": gametype
            },
            success: function (res) {
              console.log(res.data)
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (tabFlag) {
                        a = that.data.list.concat(a);
                    }
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0?true:false
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
        if (!that.data.isShowOption && that.data.list.length > 0){
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
    onUnload: function () {
        page = 1;
        hasmore = null;
        search = '';
        // nianji = app.userInfo.grade_id;
      nianji = '';
        this.setData({
            nianji: nianji,
            showEmpty: false
        });
    },
    toDetail: function (e) {
      var that = this;
        var a = e.currentTarget.dataset.item;
        
        // console.log(a)
        // console.log(b)
        var start_time = Date.parse(new Date()) / 1000;
        var end_time = start_time + 5;
        network.getAddStudyRecord(3, a.id, start_time, end_time, function (res) {
            wx.hideLoading();
            if (res.data.code == 200) {
                wx.navigateTo({
                  url: `/pages/home/pages/game/gameDetail/gameDetail?info=${JSON.stringify(a)}&gametype=${gametype}&title=${that.data.tabTitle}`
                })
                // wx.navigateTo({
                //     url: '/pages/home/pages/game/gameWebview/gameWebview?src=' + JSON.stringify(a)
                // })
            }
            else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                })
            }
        }, function () {
            wx.hideLoading();
            wx.showToast({
                title: '服务器异常',
                icon: 'none',
                duration: 1000
            });
        });
        
    },
    seltClkFn: function (e) {
        var that = this;
        var a = e.target.dataset.idx;
        if (that.data.isShowOption && that.data.sctdOptIdx == a) {
            that.hideOption();
            that.setData({
                sctdOptIdx: null
            });
        } else {
            that.getOptions(a);
        }
    },
    getOptions: function (idx) {
        var that = this;
        var a = null;
        if (idx == 1) {
            a = app.studyOptions.nianji;
        } else if (idx == 2) {
            a = app.studyOptions.game;
        } else { }
        that.setData({
            options: a
        });
        // console.log(that.data.options);
        that.showOption(idx);
    },
    selOptFn: function (e) {
        var that = this;
        var idx = that.data.sctdOptIdx;
        var a = e.target.dataset.id;
        // console.log(a);
        if (idx == 1) {
            that.setData({
                nianji: a
            });
        } else if (idx == 2) {
            that.setData({
                gametype: a
            });
        }else { }

    },
    optCofmFn: function () {
        var that = this;
        var idx = that.data.sctdOptIdx;
        if (idx == 1) {
            nianji = that.data.nianji;
            that.setData({
                gametype: gametype
            });
        } else if (idx == 2) {
            gametype = that.data.gametype;
            that.setData({
                nianji: nianji
            });
        } else { };
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        page = 1;
        that.getList(false);
    },
    showOption: function (idx) {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease-out",
            delay: 0
        });
        this.animation = animation;
        animation.translateY(-200).step();
        this.setData({
            animationData: animation.export(),
            isShowOption: true,
            sctdOptIdx: idx
        });
        setTimeout(function () {
            animation.translateY(0).step();
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200);
    },
    hideOption: function () {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease-out",
            delay: 0
        });
        this.animation = animation;
        animation.translateY(-10).step();
        this.setData({
            animationData: animation.export()
        });
        setTimeout(function () {
            animation.translateY(-300).step();
            this.setData({
                animationData: animation.export(),
                isShowOption: false,
                sctdOptIdx: 0
            });
        }.bind(this), 200);
    }
})