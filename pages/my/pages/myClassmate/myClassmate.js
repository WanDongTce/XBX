var network = require("../../../../utils/main.js");
var app = getApp();
var page = 1;
var hasmore = '';
var mobile = app.userInfo.mobile;


Page({
    data: {
        showEmpty: false,
        list: [],
        title: '综合素质'
    },
    onLoad(options){
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
        if(options.mobile){
            mobile = options.mobile;
            this.setData({
                title: 'TA的综合素质'
            });
        }
    },
    onShow: function () {
        var that = this;
        that.getList(false);
    },
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v11/post/user-postlist',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "user_mobile": mobile,
                "page": page
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {  
                    var a = res.data.data.item;  
                    if (flag){
                        a = that.data.list.concat(a)
                    }           
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
                    });
                    hasmore = res.data.data.pageCount;
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
                })
            }
        }
    },
    del: function(e){
     
            var that = this;
            network.POST({
              url: 'v6/post/delete-post',
              params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "post_id": e.currentTarget.dataset.id
              },
              success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                  page = 1;
                  that.getList(false);
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
    toDetail: function (e) {
        var a = e.currentTarget.dataset.item;
        wx.setStorageSync("classmate", a);
        wx.navigateTo({
          url: '/pages/home/pages/classmate/classmateDetailNew/classmateDetailNew'
        })
    },
    onUnload: function () {
        page = 1;
        hasmore = '';
    }
})