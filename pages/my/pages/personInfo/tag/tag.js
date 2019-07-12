var network = require("../../../../../utils/main.js");
var app = getApp();

Page({
    data: {
        selectedList: [],
        labelList: []
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.tag = this.selectComponent("#tag");
    },
    onShow: function () {
        var that = this;
        that.getLabel();
    },
    getLabel: function () {
        var that = this;
        network.getUserLabel(function (res) {
            var a = res.data.data;
            var b = that.data.labelList;
            for(var i = 0; i < a.length; i++){
                for(var j = 0; j < a[i].label.length; j++){
                        // console.log(a[i].label[j]);
                    if (a[i].label[j].is_checked == 1){
                        b.push(a[i].label[j].id);
                    }
                }
            }
            that.setData({
                labelList: a,
                selectedList: b
            });
        });
    },
    selectTag(e){
        // console.log(e.detail);
        var that = this;
        var a = that.data.selectedList;
        var b = e.detail.flag;
        var c = e.detail.item;

        if (b) {
            a.push(c.id);
        } else {
            var i = a.indexOf(c.id);
            // console.log(i);
            a = a.slice(0, i).concat(a.slice(i + 1));
        }

        this.setData({
            selectedList: a
        });
        // console.log(a);
    },
    saveTag: function () {
        var that = this;
        var a = that.data.selectedList;
        if(a.length > 0){
            a = network.arrToObj(a);
            network.POST({
                url: 'v9/label/upload-tag',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "label_id": JSON.stringify(a)
                },
                success: function (res) {
                    // console.log(res);
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        wx.navigateTo({
                            url: '/pages/my/pages/personInfo/personInfo',
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
        }else{
            wx.showToast({
                title: '请选择标签'
            })
        }
    }
})