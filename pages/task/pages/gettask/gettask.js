var network = require("../../../../utils/main.js");
var app = getApp();
var id = '';
var uids = '';
var seletype = '';
var page = 1;
var hasmore = '';

Page({
    data: {
        base: '../../../../',
        starttime: '',
        endtime: '',
        detail: '',
        showFriList: false,
        list: [],
        seletype: ''
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.selectFriend = this.selectComponent("#selectFriend");
        id = options.id;
        seletype = options.seletype;
        this.setData({
            seletype: options.seletype
        });
    },
    onShow: function () {
        var that = this;
        that.getDetail();
    },
    startTimeChange: function (e) {
        this.setData({
            starttime: e.detail.value
        })
    },
    endTimeChange: function (e) {
        this.setData({
            endtime: e.detail.value
        })
    },
    getDetail() {
        var that = this;
        network.POST({
            url: 'v14/task/detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0];
                    that.setData({
                        detail: a
                    });
                    that.getFriendList(false);
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
    getTask(){
        var that = this;
        var detail = that.data.detail.item;
        var taskType = detail.tasktype;
        var ty = detail.type;
        var startTime = that.data.starttime;
        var endTime = that.data.endtime;
        if (taskType == 1 && !startTime){
            wx.showToast({
                title: '请选择开始时间',
                icon: 'none'
            })
        } else if (taskType == 1 && !endTime){
            wx.showToast({
                title: '请选择结束时间',
                icon: 'none'
            })
        } else if (taskType == 1 && seletype == 2 && !uids){
            wx.showToast({
                title: '请选择好友',
                icon: 'none'
            })
        }else{
            that.getTaskFn();
        }
    },
    getTaskFn() {
        var that = this;
        network.POST({
            url: 'v14/task/get-task',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "type": seletype,
                "taskid": id,
                "starttime": that.data.starttime,
                "endtime": that.data.endtime,
                "uids": uids
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '领取成功',
                        duration: 1000,
                        success: function(){
                            wx.switchTab({
                                url: '/pages/main/pages/task/task'
                            })
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
    showAddFriend: function () {
        var that = this;
        that.setData({
            showFriList: true
        });
    },
    searchFn(e){
        // console.log(e);
        this.getFriendList(false, e.detail);
    },
    getFriendList(flag) {
        var that = this;
        if(!flag) page = 1;
        network.POST({
            url: 'v14/task/friend-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "taskreceiveid": that.data.detail.item.taskreceiveid,
                "search": arguments[1] || '',
                "page": page
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    for (var i = 0; i < a.length; i++) {
                        if (a[i].isjoin == 2) {
                            a[i].checked = false;
                        }
                    }
                    if (flag) {
                        a = that.data.list.concat(a);
                    }
                    that.setData({
                        list: a
                    })
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
        if (this.data.list.length > 0) {
            if (hasmore) {
                page++;
                this.getFriendList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    getFriend(e){
        var that = this;
        // console.log(e);
        var count = e.detail.count;
        // console.log(count);
        uids = e.detail.obj;
        if(count == 1){
            var d = that.data.detail;
            d.friends_bing = e.detail.arr;
            that.setData({detail: d});
        }else{
            that.getDetail();
        }
        that.setData({
            showFriList: false
        });
    },
    getTaskFinish(){
        var that = this;
        network.POST({
            url: 'v14/task/get-task-finish',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "taskreceiveid": that.data.detail.item.taskreceiveid
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.getDetail();
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
    unload() {
        page = 1;
    }
})