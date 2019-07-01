// pages/edutlList/rest/rest.js
const network = require("../../../../../utils/main.js");
const app = getApp();
Page({

  data: {
  
  },

  onLoad: function (options) {
  
  },
  record: function (e) {
    var that = this;
    
    network.POST({
      url: 'v14/study/add-work-time',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "type": e.currentTarget.dataset.mytype,        
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: '操作成功',
              icon: 'none',
            duration: 1000
          });
          
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
})