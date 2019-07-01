// pages/my/comment/comment.js
const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = '';

Page({
  data: {
    tabs: [{ index: 4, title: '视频课程', width: '25%' }, { index: 1, title: '教育动态', width: '25%' }, { index: 11, title: '易货商品', width: '25%' }, { index: 6, title: '积分商品', width: '25%' }],
    tabindex: 4, //1教育动态 4课程 6积分物品 11易货物品
    list: [],
    showEmpty: false
  },
  onLoad: function (options) {
      this.compontNavbar = this.selectComponent("#compontNavbar");
  },
  onShow() {
    this.setData({
      tabindex: 4
    })
    this.getList(4, false);
  },
  
  swiTab(e) {
    var a = e.currentTarget.dataset.index;
    var that = this;
    page = 1;
    that.setData({
      tabindex: a
    });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    that.getList(a, false);
  },
  getList(resourcetypeid, flag) {
    var that = this;
    network.POST({
      url: 'v14/news/my-comments-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "resourcetypeid": resourcetypeid,
        "page": page
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
        that.getList(that.data.tabindex, true);
      } else {
        wx.showToast({
          title: '没有更多了',
            icon: 'none',
          duration: 1000
        })
      }
    }
  },
  tz_detail:function(e){
    wx.navigateTo({
      url: '/pages/my/pages/commentDetail/commentDetail?myid=' + e.currentTarget.dataset.myid + '&tabindex=' + this.data.tabindex + '&resourcetypeid=' + e.currentTarget.dataset.resourcetypeid + '&resourceid=' + e.currentTarget.dataset.resourceid,
    })
  },
  tz_link:function(e){
    var that = this;
    // 4 视频课程
    if (that.data.tabindex == 4) {
      wx.navigateTo({ 
        url: '/pages/home/pages/courseList/courseDetail/courseDetail?courseid=' + e.currentTarget.dataset.resourceid + '&videopic=' + '',
      })
    }
    // 1 教育动态
    else if (that.data.tabindex == 1) {
      wx.navigateTo({
          url: '/pages/find/pages/news/newsDetail/newsDetail?id=' + e.currentTarget.dataset.resourceid,
      })
      // wx.navigateTo({
      //   url: '/pages/webView/webView?src=' + e.currentTarget.dataset.src,
      // })
    }
    // 11易货物品    
    else if (that.data.tabindex == 11) {
      wx.navigateTo({
          url: '/pages/home/pages/barter/barterDetail/barterDetail?id=' + e.currentTarget.dataset.resourceid,
      })
    }
    // 6积分物品
    else if (that.data.tabindex == 6) {
      wx.navigateTo({
          url: '/pages/home/pages/integralMall/integralMallDetail/integralMallDetail?id=' + e.currentTarget.dataset.resourceid,
      })
    }
    
  },
  onUnload: function () {
    page = 1;
    hasmore = '';
  }

})