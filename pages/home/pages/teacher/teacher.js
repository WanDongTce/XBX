const network = require("../../../../utils/main.js");
const app = getApp();
// console.log(app);
var page = 1;
var hasmore = null;
var search = '';
var address = [];
var subject = '';
var level = '';

Page({
    data: {
        base: '../../../../',
        isShowOption: false,
        sctdOptIdx: 0,
        animationData: null,
        showEmpty: false,
        list: []
    },
    onLoad: function (options) {
        // console.log(app);
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
        this.addressList = this.selectComponent("#addressList");
        this.subjectList = this.selectComponent("#subjectList");
        this.levelList = this.selectComponent("#levelList");
    },
    onShow: function () {
        var that = this;
        that.getList(false); 
      that.component = that.selectComponent("#component")
      that.component.customMethod()
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    getList: function (flag) {
        var that = this;
        // var id = address.length > 0 ? address[2].id : '';
        var id = address.length > 0 ? address[1].id : '';
        that.data.isShowOption && that.hideOption();
        var a = subject ? JSON.stringify(subject) : '';
        var b = level ? JSON.stringify(level) : '';

        network.POST({
            url: 'v13/nteacher/teacher-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                // "school": app.userInfo.register_community_id,
                "name": search,
                "cityid": id,
                "subjectid": a,
                "jobtitle": b
            },
            success: function (res) {
                // console.log(res);
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
        if (!this.data.isShowOption && this.data.list.length > 0) {
            if (hasmore) {
                page++;
                this.getList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    
    inputFn: function(e){
        search = e.detail.value.replace(/^\s*|\s*$/, '');
        // console.log(search);
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        page = 1;
        this.getList(false);
    },
    
    onUnload: function () {
        page = 1;
        hasmore = null;
        search = '';

        this.setData({
            showEmpty: false
        });
    },
    seltClkFn: function (e) {
        var that = this;
        var a = e.target.dataset.idx;
        // console.log(a);
        if (that.data.isShowOption && that.data.sctdOptIdx == a) {
            that.hideOption();
        } else {
            that.showOption(a);
        }
    },
    selectedAddress(e){
        console.log(e.detail);   
        var that = this;
        address = e.detail;
        that.hideOption();
        page = 1;
        that.getList(false);
    },
    subjectConfirmFn(e){
        // console.log(e.detail);
        var that = this;
        subject = e.detail;
        that.hideOption();
        page = 1;
        that.getList(false);
    },
    levelConfirmFn(e){
        // console.log(e.detail);
        var that = this;
        level = e.detail;
        that.hideOption();
        page = 1;
        that.getList(false);
    },
    showOption: function (idx) {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease-out",
            delay: 0
        });
        this.animation = animation;
        animation.translateY(-200).step();
        this.setData({
            animationData: animation.export(),
            isShowOption: true,
            sctdOptIdx: idx
        });
        setTimeout(function () {
            animation.translateY(0).step();
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200);
    },
    hideOption: function () {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease-out",
            delay: 0
        });
        this.animation = animation;
        animation.translateY(-10).step();
        this.setData({
            animationData: animation.export()
        });
        setTimeout(function () {
            animation.translateY(-300).step();
            this.setData({
                animationData: animation.export(),
                isShowOption: false,
                sctdOptIdx: 0
            });
        }.bind(this), 200);
    }
})