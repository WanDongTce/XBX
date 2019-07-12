var network = require("../../../../../utils/main.js");
var app = getApp();

var msgtype='';
var page = 1;
var hasmore = null;
Page({
    data: {
       
        list: [],
        showEmpty: false
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
        
        // console.log(options)
        msgtype = options.msgtype;
        this.setData({
            msgtype: msgtype
        })
        
    },
    onShow: function () {
        var that = this;
        that.getList(false);
        
    },
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v9/message/index',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "type": msgtype,
                
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
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
  gocomplate:function(e){
    // var a = e.currentTarget.dataset.gocomplateid;
    var b = e.currentTarget.dataset.resourcetypeid;
    // if(b==6){
    //   network.gocomplate(a);
    // }
    // console.log(e)
    if(b==6){
      wx.switchTab({
        url: '/pages/main/pages/task/task',
      })
    }
    if(b==7){
      wx.navigateTo({
        url: '/pages/my/pages/myIntegarl/myIntegarl',
      })
    }

    
  },
  tz_view:function(e){
    // var a = e.currentTarget.dataset.datahref;
    // // console.log(a)
    // var u = a.slice(0, a.indexOf('?'));
    // var p = a.slice(a.indexOf('?') + 1);
    // wx.navigateTo({
    //   url: '/pages/common/webView/webView?src=' + u + '&' + p
    // });

    
      var a = e.currentTarget.dataset;
      // console.log(a);
      var href = a.datahref.slice(0, a.datahref.indexOf('?'));
      var p = a.datahref.slice(a.datahref.indexOf('?') + 1);
      wx.navigateTo({
          url: "/pages/common/webView/webView?src=" + href + '&' + p + '&miniPro=1'
      });


    //   var a = e.currentTarget.dataset;
    //   // console.log(a);
    //   var href = a.href.slice(0, a.href.indexOf('?'));
    //   var p = a.href.slice(a.href.indexOf('?') + 1);
    //   wx.navigateTo({
    //       url: "/pages/common/webView/webView?src=" + href + '&' + p + '&miniPro=1'
    //   });

  }
})