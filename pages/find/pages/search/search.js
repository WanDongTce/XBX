const network = require("../../../../utils/main.js");
const app = getApp();
var search = '';
var searchHis = null;

Page({
    data: {
        base: '../../../../',
        hisList: [],
        search: ''
    },
    onLoad: function(options){
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function () {
        searchHis = wx.getStorageSync('searchHis') || [];
      var that = this;
      that.component = that.selectComponent("#component")
      that.component.customMethod()
        // console.log(searchHis);
        this.setData({
            hisList: searchHis
        });
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    inputFn: function(e){
        // console.log(e);
        search = e.detail.value.replace(/^\s*|\s*$/, '');
    },
    saveSearchHis: function(arr){
        wx.setStorageSync('searchHis', arr);
    },
    submitCommt: function(){
        if(search){
            searchHis.push(search);
            this.saveSearchHis(searchHis);
            this.submit();
        }
    },
    cancel: function(){
        search = '';
        this.setData({
            search: ''
        });
    },
    submit() {
        var that = this;
        network.POST({
            url: 'v11/baike/sort-search',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "search": search
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = JSON.stringify(res.data.data[0]);
                    wx.navigateTo({
                        url: '/pages/find/pages/searchEncy/searchEncy?data=' + a,
                        complete(err) {
                            // console.log(err);
                            if (err.errMsg == 'navigateTo:fail webview count limit exceed') {
                                app.webViewLimitate();
                            }
                        }
                    })
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
    tapHisItem: function (e) {
        var a = e.currentTarget.dataset.val;
        this.setData({
            search: a
        });
        search = a;
        this.submit();
    },
    clearHis: function () {
        searchHis = [];
        wx.removeStorageSync('searchHis');
        this.setData({
            hisList: []
        });
    }
})