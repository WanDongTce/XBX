const network = require("../../../../utils/main.js");
const moment = require("../../../../utils/moment.js");
const app = getApp();
var page = 1;
var hasmore = '';
Page({
    data: {
      show: {
        middle: false,
        
       
      },
      flg:false,
      XBX: "",
      dictionary:"",
      homework:"",
      quality:"",
      space:"",
      book: "",
      bok: "",
      shop:"",
      accumulation:"",
        base: '../../../../',
        title: '',
        imgUrls: [],
        
        IMGURL: app.imgUrl,
        courselist: [],
        newsList: [],
        showEmpty: false,
        // title: 'A计划教育平台',
        isShowDialog: false,
        animationData: null,
        actyInfo: null,
       
        teacList: [],
        
        kemu: [],
       
        showEmpty: false,
        
        renew_content:'',
      freeTime: 0, //新注册号免费试用
      videoId: 0,
      videoPic: '',
      showTab: true  
    },
    // login_sun01:function(){
    //   var that=this
    //   var userinfo = wx.getStorageSync("userInfo")
    //   console.log(userinfo)
    //   if (userinfo.length==0){
    //     that.setData({
    //       flg: true
    //     })
    //   }else{
    //     wx.navigateTo({
    //       url: '/pages/home/pages/edutList/edutList',
    //     })
        
    //   }
      
     
    // },


  tolgon:function(){
    var that = this
    wx.navigateTo({
      url: '/pages/common/login/login',
    })
    that.setData({
      flg: false
    })
  },

  nonelgon: function () {
    var that = this
   
    that.setData({
      flg: false
    })
  },





    onLoad: function(options) {
        // console.log(app);   
     
        this.empty = this.selectComponent("#empty");
        this.compontNavbar = this.selectComponent("#compontNavbar");
        var that = this;
        
        that.getSwipImgs();
      that.getshow()
     
        this.setData({
            idname:app.idname
        });
      // console.log('app.userInfo',app.userInfo);   
      if(app.userInfo.mobile=='18647993992'){
        this.setData({
          showTab: false
        })
      }    
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
    getshow:function(){
      var that=this
      wx.request({
        url: app.requestUrl + 'v14/public/switch',
        data:{},
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success:function(res){
          console.log(res.data.data[0].list[0])
          var header = JSON.parse(res.data.data[0].list[0].header);
          var middle = JSON.parse(res.data.data[0].list[0].middle);
          var mine = JSON.parse(res.data.data[0].list[0].mine);
          wx.setStorageSync("header", header)
          wx.setStorageSync("middle", middle)
          wx.setStorageSync("mine", mine)
          that.setshow()
          // that.setData({
          //   home_header: res.data.data[0].list[0].home_header,
          // home_middle: res.data.data[0].list[0].home_middle
          // })
        }
      })
    },
    setshow:function(){
      var that=this
      var header=wx.getStorageSync("header")
      var middle = wx.getStorageSync("middle")
      console.log(header)
      that.setData({
        XBX: header.xbx,
        dictionary: header.dictionary,
        homework: header.homework,
        space: header.space,
        quality: header.quality,
        book: middle.book,
        box: middle.box,
        shop: middle.shop,
        accumulation: middle.accumulation
      })
    },
    onShow: function() {
        if (app.userInfo.register_community_name) {
            this.setData({
                title: app.userInfo.register_community_name
            })
          var that = this;
          
          that.component = that.selectComponent("#component")
          that.component.customMethod()
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

                                    // app.longitude = res.latitude;
                                    // app.latitude = res.longitude;
                                },
                            })

                        },
                        fail(){
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
        
        that.getGoodsType();
        if (!app.allAddress) {
            network.getAllAdress();
        }
        if (!app.studyOptions) {
            that.getOptions();
        }
        that.getClassBarter();
        that.getNewsList();
        that.getCourseList();
        
        that.getTeacList();
        
        
    },
    judge:function(){
        var that = this;
      var token = wx.getStorageSync("userInfo")
      console.log(token)
      if (token == "") {
        
        this.setData({
          flg: true
        })
      } else {
        wx.navigateTo({
          url: '/pages/home/pages/zuoyeNew/zuoyeNew',
        })
      }
      

        // wx.navigateTo({
        //     url: '/pages/home/pages/zuoyeEnter/zuoyeEnter',
        // })

        // network.POST({
        //     url: 'v14/renewal/check',
        //     params: {
        //         "mobile": app.userInfo.mobile,
        //         "token": app.userInfo.token,

        //     },
        //     success: function (res) {
        //         // console.log(res);
        //         wx.hideLoading();
        //         if (res.data.code == 200) {
        //             var a = res.data.data[0].item;

        //             if (a.is_end == 1) {
        //                 // console.log('111')
        //                 wx.navigateTo({
        //                     url: '/pages/home/pages/zuoyeJudge/zuoyeJudge',
        //                 })
        //             }
        //             else {
        //                 // console.log('222')
        //                 wx.navigateTo({
        //                     url: '/pages/home/pages/zuoyeEnter/zuoyeEnter',
        //                 })
        //             }

        //         } else {
        //             wx.showToast({
        //                 title: res.data.message,
        //                 icon: 'none',
        //                 duration: 1000
        //             });
        //         }
        //     },
        //     fail: function () {
        //         wx.hideLoading();
        //         wx.showToast({
        //             title: '服务器异常',
        //             icon: 'none',
        //             duration: 1000
        //         })
        //     }
        // });
        
    },


  course: function () {
    var that = this;
    var token = wx.getStorageSync("userInfo")
    console.log(token)
    if (token == "") {

      this.setData({
        flg: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/pages/course/course?mytopid= 0',
      })
    }

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
    
    onReachBottom: function() {
        var that = this;
        
    },
  //提示会员是否到期
  onTransitionEnd() {
    // console.log(`You can't see me 🌚`);
  },
  toggle(type) {
    this.setData({
      [`show.${type}`]: !this.data.show[type]
    });
  },

  togglePopup() {
    this.toggle('middle');
  },
  noBuy: function () {
    let that = this;
    this.toggle('middle');
    if(this.freeTry()){
      wx.navigateTo({
        url: '/pages/home/pages/courseList/courseDetail/courseDetail?courseid=' + that.data.videoId + '&videopic=' + that.data.videoPic,
      });
    }
  },
  goBuy: function () {
    wx.navigateTo({
      url: '/pages/my/pages/memberRenewalNewPay/memberRenewalNewPay'
    });
  },
  //判断会员是否过期

  onHide: function () {
    this.setData({
      show: {
        middle: false
      }
    });
    var that = this
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
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
              console.log(res.data)
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
                    // showEmpty: a.length == 0 ? true : false
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
    
    getCourseList: function () {
        var that = this;
        network.POST({
            url: 'v13/ncourse/course-list',
            params: {
                "mobile": app.userInfo.mobile,
                // "token": app.userInfo.token,
                "page": 1,
                "pagesize": 20,
                "subjectid": '',
                "teacherid": '',
                "search": ''
            },
            success: function (res) {
                wx.hideLoading();
                // console.log(res);
                var a = res.data.data[0].list;
              console.log(res.data)
                if (res.data.code == 200) {
                    that.setData({
                        courselist: a,
                        showCourseEmpty: a.length == 0 ? true : false
                    });
                } 
                else {
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
  integralMall:function(){
    var token = wx.getStorageSync("userInfo")
   
    if (token == "") {
      this.setData({
        flg: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/pages/integralMall/integralMall' 
      })
    }
  },
    onPageScroll: function (ev) {
        
    },

  tz_detail: function (e) {
    console.log('注册时间：',app.userInfo.create_time)
    var token=wx.getStorageSync("userInfo")
    console.log(token)
    if (token==""){
this.setData({
  flg:true
})
    }else{
      this.memberExpires(e);
    }
   
  },
  toteacherDetail:function(e){
    var token = wx.getStorageSync("userInfo")
    var ido=e.currentTarget.dataset.id
    if (token == ""){
      this.setData({
        flg: true
      })
    }else{
      wx.navigateTo({
        url: '/pages/home/pages/teacher/teacherDetail/teacherDetail?id=' + ido
      })
    }
  },
  classmate: function (e) {
    var token = wx.getStorageSync("userInfo")
    var ido = e.currentTarget.dataset.id
    if (token == "") {
      this.setData({
        flg: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/pages/classmate/classmate'
      })
    }
  },
  freeTry: function(){
    let that = this;
    let createTime = app.userInfo.create_time;
    let start = moment(createTime);
    let end = moment();
    let freeTime = end.diff(start, 'days');
    if(freeTime<3){
      that.setData({
        freeTime: (3 - freeTime)
      });
      return true;
    } else {
      //免费试用结束
      return false;
    }

  },
  memberExpires(e) {
    var that = this;
    network.memberExpires(function (res) {
      that.setData({
        videoId: e.currentTarget.dataset.myid,
        videoPic: e.currentTarget.dataset.videopic
      });
      that.freeTry();
      that.toggle('middle');
    }, function (res) {
      wx.navigateTo({
        url: '/pages/home/pages/courseList/courseDetail/courseDetail?courseid=' + e.currentTarget.dataset.myid + '&videopic=' + e.currentTarget.dataset.videopic,
      })
    });
  },
})