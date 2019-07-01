const network = require("../../../../utils/main.js");
const app = getApp();


var hasmore = null;
var hasmore2 = null;
var hasmore3= null;
Page({
    data: {
        tabs: [{ index: 0, title: '我的物品', width: '30%' },{ index: 1, title: '申请我的', width: '30%' }, { index: 2, title: '我的申请', width: '30%' }, ],
        // tabs: [{ index: 0, title: '申请我的', width: '30%' },{ index: 1, title: '我的申请', width: '30%' }],
        curIndex: 0,
        pageYihuo: 1,
        pageApply: 1,
        pagelist: 1,
        scrollHeight: 1000,
        showEmpty: false,
        yihuoList: [],
        list: [],
        
    },
    swiTab: function (e) {
        var a = e.currentTarget.dataset.index;
        this.setData({
            curIndex: a,
            showEmpty: false
        });
        // console.log(a)
        if (a == 2) {
            this.getApplyList(false, this.data.pageApply);
        }
        else if(a==1) {
            this.getYihuoList(false, this.data.pageYihuo);
        }
        else if(a==0){
            this.getList(false, this.data.pagelist);
        }
        wx.setStorage({
            key: "mybartertap",
            data: this.data.curIndex
        })
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
        
        this.setData({
            scrollHeight: app.systemInfo.windowHeight - app.systemInfo.windowWidth / 750 * 88
        });
        var that=this;
        wx.setStorage({
            key: "mybartertap",
            data: that.data.curIndex
        })
        // wx.getStorage({
        //     key: 'mybartertap',
        //     success: function (res) {
        //         console.log(res.data)
        //     }
        // })
    },
    onShow: function () {
        var that = this;
        

        wx.getStorage({
            key: 'mybartertap',
            success: function (res) {
                console.log(res.data)
                if (res.data == 1) {
                    that.setData({
                        curIndex: 1,
                        showEmpty: false
                    });
                    that.getYihuoList(false, that.data.pageYihuo);
                }
                else if (res.data == 2) {
                    that.setData({
                        curIndex: 2,
                        showEmpty: false
                    });
                    that.getApplyList(false, that.data.pageApply);
                    
                }
                else{
                    that.setData({
                        curIndex: 0,
                        showEmpty: false
                    });
                    that.getList(false, that.data.pagelist);
                }
            }
        })
    },

    //申请我的
    getYihuoList: function (contaFlag, page) {
        var that = this;
        network.POST({
            url: 'v14/easy-goods/exchange-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (contaFlag) {
                        a = that.data.yihuoList.concat(a);   
                    }
                    that.setData({
                        yihuoList: a,
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
    //申请我的更多
    loadMore: function (event) {

        if (hasmore) {
            var page1 = Number(that.data.pageYihuo) + 1
            this.getYihuoList(true, page1);
        } else {
            wx.showToast({
                title: '没有更多了',
                icon: 'none',
                duration: 1000
            })
        }
    },
    //我的申请
    getApplyList: function (contaFlag, page) {
        var that = this;

        network.POST({
            url: 'v14/easy-goods/to-exchange-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": that.data.pageApply,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (contaFlag) {
                        a = that.data.applyList.concat(a);
                    }
                    that.setData({
                        applyList: a,
                        showEmpty: a.length == 0 ? true : false
                    });
                    
                    hasmore2 = res.data.data[0].hasmore;
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
    //我的申请更多
    loadMore2: function (event) {
        if (hasmore2) {
            var page2 = Number(that.data.pageApply) + 1;
            this.getApplyList(true, page2);
        } else {
            wx.showToast({
                title: '没有更多了',
                icon: 'none',
                duration: 1000
            })
        }
    },
    getList: function (contaFlag, page) {
        var that = this;
        network.POST({
            url: 'v14/easy-goods/my-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page
            },
            success: function (res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {

                    var a = res.data.data[0].list;
                    if (contaFlag) {
                        a = that.data.list.concat(a);
                    }

                    // console.log(a);
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
    loadMore3: function (event) {
        if (hasmore3) {
            var page3 = Number(that.data.pagelist) + 1;
            this.getList(true, page3);
        } else {
            wx.showToast({
                title: '没有更多了',
                icon: 'none',
                duration: 1000
            })
        }
    },
    //点击我的易货详情
    tz_mybarterDetail: function (e) {
        // console.log(e.currentTarget.dataset)
        wx.navigateTo({
            url: '/pages/my/pages/myBarterDetail/myBarterDetail?id=' + e.currentTarget.dataset.id + '&direction=' + e.currentTarget.dataset.direction
        })
    },
    //点击我的物品
    tz_mygoods: function () {
        wx.navigateTo({
            url: '/pages/my/pages/mygoods/mygoods'
        })
    },
    //取消申请
    qxsq_btn: function (e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '是否取消申请？',
            success: function (res) {
                if (res.confirm) {
                    // console.log('用户点击确定')
                    network.POST({
                        url: 'v14/easy-goods/cancel',
                        params: {
                            "mobile": app.userInfo.mobile,
                            "token": app.userInfo.token,
                            "log_id": e.currentTarget.dataset.myid
                        },
                        success: function (res) {
                            //   console.log(res);
                            wx.hideLoading();
                            if (res.data.code == 200) {
                                wx.showToast({
                                    title: '操作成功',
                                    icon: 'success',
                                    duration: 1000
                                });

                                that.getApplyList(false, that.data.pageApply);
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
                } else if (res.cancel) {
                    // console.log('用户点击取消')
                }
            }
        })

    },
    //删除
    del_btn: function (e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '是否删除？',
            success: function (res) {
                if (res.confirm) {
                    // console.log('用户点击确定')
                    network.POST({
                        url: 'v14/easy-goods/exchange-delete',
                        params: {
                            "mobile": app.userInfo.mobile,
                            "token": app.userInfo.token,
                            "log_id": e.currentTarget.dataset.myid
                        },
                        success: function (res) {
                            //   console.log(res);
                            wx.hideLoading();
                            if (res.data.code == 200) {
                                wx.showToast({
                                    title: '操作成功',
                                    icon: 'success',
                                    duration: 1000
                                });

                                that.getApplyList(false, that.data.pageApply);
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
                } else if (res.cancel) {
                    // console.log('用户点击取消')
                }
            }
        })
    },
    //点击申请我的 item,
    tz_applylist: function (e) {
        wx.navigateTo({
            url: '/pages/my/pages/applyList/applyList?id=' + e.currentTarget.dataset.id
        })
    },
    //跳转到物品详情
    tz_beforedetail: function (e) {
        wx.navigateTo({
            url: '/pages/home/pages/barter/barterDetail/barterDetail?id=' + e.currentTarget.dataset.myid + '&leftstate=' + e.currentTarget.dataset.mystate + '&rightstate=' + e.currentTarget.dataset.rightstate,
        })
    },
    onUnload: function(){
        this.setData({
            showEmpty: false
        });
    },
    publish_btn: function (e) {
        var that = this;
        var a = e.currentTarget.dataset;

        network.POST({
            url: 'v14/easy-goods/up-release',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": a.myid,
                "releasestatus": a.state
            },
            success: function (res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.getList(false);
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
    toRelease: function () {
        wx.navigateTo({
            url: "/pages/home/pages/barter/releaseBarter/releaseBarter"
        });
    },
    toEdit: function (e) {
        wx.navigateTo({
            url: "/pages/my/pages/editMygoods/editMygoods?id=" + e.currentTarget.dataset.id
        });
    },
})