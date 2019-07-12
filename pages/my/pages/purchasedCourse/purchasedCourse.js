// pages/my/purchasedCourse/purchasedCourse.js
const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = '';
var flag = false;
Page({

  data: {
    showEmpty: false,
      showEmptyFh: false,
    tabs: [{ index: 1, title: '开始等待', width: '50%' }, { index: 2, title: '课程回放', width: '50%' }],
    tabindex: 1,
    list: [], 
  },
  onLoad: function (options) {
    var that = this;
    this.compontNavbar = this.selectComponent("#compontNavbar");
    that.setData({
      tabindex: 1
    })
    that.getList(1, page, flag);
  },
  swiTab: function (e) {
    var that = this;
    var a = e.currentTarget.dataset.index;
    page = 1;
    hasmore = '';
    flag = false;
    that.setData({
      tabindex: a,
      list: [],      
    });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    if(a==1){
        that.getList(page, false);
    }
    else if(a==2){
        that.getHuifang(page, false);
    }
  },
  onShow: function () {

  },
  getList: function ( page, flag) {
    var that = this;
    network.POST({
        url: 'v14/live-course/my-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,
      },
      success: function (res) {
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
          })
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
    getHuifang: function (page, flag) {
        var that = this;
        network.POST({
            url: 'v14/live-course/video-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (flag) {
                        a = that.data.listhf.concat(a);
                    }
                    that.setData({
                        listhf: a,
                        showEmptyHf: a.length == 0 ? true : false
                    })
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
    if(that.data.tabindex==1){
        if (that.data.list.length > 0) {
            if (hasmore) {
                page++;
                that.getList( page, true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                });
            }
        }
    }
    else if (that.data.tabindex == 2) {
        if (that.data.listfh.length > 0) {
            if (hasmore) {
                page++;
                that.getHuifang(page, true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                });
            }
        }
    }
  },
  onUnload: function () {
    page = 1;
    hasmore = '';
  }
})