const network = require("../../../../../utils/main.js");
const app = getApp();
var id = '';

Page({
    data: {
        checkedList: [],
        model: [],
        showEmpty: false,
        base: '../../../../../'
    },
    choice: function (e) {
        var index = e.currentTarget.dataset.id;
        var list = this.data.model;
        var clist = this.data.checkedList;

        if (!(list[index].checked)) {
            list[index].checked = true;
            clist.push(list[index].id);
        } else {
            list[index].checked = false;
            for (var i = 0; i < clist.length; i++) {
                if (clist[i] == list[index].id) {
                    break;
                }
            }
            clist = clist.slice(0, i).concat(clist.slice(i + 1));
        };
        // console.log(clist);
        this.setData({
            model: list,
            checkedList: clist
        });
    },
    onLoad: function (options) {
        id = options.id;
        this.empty = this.selectComponent("#empty");
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function () {
        var that = this;
        that.getList();
    },
    getList: function () {
        var that = this;
        network.POST({
            url: 'v14/easy-goods/my-exchange-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    that.setData({
                        model: a,
                        showEmpty: a.length == 0? true: false
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none'
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
    btn_qx: function () {
        var that = this;
        var list = that.data.model;

        for (var i = 0; i < list.length; i++) {
            list[i].checked = false;
        }
        that.setData({
            model: list,
            checkedList: []
        });
    },
    btn_sure: function (e) {
        var that = this;
        if (that.data.checkedList.length == 0) {
            wx.showToast({
                title: '请选择物品',
                icon: 'none',
                duration: 1000
            });
        }
        else {
            wx.showModal({
                title: '提示',
                content: '确认交换吗？',
                success: function (res) {
                    if (res.confirm) {
                        var obj = {};
                        var key = '';
                        var arr = that.data.checkedList;
                        for (var i = 0; i < arr.length; i++) {
                            key = i;
                            obj[key] = arr[i];
                        }
                        // console.log(obj);
                        network.POST({
                            url: 'v14/easy-goods/exchange',
                            params: {
                                "mobile": app.userInfo.mobile,
                                "token": app.userInfo.token,
                                "that_id": id,
                                "this_id": JSON.stringify(obj)
                            },
                            success: function (res) {
                                // console.log(res);
                                wx.hideLoading();
                                if (res.data.code == 200) {
                                    wx.navigateTo({
                                        url: '/pages/home/pages/barter/barter'
                                    });
                                }
                            },
                            fail: function () {
                                wx.hideLoading();
                                wx.showToast({
                                    title: '服务器异常',
                                    icon: 'none',
                                    duration: 1000
                                });
                            }
                        });
                    }
                }
            });
        }
    },
    onUnload: function(){
        this.setData({
            showEmpty: false
        });
    }
})

