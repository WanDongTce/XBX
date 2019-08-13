const network = require("../../../../utils/main.js");
const app = getApp();


Page({
    data: {
        list: [],
        showEmpty: false,
        base: '../../../../'
    },
    onLoad: function (options) {
        // console.log(app);
        this.empty = this.selectComponent("#empty");
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function () {
        var that = this;
        that.getList(); 
      that.component = that.selectComponent("#component")
      that.component.customMethod()
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    getList() {
        var that = this;
        network.POST({
            url: 'v11/live-user/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                wx.hideLoading();
                //   console.log(res);
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
                    });
                    // console.log(that.data.list);
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
    enterLive(e) {
        //   console.log(e);
        var a = e.currentTarget.dataset.params;
        // console.log(a);
        wx.setStorageSync('liveInfo', a);

        if (a.is_anchor == 2) {
            if (a.isopen == 2) {
                wx.showToast({
                    title: '暂未开启',
                    icon: 'none'
                })
            } else {
                wx.navigateTo({
                    url: '/pages/home/pages/broadcast/live-player/live-player'
                })
            }
        } else {
            wx.navigateTo({
                url: '/pages/home/pages/broadcast/live-pusher/live-pusher'
            })
        }
      
    },
    onPullDownRefresh() {
        var that = this;
        that.getList();
    },
})