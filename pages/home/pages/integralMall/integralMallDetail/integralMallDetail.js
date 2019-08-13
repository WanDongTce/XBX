const network = require("../../../../../utils/main.js");
const wxParse = require('../../../../../wxParse/wxParse.js');
const app = getApp();
var id = '';
var page = 1;
var pageSize = 8;

Page({
    data: {
        base: '../../../../../',
        imgIndex: 0,
        isCollect: false,
        detail: '',
        content: '',
        tel: app.contactTel,
        recommendList: [],
        commentList: [],
        showGift: false,
        showGiftCount: 0,
        giftInfo: '',
        animationData: null,
        animationData2: null,
        scrollTop: 0,//新加的
        scrollTop0: 0,
        height6: 0,
        height0: '',
        opicity: 0,
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        var that  = this;
        
        id = options.id;
        that.getDetail(); 
        that.getHeight();
    },
    onShow(){
        var that = this;
        that.getCommentList();
      that.component = that.selectComponent("#component")
      that.component.customMethod()
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    getDetail: function () {
        var that = this;
        network.POST({
            url: 'v14/shop-point/detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                var a = res.data.data[0].item;
                if (res.data.code == 200) {
                    that.setData({
                        detail: a,
                        content: a.content
                    });

                    //   console.log(a.content);
                    wxParse.wxParse('content', 'html', a.content, that, 5);

                    that.getRecommendList();
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
    getRecommendList(){
        var that = this;
        network.POST({
            url: 'v14/shop-point/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "pagesize": pageSize,
                "typeid": that.data.detail.point_type_id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                var a = res.data.data[0].list;
                if (res.data.code == 200) {
                    that.setData({
                        recommendList: a
                    });
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
    getCommentList(){
        var that = this;
        network.POST({
            url: 'v14/news/comments-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "resourcetypeid": 6,
                "resourceid": id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                var a = res.data.data[0].list;
                if (res.data.code == 200) {
                    that.setData({
                        commentList: a
                    });
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
    toSettlement: function (e) {
        // this.memberExpires(e);
        var a = e.currentTarget.dataset.item;
        // console.log(a);
        wx.setStorageSync("goods", a);
        wx.navigateTo({
            url: '/pages/home/pages/integralMall/settlement/settlement'
        });
    },
    memberExpires() {
        var that = this;
        network.memberExpires(function (res) {
            // console.log(res);
            if (res.data.data[0].item.is_end == 1) {
                wx.showToast({
                    title: '会员已到期,请续费~',
                    icon: 'none'
                });
            } else {
                var a = e.currentTarget.dataset.item;
                // console.log(a);
                wx.setStorageSync("goods", a);
                wx.navigateTo({
                    url: '/pages/home/pages/integralMall/settlement/settlement'
                });
            }
        });
    },
    makePhone(e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone
        })
    },
    addCollect(){
        var that = this;
        network.collect(6, id, function(res){
            // console.log(res);
            that.setData({
                isCollect: true
            });
        });
    },
    getGift(){
        var that = this;
        network.POST({
            url: 'v13/ngift/get-rand',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    console.log(res);
                    if (res.data.data[0]){
                        that.setData({
                            giftInfo: res.data.data[0].item
                        });
                        that.showGift();
                    }else{
                        that.showGift();
                        // that.setData({
                        //     showGiftCount: 1
                        // });
                        // wx.showToast({
                        //     title: '很遗憾,没有宝物',
                        //     icon: 'none'
                        // })
                    }
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
    recGift(){
        var that = this;
        that.hideGift();
        wx.navigateTo({
            url: '/pages/my/pages/myGift/myGift'
        })
    },
    showGift: function () {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease-in-out",
            delay: 0
        });
        var animation2 = wx.createAnimation({
            duration: 200,
            timingFunction: "ease",
            delay: 0
        });
        this.animation = animation;
        this.animation2 = animation2;
        animation.scale(1.2).step();
        this.setData({
            animationData: animation.export(),
            showGift: true,
            showGiftCount: 1
        });
        setTimeout(function () {
            animation.scale(1).step();
            this.setData({
                animationData: animation.export(),
                animationData2: animation2.export()
            })
            animation2.translateY(300).step();
        }.bind(this), 200);
        setTimeout(function () {
            animation2.translateY(0).step();
            this.setData({
                animationData2: animation2.export()
            })
        }.bind(this), 100);
    },
    hideGift: function () {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease",
            delay: 0
        });
        var animation2 = wx.createAnimation({
            duration: 200,
            timingFunction: "ease",
            delay: 0
        });
        this.animation = animation;
        this.animation2 = animation2;
        animation.scale(1.2).step();
        animation2.translateY(350).step();
        this.setData({
            animationData: animation.export(),
            animationData2: animation2.export()
        });
        setTimeout(function () {
            animation.scale(-2).step();
            animation2.translateY(800).step();
            this.setData({
                animationData: animation.export(),
                animationData2: animation2.export(),
                showGift: false
            });
        }.bind(this), 200);
    },
    onShareAppMessage() {
        var that = this;
        // console.log(that.data.detail);
        return {
            title: that.data.detail.name,
            path: '/pages/home/pages/integralMall/integralMallDetail/integralMallDetail?id=' + id,
            imageUrl: that.data.detail.pic_url,
            success: function (res) {
                network.share(6, id);
            }
        };
    },
    onUnload(){
        this.setData({
            showGiftCount: 0
        });
    },
    scroll: function (e) {
        var that = this;
        that.setData({
            scrollTop: e.detail.scrollTop,
        })
        var query6 = wx.createSelectorQuery();
        query6.select('#newtopbox').boundingClientRect()
        query6.exec(function (res) {
            that.setData({
                height6: res[0].height
            })
        })
        console.log(that.data.height6)
        if (e.detail.scrollTop == 0) {
            that.setData({
                opicity: 0
            })
        }
        else {
            that.setData({
                opicity: (e.detail.scrollTop + that.data.height6) / that.data.height0
            })
        }
        
        var query1 = wx.createSelectorQuery().in(this)
        query1.select('#imgs-box').boundingClientRect(function (res) {
            that.setData({
                nodeOneT: res.top,
            })
        }).exec()

        var query2 = wx.createSelectorQuery().in(this)
        query2.select('#info-box').boundingClientRect(function (res) {
            that.setData({
                nodeOneB: res.bottom,
            })
        }).exec()

        var query3 = wx.createSelectorQuery().in(this)
        query3.select('#comment-box').boundingClientRect(function (res) {
            that.setData({
                nodeTwoT: res.top,
            })
        }).exec()

        var query4 = wx.createSelectorQuery().in(this)
        query4.select('#recommend-box').boundingClientRect(function (res) {
            that.setData({
                nodeThreeT: res.top,
            })
        }).exec()

        var query5 = wx.createSelectorQuery().in(this)
        query5.select('#detail-box').boundingClientRect(function (res) {
            that.setData({
                nodeFourT: res.top,
                nodeFourB: res.bottom,
            })
        }).exec()
    },
    getHeight: function () {
        var that = this;

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    scrollHeight: res.windowHeight,
                    windowHeight: res.windowHeight,
                    conversion: res.windowWidth / 750
                });
            }
        });

        var query1 = wx.createSelectorQuery();
        query1.select('#imgs-box').boundingClientRect()
        query1.exec(function (res) {
            that.setData({
                height1: res[0].height + that.data.conversion * 30,
                height0: res[0].height
            })
            // console.log('height1', that.data.height1);
        })

    },
    clickMenu: function (e) {
        this.setData({
            anchor: e.currentTarget.dataset.anchor
        })
        // console.log(this.data.anchor)
    },
    goBack: function () {
        wx.navigateBack({
            delta: 1
        });
    }
})