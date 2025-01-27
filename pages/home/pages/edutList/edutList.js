const network = require("../../../../utils/main.js");
const moment = require("../../../../utils/moment.js");
var app = getApp();

Page({
    data: {
      show: {
        middle: false,


      },
        base: '../../../../',
        IMGURL: app.imgUrl,
        teacList: '',
        course_sy: '',
        course_gg: '',
        course_wk: '',
        course: '',
        imgUrls: [],
      flg: false,
    },
  onShow: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.customMethod()
  },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
  toggle(type) {
    this.setData({
      [`show.${type}`]: !this.data.show[type]
    });
  },
  noBuy: function () {
    let that = this;
    this.toggle('middle');
    if (this.freeTry()) {
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
  freeTry: function () {
    let that = this;
    let createTime = app.userInfo.create_time;
    let start = moment(createTime);
    let end = moment();
    let freeTime = end.diff(start, 'days');
    if (freeTime < 3) {
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
    console.log(e)
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
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        var that = this;
        that.setData({
            idname:app.idname
        })
        network.teacherLevel();
        that.getSwipImgs();
        that.getTeacList();
        that.getCourseList();
    },
    getTeacList: function () {       
      var that = this;
      network.getTeacher(1,2, function (res) {
        wx.hideLoading();
        var a = res.data.data[0].list;
        if (res.data.code == 200) {
          that.setData({
            teacList: a,
          });
        }
        else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      }, function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
            icon: 'none',
          duration: 1000
        });
      });
    },
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
    getCourseList: function () {
        var that = this;
        network.POST({
            url: 'v13/ncourse/course-home',
            params: {
                "mobile": app.userInfo.mobile,
                // "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                // console.log(res.data.data[0].item1.list)
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].item1.list;
                    var b = res.data.data[0].item2.list;
                    var c = res.data.data[0].item3.list;

                    a = that.sliceArr(a);
                    b = that.sliceArr(b);
                    c = that.sliceArr(c);
           
                    that.setData({
                        course: res.data.data[0],
                        course_sy: a,
                        course_gg: b,
                        course_wk: c
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
    },
    sliceArr(arr) {
        var a = [];
        var res = [];
        for (var i = 0; i < arr.length; i += 3) {
            var b = arr.slice(i, i + 3);
            a.push(b);
            res.push(a);
            a = [];
        };
        return res;
    },
    tz_courselist:function(e){
      wx:wx.navigateTo({
        url: '/pages/home/pages/courseList/courseList?mytopid=' + e.currentTarget.dataset.mytopid,
      })
    },
    tz_detail: function (e) {   
      // console.log(e.currentTarget.dataset) 
      var token = wx.getStorageSync("userInfo")
     
      if (token == "") {
        this.setData({
          flg: true
        })
      } else {
        // wx.navigateTo({
        //   url: '/pages/home/pages/courseList/courseDetail/courseDetail?courseid=' + e.currentTarget.dataset.myid + '&videopic=' + e.currentTarget.dataset.videopic,
        // })
        this.memberExpires(e);
      } 
     
    },
    getSwipImgs: function () {
      var that = this;
      network.getSwiperImgs(5, function (res) {
        // console.log(res);
        if (res.data.code == 200) {
          that.setData({
            imgUrls: res.data.data[0].list
          });
        }
      });
    },


  tonav01:function(){
    var token = wx.getStorageSync("userInfo")

    if (token == "") {
      this.setData({
        flg: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/pages/preview/preview',
      })
    } 
  },
  tonav02: function () {
    var token = wx.getStorageSync("userInfo")

    if (token == "") {
      this.setData({
        flg: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/pages/think/think',
      })
    }
  },
  tonav03: function () {
    var token = wx.getStorageSync("userInfo")

    if (token == "") {
      this.setData({
        flg: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/pages/game/gameList/gameList?gametype=1&title=明日之星',
      })
    }
  },
  tonav04: function () {
    var token = wx.getStorageSync("userInfo")

    if (token == "") {
      this.setData({
        flg: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/pages/game/gameList/gameList?gametype=2&title=王者之战',
      })
    }
  },
  tonav05: function () {
    var token = wx.getStorageSync("userInfo")

    if (token == "") {
      this.setData({
        flg: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/pages/game/gameList/gameList?gametype=3&title=挑战赛',
      })
    }
  },
  tonav06: function () {
    var token = wx.getStorageSync("userInfo")

    if (token == "") {
      this.setData({
        flg: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/pages/game/gameList/gameList?gametype=4&title=过关斩将',
      })
    }
  }
})