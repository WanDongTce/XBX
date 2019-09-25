const network = require("../../../../../utils/main.js");
const wxParse = require('../../../../../wxParse/wxParse.js');
const app = getApp();
var id = '';
var img = ''; //分享图片
var access_token

Page({
    data: {
        base: '../../../../../',
        detail: '',
        msg: '',
        isLike: false,
        mycommentnum: '',
        mynum: '',
        myagree: '',
        content: '',
      flg: false,
    },
  tolgon: function () {
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
        var that = this;
        this.compontNavbar = this.selectComponent("#compontNavbar");
        id = options.id;
        img = options.img;
        that.getDetail()
    },
    getDetail: function() {
        var that = this;
        network.POST({
            url: 'v14/news/detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": id
            },
            success: function(res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].item;
                    that.setData({
                        detail: a,
                        myagree: a.isagree,
                        mynum: a.agreenum,
                        mycommentnum: a.commentnum,
                    });
                    // console.log(that.data.myagree);
                    wxParse.wxParse('content', 'html', a.content, that, 0);
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
    inputFn: function(e) {
        this.setData({
            msg: e.detail.value
        });
    },
    submitCommt: function() {
        var that = this;
        var a = that.data.msg;
      var token = wx.getStorageSync("userInfo")
     
      if (token == "") {
        console.log(token)
        this.setData({
          flg: true
        })
      } else {
        if (a) {
          wx.request({
            url: 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' + access_token,
            data: {
              "content": a
            },
            method: 'POST',
            success: function (res) {
              if (res.data.errcode == 0) {
                network.POST({
                  url: 'v14/news/comments-add',
                  params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "resourcetypeid": 1,
                    "resourceid": id,
                    "content": a
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
                      that.setData({
                        msg: '',
                        mycommentnum: Number(that.data.mycommentnum) + 1
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
              }
            }
          })


        } else {

          wx.showToast({
            title: '请输入内容',
            icon: 'none',
            duration: 1000
          });
        }
      }
       
    },
    toCommt: function(e) {
        wx.navigateTo({
            url: '/pages/common/commentsList/commentsList?typeid=1&id=' + e.currentTarget.dataset.id
        })
    },
  onShow: function () {
    var that = this;
    var token = wx.getStorageSync("userInfo")
    if (token==""){

    }else{
      that.gettoken()
    }
    
    that.component = that.selectComponent("#component")
    that.component.customMethod()
  },
  gettoken: function () {
    var userInfo = wx.getStorageSync('userInfo')
    var userid = userInfo.id
    console.log(userid)
    wx.request({
      url: app.requestUrl + 'v14/public/get-new-token ',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'userid': userid,
        "mini_type": 'xuabaxue'

      },
      success: function (res) {
        console.log(res.data.data[0].access_token)
        access_token = res.data.data[0].access_token
      }
    })
  },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    isLike: function() {
        var that = this;
        var a = that.data.myagree;
        if (a == 1) {
            wx.showToast({
                title: '您已点赞',
                icon: 'none'
            })
        } else {
            that.setData({
                mynum: Number(that.data.mynum) + 1,
                myagree: 1
            });
            network.addAgree(1, that.data.id);
        }
    },
    onShareAppMessage() {
        var that = this;
        // console.log(that.data.detail);
        return {
            title: that.data.detail.name,
            path: '/pages/find/pages/news/newsDetail/newsDetail?id=' + id,
            imageUrl: img,
            success: function(res) {
                network.share(1, id);
            }
        };
    }
})