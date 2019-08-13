const network = require("../../../../../utils/main.js");
const app = getApp();
// console.log(app);
var hasmore = '';
var page = 1;

Page({
    data: {
        base: '../../../../../',
        selectedTab: 0,
        list: [],
        itemStyle: [],
        showEmpty: false
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
        this.getItemStyle();
        this.setData({
            selectedTab: options.selectedTab
        })
    },
    onShow(){
        this.getList(false);
     
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
    swiScrollTab: function (e) {
        var a = e.currentTarget.dataset.index;
        this.setData({
            selectedTab: a
        });
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        page = 1;
        hasmore = '';
        this.getList(false);
    },
    getItemStyle: function () {
        var that = this;
        var a = app.goodsType
        a.unshift({
            id: 0,
            name: '全部',
        });
        that.setData({
            itemStyle: app.goodsType
        });
    },
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v14/shop-point/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "typeid": that.data.selectedTab
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
                    hasmore = res.data.data[0].hasmore;
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
    onReachBottom: function () {
        var that = this;
        if(that.data.list.length > 0){
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
    //跳转到详情
    tz_detail: function (e) {
        wx.navigateTo({
            url: '/pages/home/pages/integralMall/integralMallDetail/integralMallDetail?id=' + e.currentTarget.dataset.id
        });
    },
    toSetm: function (e) {
        var a = e.currentTarget.dataset.item;
        // console.log(a);
        wx.setStorageSync("goods", a);
        wx.navigateTo({
            url: '/pages/home/pages/integralMall/settlement/settlement'
        });
    },
    onUnload: function () {
        page = 1;
        hasmore = '';
        this.setData({
            showEmpty: false
        });
    }
})
