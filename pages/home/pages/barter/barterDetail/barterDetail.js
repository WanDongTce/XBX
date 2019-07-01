const network = require("../../../../../utils/main.js");
const app = getApp();
var loginUserId = '';
var id = '';
var page = 1;
var hasmore = '';
var parentId = '';

Page({
    data: {
        detail: '',
        messages: [],
        more: false,
        isShowDialog: false,
        animationData: null,
        msg: '',
        placeholder: '',
        leftstate: '',
        rightstate: '',
        count: 0,
        isCollect: false,
        base: '../../../../../'
    },
    onLoad: function (options) {
        // console.log(options)
        var that = this;

        if (options.leftstate){
            this.setData({
                leftstate: options.leftstate,
                rightstate: options.rightstate
            })
        }
        loginUserId = app.userInfo.id;
        id = options.id;
     
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.component = this.selectComponent("#component");
        
        that.getDetail();
        that.getMsgList(); 
    },
    getDetail: function () {
        var that = this;
        network.POST({
            url: 'v14/easy-goods/detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": id
            },
            success: function (res) {
                // console.log(res)
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].item;
                    if ((loginUserId != a.userInfo.uid) && a.releasestatus == 2) {
                        wx.showToast({
                            title: '货物未发布',
                            icon: 'none',
                            duration: 1000
                        })
                        wx.navigateBack({
                            delta: 1
                        })
                    } else {
                        that.setData({
                            detail: a,
                            isCollect: a.iscollect
                        });
                    }

                    // console.log(that.data.detail);
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
    swiMore: function () {
        var that = this;
        var a = that.data.more;
        that.setData({
            more: !a
        });
    },
    addAgree: function () {
        var that = this;
        var count = that.data.count;
        if(count > 0){
            wx.showToast({
                title: '您已点赞',
                icon: 'none'
            });
        }else{
            count++;
            that.setData({
                count: count
            });
            network.addAgree(11, id);
        } 
    },
    collection() {
        var that = this;
        network.collect(11, id, function (res) {
            // console.log(res);
            if (res.data.code == 200) {
                if (res.data.data[0].item.isdo == 1) {
                    that.setData({
                        isCollect: true
                    });
                } else {
                    that.setData({
                        isCollect: false
                    });
                }
            }
        });
    },
    getMsgList: function () {
        var that = this;
        network.POST({
            url: 'v14/news/comments-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "resourcetypeid": 11,
                "page": page,
                "resourceid": id
            },
            success: function (res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        messages: res.data.data[0].list
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
        var that = this;
        if (that.data.messages.length > 0){
            if (hasmore) {
                page++;
                that.getMsgList();
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        } 
    },
    toApplyBarter: function () {
        //   console.log(this.data.detail);
        if (loginUserId == this.data.detail.userInfo.uid) {
            wx.showToast({
                title: '不能跟自己兑换',
                icon: 'none',
                duration: 1000
            });
        } else {
            wx.navigateTo({
                url: '/pages/home/pages/barter/applyBarter/applyBarter?id=' + id
            });
        }

    },
    inputFn: function (e) {
        this.setData({
            msg: e.detail.value
        });
    },
    submitCommt: function () {
        var that = this;
        var a = that.data.placeholder + that.data.msg;
        if (a) {
            network.POST({
                url: 'v14/news/comments-add',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "resourcetypeid": 11,
                    "resourceid": id,
                    "content": a,
                    "parent": parentId
                },
                success: function (res) {
                    // console.log(res);
                    wx.hideLoading();
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    });

                    if (res.data.code == 200) {
                        that.getMsgList();
                        that.setData({
                            msg: ''
                        });
                    }
                    that.hideDialog();
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
        } else {
            wx.showToast({
                title: '请输入内容',
                icon: 'none',
                duration: 1000
            });
        }
    },
    showDialog: function () {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        this.animation = animation;
        animation.translateY(300).step();
        this.setData({
            animationData: animation.export(),
            isShowDialog: true,
            msg: ''
        });
        setTimeout(function () {
            animation.translateY(0).step();
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200);
    },
    hideDialog: function () {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        this.animation = animation;
        animation.translateY(300).step();
        this.setData({
            animationData: animation.export()
        });
        setTimeout(function () {
            animation.translateY(0).step();
            this.setData({
                animationData: animation.export(),
                isShowDialog: false
            });
        }.bind(this), 200);
    },
    addReplyMsg: function (e) {
        var that = this;
        var uid = '';
        var ty = e.type;
        //   console.log(e);
        if (ty == 'tap') {
            uid = e.currentTarget.dataset.uid;
            parentId = e.currentTarget.dataset.parent;
            that.setData({
                placeholder: ''
            });
        } else {
            uid = e.detail.uid;
            parentId = e.detail.pid;
            that.setData({
                placeholder: '回复@' + e.detail.uname + ':'
            });
        }
        // console.log(loginUserId, '--------', uid);
        if (loginUserId == uid) {
            wx.showToast({
                title: '不能回复自己',
                icon: 'none',
                duration: 1000
            });
        } else {
            that.showDialog();
        }
    }
})