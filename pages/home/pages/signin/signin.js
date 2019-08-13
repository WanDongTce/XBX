// pages/ls2/ls2.js
const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1;
Page({

  data: {
      info: '',
      listData: [],
      selectedTab: 0,
      list: [],
  },

  onLoad: function (options) {
      this.compontNavbar = this.selectComponent("#compontNavbar");
      this.empty = this.selectComponent("#empty");
      this.getList();
  },

  onShow: function () {
      var that=this;
    that.component = that.selectComponent("#component")
    that.component.customMethod()

      that.getSigninData(); //获取积分签到日期
  },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    getSigninData:function(){
        var that=this;
        network.POST({
            url: 'v14/task/singin-show',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;                    
                    that.setData({
                        info: res.data.data[0].item,
                        listData: a,                        
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
    //点击领取积分
    getJifen:function(){
        var that=this;
        // console.log(that.data.info.success)
        if (that.data.info.success==0){
            wx.showToast({
                title: '不可领取',
                icon: 'none',
                duration: 1000
            });
        }
        else if (that.data.info.success == 1){
            network.POST({
                url: 'v14/task/singin-get',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                },
                success: function (res) {
                    // console.log(res);
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        var a = res.data.data[0].item;
                        wx.showToast({
                            title: '领取成功',
                            icon: 'none',
                            duration: 1000
                        });
                        that.getSigninData();
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
        }
        
    },
    //积分商城
    getList: function () {
        var that = this;
        network.POST({
            url: 'v14/shop-point/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "typeid": that.data.selectedTab,
                "isrec": 1
            },
            success: function (res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    that.setData({
                        listone: a.slice(0, 3),
                        listtwo: a.slice(3, 6),
                    });
                    
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
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
    tz_detail: function (e) {
        wx.navigateTo({
            url: '/pages/home/pages/integralMall/integralMallDetail/integralMallDetail?id=' + e.currentTarget.dataset.id
        });
    },
    tz_task:function(){
        wx.switchTab({
            url: '/pages/main/pages/task/task',
        })
    }
})