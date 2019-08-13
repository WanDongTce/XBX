const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = '';
var flag = false;
var districtId = app.userInfo.register_area_id;
var type_id = 0;
var search = '';

Page({
    data: {
        tabs: [{ index: 0, title: '最新发布', width: '40%' }, { index: 1, title: '校内发布', width: '40%' }],
        imgUrls: [],
        currentTabIndex: 0,
        barterList: [],
        mylist: [],
        search: '搜索产品名称',
        showEmpty: false,
        showSearch: false,
        refreshFlag: true,
        base: '../../../../'
    },
    onLoad: function (options) {
        var that = this;
        this.empty = this.selectComponent("#empty");
        this.search = this.selectComponent("#search");
        this.compontNavbar = this.selectComponent("#compontNavbar");
        that.getSwipImgs(); 
    },
    onShow: function () {
        var that = this;
      that.component = that.selectComponent("#component")
      that.component.customMethod()
        if (that.data.refreshFlag){
            that.setData({
                currentTabIndex: 0,
            });
            that.getBarterList(page, flag, '');
        }
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    swiTab: function (e) {
        var that = this;
        var a = parseInt(e.currentTarget.dataset.index);
        page = 1;
        hasmore = '';
        search = '';
        flag = false;
        that.setData({
            showEmpty: false
        });
        switch (a) {
            case 0:
                that.getBarterList(page, flag, '');
                break;
            case 1:
                that.getBarterList(page, flag, districtId);
                break;

        };
        that.setData({
            currentTabIndex: a,
            search: ''
        });
    },
    getBarterList: function (page, flag, districtId) {
        var that = this;
        network.POST({
            url: 'v14/easy-goods/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "name": search,
                "type_id": type_id,
                "district_id": districtId
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (flag) {
                        a = that.data.barterList.concat(a); 
                    } 
                    that.setData({
                        barterList: a,
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
        if (that.data.barterList.length > 0){
            if (hasmore) {
                page++;
                flag = true;
                switch (that.data.currentTabIndex) {
                    case 0:
                        that.getBarterList(page, flag, '');
                        break;
                    case 1:
                        that.getBarterList(page, flag, districtId);
                        break;
                };
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                });
            }
        }
    },
    showSearch(){
        this.setData({
            showSearch: true
        });
    },
    hideSearch(){
        this.setData({
            showSearch: false
        });
    },
    toH5(e) {
        var a = e.currentTarget.dataset;
        network.swipLink(a);
    },
    searchCallBack(e){
        var that = this;
        var index = that.data.currentTabIndex;
        search = e.detail;
        page = 1;
        flag = false;
        that.setData({
            search: search
        });
        switch (parseInt(index)) {
            case 0:
                that.getBarterList(page, flag, '');
                break;
            case 1:
                that.getBarterList(page, flag, districtId);
                break;
        };
        that.hideSearch();
    },
    previewImg(e) {
        this.setData({
            refreshFlag: false
        });
        // console.log(e);
        var a = e.currentTarget.dataset;
        // console.log(a);
        var b = [];
        for (var i = 0; i < a.imgs.length; i++) {
            b.push(a.imgs[i].url);
        }

        network.previewImg(a.img, b);
    },
    getSwipImgs: function () {
        var that = this;
        network.getSwiperImgs( 4, function(res){
            if (res.data.code == 200) {
                that.setData({
                    imgUrls: res.data.data[0].list
                });
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    tz_detail: function (e) {
        wx.navigateTo({
            url: '/pages/home/pages/barter/barterDetail/barterDetail?id=' + e.currentTarget.dataset.myid
        })
    },
    toRelaeaseBarter: function () {
        wx.navigateTo({
            url: '/pages/home/pages/barter/releaseBarter/releaseBarter'
        })
    },
    tz_classify: function () {
        wx.navigateTo({
            url: '/pages/home/pages/barter/classBarter/classBarter'
        })
    },
    onUnload: function () {
        var that = this;
        search = '';
        that.setData({
            search: '搜索产品名称',
            showEmpty: false
        });
    }
})