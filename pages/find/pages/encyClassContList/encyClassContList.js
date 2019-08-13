const network = require("../../../../utils/main.js");
const app = getApp();

var page = 1;


Page({
    data: {
        base: '../../../../',
        list: [],
        showEmpty: false,
        sortId: '',
        sortName: '分类'
    },
    onLoad: function (options) {
        // console.log(options.id);
        this.setData({
            sortId: options.id,
            sortName: options.name
        });
        this.empty = this.selectComponent("#empty");
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
  onShow: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.customMethod()
  },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    onShow() {
        var that = this;
        wx.removeStorageSync('createEncyClass');
        that.getList(); 
    },
    getList() {
        var that = this;
        network.POST({
            url: 'v11/baike/about-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "sort_id": that.data.sortId,
                "page": page
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    // console.log(res);
                    var a = res.data.data;
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
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
    }
})