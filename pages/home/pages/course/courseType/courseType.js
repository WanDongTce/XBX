// pages/course/course.js
const network = require("../../../../../utils/main.js");
const moment = require("../../../../../utils/moment.js");
const app = getApp();
var pagesize = 20;
var page = 1;
var subId = 0;
var hasmore = null;
var mytopid='';
var nianjiid = '';
Page({

  
  data: {
    show: {
      middle: false
    },
      kemu: [],
      nianji: [],
      index:0,
      showEmpty: false,
      
      tabs: [],
      list: [],
      selectedTab: subId,
      showEmpty: false,
    freeTime: 0, //新注册号免费试用
    videoId: 0,
    videoPic: ''  
  },

  onLoad: function (options) {
      this.empty = this.selectComponent("#empty");
      
      var that = this;
      mytopid = options.mytopid;
      that.setData({
          tabs: app.studyOptions.kemu,
          nianji: app.studyOptions.nianji,
      })
    //   console.log(that.data.nianji)
    //   navtitle双优课 2公共课 3微课
      if (mytopid==0){
          that.setData({
              navtitle:'全部'
          })
      }
      else if (mytopid == 1) {
          that.setData({
              navtitle: '双优课'
          })
      }
      else if (mytopid == 2) {
          that.setData({
              navtitle: '公共课'
          })
      }
      else if (mytopid == 3) {
          that.setData({
              navtitle: '微课'
          })
      }
      that.getList(false);
      
  },
    bindPickerChange(e) {
        var that=this;
        that.setData({
            index: e.detail.value
        })
        for (var i = 0; i < that.data.nianji.length; i++) {
            if (that.data.nianji[that.data.index].title == that.data.nianji[i].title) {
                
                nianjiid = that.data.nianji[i].id
            }
        }
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        page = 1;
        this.getList(false);
    },
  onShow: function () {
      var that = this;
    that.component = that.selectComponent("#component")
    that.component.customMethod()
      
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
                'gradeid': nianjiid,
                "type": mytopid,

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
  //提示会员是否到期
  onTransitionEnd() {
    // console.log(`You can't see me 🌚`);
  },
  toggle(type) {
    this.setData({
      [`show.${type}`]: !this.data.show[type]
    });
  },

  togglePopup() {
    this.toggle('middle');
  },
  noBuy: function () {
    let that = this;
    this.toggle('middle');
    if (this.freeTry()) {
      wx.navigateTo({
        url: '/pages/home/pages/courseList/courseDetail/courseDetail?courseid=' + that.data.videoId + '&videopic=' + that.data.videoPic,
      });
    }
  },
  goBuy: function () {
    wx.navigateTo({
      url: '/pages/my/pages/memberRenewalNewPay/memberRenewalNewPay'
    });
  },
  //判断会员是否过期

  onHide: function () {
    this.setData({
      show: {
        middle: false
      }
    });
    var that = this
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
  tz_detail: function (e) {
    this.memberExpires(e);
  },
  freeTry: function () {
    let that = this;
    let createTime = app.userInfo.create_time;
    let start = moment(createTime);
    let end = moment();
    let freeTime = end.diff(start, 'days');
    if (freeTime < 3) {
      that.setData({
        freeTime: (3 - freeTime)
      });
      return true;
    } else {
      //免费试用结束
      return false;
    }

  },
  memberExpires(e) {
    var that = this;
    network.memberExpires(function (res) {
      that.setData({
        videoId: e.currentTarget.dataset.myid,
        videoPic: e.currentTarget.dataset.videopic
      });
      that.freeTry();
      that.toggle('middle');
    }, function (res) {
      wx.navigateTo({
        url: '/pages/home/pages/courseList/courseDetail/courseDetail?courseid=' + e.currentTarget.dataset.myid + '&videopic=' + e.currentTarget.dataset.videopic,
      })
    });
  },
    onUnload: function () {
        page = 1;
        hasmore = null;
        this.setData({
            showEmpty: false
        });
    }
})