// pages/my/pages/onlineService/onlineService.js
const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = '';

Page({

  data: {
      typelist:[],
  },
  onLoad: function (options) {
    this.compontNavbar = this.selectComponent("#compontNavbar");
    this.setData({
        idname:app.idname
    })
   
  },
    onShow:function(){
        this.getTypelist();
        page = 1;
        hasmore = '';
        this.getList(false);
    },
    getTypelist:function(){
        var that = this;
        network.POST({
            url: 'v14/help-center/type-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,               
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        typelist: res.data.data[0].list
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
    getList: function (flag){
        var that = this;
        network.POST({
            url: 'v14/help-center/help-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page
            },
            success: function (res) {
                //   console.log(res);
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
                    // console.log(that.data.questionList);          
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
    toDetail(e){
        wx.navigateTo({
            url: '/pages/my/pages/onlineSevDetail/onlineSevDetail?info=' + JSON.stringify(e.currentTarget.dataset)
        })
    },
    makePhone() {
        wx.makePhoneCall({
            phoneNumber: app.contactTel,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { }
        });
    },   
    manualBindtap: function () {
        wx.showToast({
            title: '暂未开通',
            icon: 'none',
            duration: 1000
        });
    },
})