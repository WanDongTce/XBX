// pages/service/restList/restList.js
const network = require("../../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = null;
var mytype = ''
Page({

  data: {
  
  },
  onLoad: function (options) {
    // console.log(options.mytype)
    this.empty = this.selectComponent("#empty");
    mytype = options.mytype;
    this.getList(false);
  },
  getList: function (contaFlag) {
    var that = this;
    network.POST({
      url: 'v14/study/work-time-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,
        "type": mytype,
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
  onShow: function () {
  
  },

})