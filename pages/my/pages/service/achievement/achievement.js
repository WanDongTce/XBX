// pages/edutlList/achievement/achievement.js
const network = require("../../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = null;
var search = '';
Page({

  data: {
    list: [],
  },
  onLoad: function (options) {
  
  },

  onShow: function () {
    var that = this;
    that.getList(false);
  },
  getList: function (contaFlag) {
    var that = this;
    network.POST({
      url: 'v14/user-exam/list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,        
        "search": search,
        "page": page,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          if (contaFlag) {
            var a = that.data.list.concat(res.data.data[0].list);
            that.setData({
              list: a
            });
          } else {
            that.setData({
              list: res.data.data[0].list
            });
          }
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
    
      if (hasmore) {
        page++;
        this.getList(true);
      } else {
        wx.showToast({
          title: '没有更多了',
            icon: 'none',
          duration: 1000
        })
      }
    
  },
  inputFn: function (e) {
    search = e.detail.value.replace(/^\s*|\s*$/, '');
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    page = 1;
    this.getList(false);
  },

  onUnload: function () {
    page = 1;
    hasmore = null;
    search = '';  
    this.setData({
      search:''
    })  
  },
  tz_my: function (e) {    
    wx.switchTab({
        url: '/pages/main/pages/my/my',
    })    
  }
})