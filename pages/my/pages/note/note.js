const network = require("../../../../utils/main.js");
const app = getApp();
var hasmore = '';
var page = 1;

Page({
    data: {
        list: []
    },
    onLoad(){
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow(){
        this.getList(false);
    },
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v14/news/my-comments-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "resourcetypeid": 13,
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
                    // console.log(that.data.list);
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
                })
            }
        }
    },
    toDetail(e){
        var a = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '/pages/my/pages/noteDetail/noteDetail?id=' + a.id
        })
    },
    link(e){
        var a = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/home/pages/courseList/courseDetail/courseDetail?courseid=' + a + '&videopic= '
        })
    },
    onUnload: function () {

    }
})