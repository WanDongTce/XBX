// pages/ls2/ls2.js
const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = null;
var flag = false;

const moment = require("../../../../utils/moment.js");
var msgtosend = '';
var info = null;
// var page = 1;

Page({

  data: {
    base: '../../../../',
    zylist: [],
    showEmpty: false,
    tabs: [{ index: 0, title: '作业即答', width: '50%' }, { index: 1, title: '作业批改', width: '50%' }],
    tabindex: 0,

    questionList: [],
    showTalk: false,
    list: [],
    jflist: [],
    myid: 0,
    show: false
  },

  onLoad: function (options) {
    var that = this;
    this.compontNavbar = this.selectComponent("#compontNavbar");
    this.empty = this.selectComponent("#empty");
    this.setData({
      tabindex: 0
    })
    this.getQuestionList(false);
    //   this.getZyList(false);   
    // this.getCheck();
    this.getUserInfo(function () {
      console.log('teacher');
    }, function () {
      console.log('student');
      that.getRenInfo();
    })
    info = {};
    //   console.log(info);

    if (info.ishot == 1) {
      this.getHotList(info.hid);
    } else if (info.ishot == 0) {
      this.getTypeList();
    } else {
      this.setData({
        list: [{
          isSelf: false,
          results: [{
            values: {
              text: '哈喽，我是小A客服，请问有什么可以帮您的?',
              isLink: false,
              id: '',
              index: 0
            }
          }],
          time: new Date(),
          timeStr: moment().format('HH:MM')
        }]
      });
    }
  },
  getUserInfo: function (cb, callback) {
    var that = this;
    network.getUserInfo(function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.data.code == 200) {
        var a = res.data.data[0].item;
        if (a.isteacher == 1) {
          cb && cb()
        } else {
          //学生
          callback & callback()
        }

      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000
        });
      }
    });
  },
  //缴费列表
  getRenInfo() {
    var that = this;
    network.POST({
      url: 'v14/renewal/index',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "order_type": 2,
        "order_type_id": 0,
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          console.log(res.data.data[0].item.price_discounts);
          var renInfo = res.data.data[0].item;
          if (renInfo.is_end == 1) {
            //过期
            that.setData({
              show: true
            });
            var list = res.data.data[0].item.price_discounts;
            for (var i = 0; i < list.length; i++) {
              list[i].id = i;
              if (i == 0) {
                list[i].checked = true;
              } else {
                list[i].checked = false;
              }
            }
            that.setData({
              renInfo: renInfo,
              jflist: list,
              myid: list[0].id,
              newmoney: list[0].price,
              savemoney: list[0].dprice,
              month: list[0].month,
            });
          } else {
            //未过期
            that.setData({
              show: false
            });
            // that.getZyList(false);
          }
          // console.log(that.data.list)
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
  memberExpires() {
    var that = this;
    network.memberExpires(function (res) {
      //过期
      that.setData({
        show: true
      })
    }, function (res) {
      //没过期
      that.setData({
        show: false
      })
    });
  },
  getCheck: function () {
    var that = this;
    network.POST({
      url: 'v14/renewal/check',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "order_type": 4,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].item;

          if (a.is_end == 1) {
            that.setData({
              showTalk: false,
              payMoney: a.unit_price
            })
          }
          else {
            that.setData({
              showTalk: true,
            })
          }

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
    //   console.log(that.data.showTalk)
  },
  goBack: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  swiTab: function (e) {
    var that = this;
    var a = e.currentTarget.dataset.index;
    page = 1;
    hasmore = '';
    flag = false;
    that.setData({
      tabindex: a,
      questionList: [],
      zylist: [],
    });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    if (a == 0) {
      that.getQuestionList(false);
    }
    else if (a == 1) {

      that.getZyList(false);
    }
    // that.getList(a, page, false);
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
  getQuestionList: function (flag) {
    var that = this;
    network.POST({
      url: 'v14/question/list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,
        "type": 2
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list;
          if (flag) {
            a = that.data.questionList.concat(a);
          }
          that.setData({
            questionList: a,
            showEmpty: a.length == 0 ? true : false
          });
          // console.log(that.data.questionList);          
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
  toDetail: function (e) {
    var a = e.currentTarget.dataset;
    wx.setStorage({
      key: 'homeworkurl',
      data: a,
    })

    // console.log(a);
    var href = a.href.slice(0, a.href.indexOf('?'));
    var p = a.href.slice(a.href.indexOf('?') + 1);
    wx.navigateTo({
      url: "/pages/common/webView/webView?src=" + href + '&' + p + '&miniPro=1'
    });
  },
  onReachBottom: function () {
    var that = this;
    var a = that.data.tabindex;
    if (a == 0 && that.data.questionList.length > 0) {
      if (hasmore) {
        page++;
        that.getQuestionList(true);
      } else {
        wx.showToast({
          title: '没有更多了',
          icon: 'none',
          duration: 1000
        });
      }
    }
    else if (a == 1 && that.data.zylist.length > 0) {
      if (hasmore) {
        page++;
        that.getZyList(true);
      } else {
        wx.showToast({
          title: '没有更多了',
          icon: 'none',
          duration: 1000
        });
      }
    }
  },
  getZyList: function (flag) {
    var that = this;
    network.POST({
      url: 'v14/home-work-custom/list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,
        "type": 1,
      },
      success: function (res) {
        //   console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list;
          if (flag) {
            var a = that.data.list.concat(a);
          }
          that.setData({
            zylist: a,
            showEmpty: a.length == 0 ? true : false
          });
          hasmore = res.data.data[0].hasmore;


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
  tz_detail: function (e) {
    wx.navigateTo({
      url: '/pages/home/pages/zuoyeDetail/zuoyeDetail?id=' + e.currentTarget.dataset.zuoyeid
    });
  },
  previewImg(e) {
    // console.log(e);
    this.setData({
      refreshFlag: false
    });
    var a = e.currentTarget.dataset;

    var c = a.imgs.split(' ');

    network.previewImg(a.img, c);
  },
  judgeLogin: function (e) {
    var that = this;
    app.showLoading();
    var that = this;
    var a = e.detail;
    if (a.errMsg == 'getUserInfo:fail auth deny') {
      wx.hideLoading();
      wx.showToast({
        title: '需要您授权',
        icon: 'none'
      });
    } else {
      wx.hideLoading();
      if (app.openId) {
        that.createOrder();
      }
      else {
        that.wxLogin();
      }

    }

  },

  wxLogin() {
    var that = this;
    network.wxLogin(function () {
      that.getOpenid();
    });
  },
  getOpenid: function () {
    var that = this;
    network.getOpenid(function () {
      that.createOrder();
    });

  },
  createOrder() {
    var that = this;
    network.POST({
      url: 'v14/renewal/create-order',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "month": 1,
        "order_type": 2,
        "order_type_id": 0,
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            payinfo: res.data.data[0].item
          });
          console.log(that.data.payinfo)
          that.pay();
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
          image: '../../../images/error.png',
          duration: 1000
        })
      }
    });
  },
  pay: function (e) {
    console.log('pay_function')
    var that = this;
    network.POST({
      url: 'v13/shop-pay/order',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "idsn": that.data.payinfo.order_sn,
        "type": 3,
        "openid": app.openId
      },
      success: function (res) {
        console.log(res);
        // var a = res.data.data[0];
        wx.hideLoading();
        if (res.data.code == 200) {
          network.wxPay(res.data.data[0], function (res) {
            // console.log(res);
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 3000
            });
            that.getZyList(false);
            that.setData({
              show: false
            });
            that.getCheck();
            // wx.navigateTo({
            //     url: '/pages/my/pages/memberRenewalNew/memberRenewalNew',
            // })
          });

        } else {
          wx.showToast({
            title: res.data.message
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

  // 作业服务-聊天
  getTypeList() {
    var that = this;
    network.POST({
      url: 'v14/help-center/help-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,
        "typeid": info.typeid,
        "ishot": 0
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list;
          var b = that.data.list;
          var c = [{
            values: {
              text: '哈喽，我是小A客服，您是不是要咨询以下问题：',
              isLink: false,
              id: '',
              index: 0
            }
          }];

          for (var i = 0; i < a.length; i++) {
            c.push({
              values: {
                text: a[i].title,
                id: a[i].id,
                isLink: true,
                index: i + 1
              }
            });
          }

          b.push({
            isSelf: false,
            results: c,
            time: new Date(),
            timeStr: moment().format('HH:MM')
          });

          that.setData({
            list: b
          });
          // console.log(that.data.list);
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
  getHotList(hid) {
    var that = this;
    network.POST({
      url: 'v14/help-center/help-detail',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "hid": hid
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].item;
          var b = that.data.list;
          var c = [];
          if (a.type == 1) {
            b.push({
              isSelf: false,
              results: [{
                values: {
                  text: a.content,
                  id: '',
                  isLink: false,
                  index: 0
                }
              }],
              time: new Date(),
              timeStr: moment().format('HH:MM')
            });
          } else if (a.type == 2) {
            for (var i = 0; i < a.subclassification.length; i++) {
              c.push({
                values: {
                  text: a.subclassification[i].title,
                  id: a.subclassification[i].id,
                  pid: a.subclassification[i].pid,
                  isLink: true,
                  index: i + 1
                }
              });
            }
            b.push({
              isSelf: false,
              results: c,
              time: new Date(),
              timeStr: moment().format('HH:MM')
            });
          }
          that.setData({
            list: b
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
  getDetail(e) {
    var that = this;
    var a = e.currentTarget.dataset.hid;
    if (a) {
      that.getHotList(a);
    }
  },
  inputFn(e) {
    msgtosend = e.detail.value.replace(/^\s*|\s*$/, '');
  },
  sendMsg() {
    if (msgtosend) {
      var that = this;
      var a = that.data.list;
      a.push({
        isSelf: true,
        text: msgtosend,
        img: app.userInfo.avatar,
        name: app.userInfo.nickname,
        time: new Date(),
        timeStr: moment().format('HH:MM')
      });
      wx.request({
        url: app.tulingUrl,
        method: 'POST',
        data: {
          "reqType": 0,
          "perception": {
            "inputText": {
              "text": msgtosend
            },
            "inputImage": {
              "url": ""
            },
            "selfInfo": {}
          },
          "userInfo": {
            "apiKey": app.tulingKey,
            "userId": app.userInfo.id
          }
        },
        success(res) {
          // console.log(res);
          if (res.statusCode == 200) {
            a.push({
              isSelf: false,
              results: res.data.results,
              isLink: false,
              id: '',
              index: 0,
              time: new Date(),
              timeStr: moment().format('HH:MM')
            });
          }
          that.pageScroll();
        },
        fail(err) {
          console.log(err);
          if (err.errMsg == 'request:fail ssl hand shake error') {
            wx.showToast({
              title: 'SSL握手失败',
              icon: 'none'
            })
          }
        },
        complete() {
          that.setData({
            list: a
          });
          // console.log(that.data.list);
          that.clearInput();
        }
      });
    }
  },
  pageScroll: function () {
    // console.log('pagescrollto')
    wx.createSelectorQuery().select('#box').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },
  clearInput: function () {
    msgtosend = '';
    this.setData({
      msg: ''
    });
  },
  onUnload: function () {
    msgtosend = '';
    this.setData({
      list: [{
        isSelf: false,
        results: [{
          values: {
            text: '哈喽，我是小A客服，请问有什么可以帮您的?'
          }
        }],
        time: new Date(),
        timeStr: moment().format('HH:MM')
      }]
    });
    page = 1;
  }
})