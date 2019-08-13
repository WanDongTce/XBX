const network = require("../../../../utils/main.js");
const app = getApp();
// console.log(app);
var page = 1;
var hasmore = null;
var search = '';
var nianji = 0;
var kemu = 0;
var version = 0;
var ceshu = 4;

Page({
    data: {
        base: '../../../../',
        isShowOptions: false,
        list: [],
        showEmpty: false
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
        this.studyFilter = this.selectComponent("#studyFilter");
    },
    onShow: function () {
        var that = this;
        that.getContList(true);

      that.component = that.selectComponent("#component")
      that.component.customMethod()
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    getContList: function (contaFlag) {
        var that = this;
        network.POST({
            url: 'v14/study/course-ware-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "type": 1,
                "search": search,
                "nianji": nianji,
                "kemu": kemu,
                "version": version,
                "ceshu": ceshu
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
        if (!this.data.isShowOptions && this.data.list.length > 0) {
            if (hasmore) {
                page++;
                this.getContList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    showOptions() {
        this.setData({
            isShowOptions: true
        })
    },
    filterCallBack(e) {
        var a = e.detail;
        page = 1;
        search = a.search;
        nianji = a.nianji;
        kemu = a.kemu;
        version = a.version;
        ceshu = a.ceshu;
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        this.setData({
            isShowOptions: false
        });
        this.getContList(false);
    },
    //转换为时间戳
    translateTime: function (time) {
        var date = new Date(time.replace(/-/g, '/'));
        var timestamp = date.valueOf() / 1000;
        return timestamp
    },
    toDetail(e){
        // this.memberExpires(e);
        var a = e.currentTarget.dataset;
        console.log(a);
        var start_time = Date.parse(new Date())/1000;
        var end_time = start_time+5;
        
        // (type, typeid, start_time, end_time, callback, errCallback)
        network.getAddStudyRecord(1, a.id, start_time, end_time,function (res) {
            wx.hideLoading();
            if (res.data.code == 200) {
                wx.navigateTo({
                    url: '/pages/common/webView/webView?src=' + a.href + '&getpointype=1&studyid=' + a.id
                })
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
    memberExpires() {
        var that = this;
        network.memberExpires(function (res) {
            // console.log(res);
            if (res.data.data[0].item.is_end == 1) {
                wx.showToast({
                    title: '会员已到期,请续费~',
                    icon: 'none'
                });
            }else{
                var a = e.currentTarget.dataset;
                // console.log(a);
                var start_time = Date.parse(new Date()) / 1000;
                var end_time = start_time + 5;
                network.getAddStudyRecord(1, a.id, start_time, end_time, function (res) {
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        wx.navigateTo({
                            url: '/pages/common/webView/webView?src=' + a.href + '&getpointype=1&studyid=' + a.id
                        })
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
                // wx.navigateTo({
                //     url: '/pages/common/webView/webView?src=' + a.href + '&getpointype=1&studyid=' + a.id
                // })
            }
        });
    },
    onUnload: function () {
        page = 1;
        hasmore = null;
        search = '';
        nianji = 0;
        kemu = 0;
        version = 0;
        ceshu = 4;
        this.setData({
            isShowOptions: false,
            showEmpty: false
        });
    }
})