const network = require("../../../../utils/main.js");
const app = getApp();
var pagesize = 20;
var page = 1;
var subId = 0;
var hasmore = null;

Page({
    data: {
        base: '../../../../',
        tabs: [],
        list: [],
        selectedTab: subId,
        showEmpty: false,
        mytopid: 0,
        top_style:''
    },
    onLoad: function (options) {
        this.empty = this.selectComponent("#empty");


        this.setData({
            mytopid: options.mytopid
        })
        var that=this;
        wx.getSystemInfo({
          success: function (res) {
            that.setData({              
              top_style: res.windowHeight*0.1 + res.windowWidth / 750 * 164              
            });
          }
        });
        
    },
    // 点击top
    mytop: function (e) {
        var that = this;
        that.setData({
            mytopid: e.currentTarget.dataset.mytopid,
            showEmpty: false
        })
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        page = 1;
        that.getList(false);
    },
    onShow: function () {
        var that = this;
        that.setData({
            tabs: app.studyOptions.kemu
        });
        that.getList(true);
      that.component = that.selectComponent("#component")
      that.component.customMethod()
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },

    swiScrollTab: function (e) {
        subId = e.currentTarget.dataset.index;
        this.setData({
            selectedTab: subId,
            showEmpty: false
        });
        // console.log(subId);
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        page = 1;
        this.getList(false);
    },
    getList: function (contaFlag) {
        var that = this;
        // console.log(that.data.mytopid)
        network.POST({
            url: 'v13/ncourse/course-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "pagesize": pagesize,
                "teacherid": '',
                "subjectid": subId,
                "type": that.data.mytopid
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (contaFlag) {
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
                });
            }
        }
    },
    tz_detail: function (e) {
        wx.navigateTo({
          url: '/pages/home/pages/courseList/courseDetail/courseDetail?courseid=' + e.currentTarget.dataset.myid + '&videopic=' + e.currentTarget.dataset.videopic,
        })
    },
    onUnload: function () {
        page = 1;
        hasmore = null;
        this.setData({
            showEmpty: false
        });
    }
})