const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = '';
Page({
    data: {
        base: '../../../../',
        title: '',
        imgUrls: [],
        activityimgUrls: [],
        IMGURL: app.imgUrl,
        // courseList: [],
        newsList: [],
        showEmpty: false,
        title: 'A计划教育平台',
        isShowDialog: false,
        animationData: null,
        actyInfo: null,
        questionList: [],
        teacList: [],
        liveCourseList: [],
        kemu: [],
        choicekemu: 0,
        showEmpty: false,
        renewMask:true,//续费弹窗
        renew_content:'',

        
    },
    onLoad: function(options) {
        // console.log(options)
        var that = this;
        if (options.mobile) {
            app.app_source_type=4;
            network.POST({
                url: 'v14/news/other-login',
                params: {
                    "mobile": options.mobile,
                    "token": options.token,
                    "other_source_type": 1,
                },
                success: function (res) {
                    // console.log(res);
                    wx.hideLoading();
                    app.app_source_type = 1;

                    var a = res.data.data[0].item;
                    wx.setStorage({
                        key: 'userInfo',
                        data: a
                    });
                    app.userInfo = a;
                    that.getSwipImgs();
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
        }
        else{
            that.getSwipImgs();
        }
        
        
    

        this.empty = this.selectComponent("#empty");
        this.compontNavbar = this.selectComponent("#compontNavbar");
        
        
        that.setData({
            changeTabsCss:true
        })
        var query = wx.createSelectorQuery();
        query.select('#queryone').boundingClientRect()
        query.exec(function (res) {
            that.setData({
                realHeight: res[0].height
            })
        })
        var querytwo = wx.createSelectorQuery();
        querytwo.select('#querytwo').boundingClientRect()
        querytwo.exec(function (res) {
            that.setData({
                realHeight2: res[0].height
            })
        })
        
    },
    tz_little: function () {
        // console.log('111')
        wx.navigateToMiniProgram({
            appId: app.parAppId,
            path: '/pages/home/home',
            extraData: {},
            success(res) {

            }
        })

    },
    onShow: function() {
        if (app.userInfo.register_community_name) {
            this.setData({
                title: app.userInfo.register_community_name
            })
        }
        wx.getSetting({
            success: (response) => {
                // console.log(response)
                // console.log(response.authSetting['scope.userLocation'])
                if (!response.authSetting['scope.userLocation']) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success: () => {
                            // console.log('11111')
                            wx.getLocation({
                                type: 'wgs84',
                                success: function (res) {
                                    // console.log(res)
                                    app.longitude = res.longitude;
                                    app.latitude = res.latitude;
                                },
                            })

                        },
                        fail() {
                            // console.log('22222')
                        }
                    })
                } else {
                    wx.getLocation({
                        type: 'wgs84',
                        success: function (res) {
                            // console.log(res)
                            app.longitude = res.longitude;
                            app.latitude = res.latitude;
                        },
                    })

                }
            }
        })
    },
    init() {
        var that = this;
        // that.memberExpires();
        that.getGoodsType();
        if (!app.allAddress) {
            network.getAllAdress();
        }
        if (!app.studyOptions) {
            that.getOptions();
        }
        that.getClassBarter();
        // that.getNewsList();
        // that.getCourseList();
        that.getQuestionList();
        that.getTeacList();
        that.getLiveCourseList(false);
        that.getActivityImg();
    },
    getActivityImg:function(){
        var that = this;
        network.getSwiperImgs(7, function (res) {
            // console.log(res);
            if (res.data.code == 200) {
                // console.log(res.data.data[0])
                if (res.data.data[0]){                    
                    that.setData({
                        activityimgUrls: res.data.data[0].list
                    }); 
                }
                else{
                    that.setData({
                        activityimgUrls: ''
                    }); 
                }              
            }
            // else {
            //     wx.showToast({
            //         title: res.data.message,
            //         icon: 'none',
            //         duration: 1000
            //     })
            // }
        });
    },
    memberExpires(){
        var that = this;
        network.memberExpires(function(res){
            // console.log(res);
            if (res.data.data[0].item.is_end == 1){
                // wx.showToast({
                //     title: '会员已到期,请续费~',
                //     icon: 'none'
                // });               
                that.setData({
                    renew_title:'您的会员已到期',
                    renew_content: '为了不影响您的正常学习，请您尽快续费',
                    renewMask:false,
                })
            }else{
                // wx.showToast({
                //     title: '会员将于' + res.data.data[0].item.end_time +'到期,请提前续费，以免影响您的使用~',
                //     icon: 'none'
                // })
                that.setData({
                    renew_title: '您的会员将于' + res.data.data[0].item.end_time + '到期',
                    renew_content: '为了不影响您的正常学习，请您尽快续费',
                    renewMask: false,
                })
            }
        });
    },
    //点击会员到期续费弹窗的确定按钮
    renewBtn:function(){
        this.setData({           
            renewMask: true,
        })
    },
    //作业即答
    getQuestionList: function() {
        var that = this;
        network.POST({
            url: 'v14/question/rec-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": 1,

            },
            success: function(res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    that.setData({
                        questionList: a.slice(0, 5),
                    });

                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            fail: function() {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    toQuestionDetail: function(e) {
        var a = e.currentTarget.dataset;
        var href = a.href.slice(0, a.href.indexOf('?'));
        var p = a.href.slice(a.href.indexOf('?') + 1);
        wx.navigateTo({
            url: "/pages/common/webView/webView?src=" + href + '&' + p + '&miniPro=1'
        });
    },
    //在线名师
    getTeacList: function() {
        var that = this;
        network.getTeacher(1, 1, function(res) {
            wx.hideLoading();
            var a = res.data.data[0].list;
            if (res.data.code == 200) {
                that.setData({
                    teacList: a,
                });
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                })
            }
        }, function() {
            wx.hideLoading();
            wx.showToast({
                title: '服务器异常',
                icon: 'none',
                duration: 1000
            });
        });
    },
    //直播课程
    getLiveCourseList: function(flag) {
        var that = this;
        network.POST({
            url: 'v14/live-course/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "subjectid": that.data.choicekemu
            },
            success: function(res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (flag) {
                        a = that.data.liveCourseList.concat(a);
                    }
                    that.setData({
                        liveCourseList: a,
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
            fail: function() {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    onReachBottom: function() {
        var that = this;
        if (that.data.liveCourseList.length > 0) {
            if (hasmore) {
                page++;
                that.getLiveCourseList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                });
            }
        }
    },
    toLiveCourseDetail: function(e) {
        var a = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/home/pages/courseList/liveCourseDetail/liveCourseDetail?id=" + a
        })
    },
    getActy() {
        var that = this;
        network.getActy(function(res) {
            // console.log(res);
            that.setData({
                actyInfo: res.data.data[0].item
            });

            wx.hideTabBar();
            that.showDialog();
        });
    },
    getSwipImgs: function() {
        var that = this;
        network.getSwiperImgs(1, function(res) {
            // console.log(res);
            if (res.data.code == 200) {
                that.setData({
                    imgUrls: res.data.data[0].list
                });
                // console.log(that.data.imgUrls);

                that.init();
            }
            // else {
            //     wx.showToast({
            //         title: res.data.message,
            //         icon: 'none',
            //         duration: 1000
            //     })
            // }
        });
    
    },
    getNewsList: function() {
        var that = this;
        network.getNews(1, function(res) {
            wx.hideLoading();
            var a = res.data.data[0].list;
            if (res.data.code == 200) {
                that.setData({
                    newsList: a,
                    showEmpty: a.length == 0 ? true : false
                });
            }
            // else {
            //     wx.showToast({
            //         title: res.data.message,
            //         icon: 'none',
            //         duration: 1000
            //     })
            // }
        }, function() {
            wx.hideLoading();
            wx.showToast({
                title: '服务器异常',
                icon: 'none',
                duration: 1000
            });
        });
    },
    /*
    getCourseList: function () {
        var that = this;
        network.POST({
            url: 'v13/ncourse/course-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": 1,
                "subjectid": '',
                "teacherid": '',
                "search": ''
            },
            success: function (res) {
                wx.hideLoading();
                // console.log(res);
                if (res.data.code == 200) {
                    that.setData({
                        courseList: res.data.data[0].list
                    });
                    // console.log(that.data.courseList);
                } 
                // else {
                //     wx.showToast({
                //         title: res.data.message,
                //         icon: 'none',
                //         duration: 1000
                //     });
                // }
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
    */
    getOptions: function() {
        var that = this;
        network.POST({
            url: 'v14/public/conditions',
            params: {},
            success: function(res) {
                // console.log(res);
                if (res.data.code == 200) {
                    var a = res.data.data[0];
                    a.kemu.unshift({
                        id: 0,
                        title: '全部'
                    });
                    // console.log(a);
                    app.studyOptions = res.data.data[0];
                    // console.log(app.studyOptions);
                    that.setData({
                        kemu: res.data.data[0].kemu
                    });

                }
                // else {
                //     wx.showToast({
                //         title: res.data.message,
                //         icon: 'none',
                //         duration: 1000
                //     })
                // }
            },
            fail: function() {
                wx.showToast({
                    title: '获取public/conditions失败',
                    icon: 'none',
                    duration: 1000
                })
            }
        }, true);
    },
    //选择科目
    choicekemu: function(e) {
        var that = this;
        var a = e.target.dataset.id;
        that.setData({
            choicekemu: a
        })
        that.getLiveCourseList();

    },
    getClassBarter: function() {
        network.POST({
            url: 'v14/easy-goods/type-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function(res) {
                // console.log(res);
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    a.unshift({
                        id: 0,
                        name: '全部'
                    });
                    app.classBarter = a;
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
                }
            },
            fail: function() {
                wx.showToast({
                    title: '获取easy-goods/type-list失败',
                    icon: 'none',
                    duration: 1000
                })
            }
        }, true);
    },
    getGoodsType() {
        var that = this;
        network.POST({
            url: 'v14/shop-point/type-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function(res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    a.unshift({
                        id: 0,
                        name: '全部'
                    });
                    // console.log(a);
                    app.goodsType = a;
                    that.getActy();
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
                }
            },
            fail: function() {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    showDialog: function() {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease-in-out",
            delay: 0
        });
        this.animation = animation;
        animation.scale(.5).step();
        this.setData({
            animationData: animation.export(),
            isShowDialog: true
        });
        setTimeout(function() {
            animation.scale(1).step();
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200);
    },
    toActy() {
        var that = this;
        var a = that.data.actyInfo;

        this.closeDialog();

        if (a.type == 1) {
            if (a.typeid) {

                wx.navigateTo({
                    url: '/pages/home/pages/integralMall/integralMallDetail/integralMallDetail?id=' + a.typeid
                });
            } else {
                wx.navigateTo({
                    url: '/pages/home/pages/integralMall/integralMall'
                });
            }
            network.setActyCount(a.type, a.typeid, function(res) {
                // console.log(res);
            });
        }
    },
    closeDialog() {
        wx.showTabBar();
        this.setData({
            isShowDialog: false
        });
    },
    toH5(e) {
        var a = e.currentTarget.dataset;
        network.swipLink(a);
    },
    onUnload: function() {
        page = 1;
        hasmore = '';
        this.setData({
            showEmpty: false
        });
    },
    tz_signin:function(){
        wx.navigateTo({
            url: '/pages/home/pages/signin/signin'
        })
    },
    onPageScroll: function (ev) {
        // console.log(ev)
        
        var that = this;
        var realHeightTotal = that.data.realHeight2 + that.data.realHeight
        // that.setData({
        //     realHeightTotal: realHeightTotal
        // })
        // console.log(realHeightTotal)
        if (ev.scrollTop < realHeightTotal) {
            that.setData({
                changeTabsCss: true
            })
        } else {
            that.setData({
                changeTabsCss: false
            })
        }
    }
})