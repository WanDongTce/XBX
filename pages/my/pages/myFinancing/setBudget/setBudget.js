const network = require("../../../../../utils/main.js");
const app = getApp();
Page({

  data: {
    prev_zhichu:'',
    budget:""
  },
  onLoad: function (options) {
    // console.log(options)
    var that=this;
    this.compontNavbar = this.selectComponent("#compontNavbar");
    that.setData({
      prev_zhichu: options.prev_zhichu
    })
  },
  budgetInputEvent:function(e){
    this.setData({
      budget: e.detail.value.replace(/^\s*|\s*$/, '')
    })
  },
  //点击保存
  tz_myFinancing: function () {
    
    var that=this;
    console.log(that.data.budget)
    // var budget = that.data.budget;
    var regbudget = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
    if (that.data.budget=='') {
      wx.showToast({
        title: '不能为空',
          icon: 'none',
        duration: 1000
      })
    }
    else if (!regbudget.test(that.data.budget)) {
      wx.showModal({
        title: '提示',
        content: '金额不合法',
      })
    }
    else{
      //设置预算
      network.POST({
        url: 'v14/finance/set-budget',
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "budget": that.data.budget
        },
        success: function (res) {
          // console.log(res);
          wx.hideLoading();
          if (res.data.code == 200) {
            wx.showToast({
              title: res.data.message,  
              icon: 'success',            
            });
            wx.navigateTo({
              url: '/pages/my/pages/myFinancing/myFinancing',
            })
          } else {
            wx.showToast({
              title: res.data.message,
                icon: 'none',
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
    }
    // wx.navigateTo({
    //   url: '/pages/my/myFinancing/myFinancing',
    // })
  },
})