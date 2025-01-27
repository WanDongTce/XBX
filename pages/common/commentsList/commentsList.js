const network = require("../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = '';
var id = '';
var typeid = '';
var access_token

Page({
    data: {
        base: '../../../',
        placeholder: '',
        typeid: typeid,
        height: 'auto',
        list: [],
        msg: '',
        showId: '',
        showEmpty: false
    },
  onShow: function () {
    var that = this;
    that.gettoken()
    that.component = that.selectComponent("#component")
    that.component.customMethod()
  },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    onLoad: function (options) {
        // console.log(options);
        var that = this;
        id = options.id;
        typeid = options.typeid;
        that.setData({
            typeid: typeid,
            placeholder: typeid == 1? '写跟帖': '写评论'
        });

        this.empty = this.selectComponent("#empty");
        this.addAgre = this.selectComponent("#addAgre");
        this.accord = this.selectComponent("#accord");
        this.compontNavbar = this.selectComponent("#compontNavbar");

        that.getList();
    },
    inputFn: function (e) {
        this.setData({
            msg: e.detail.value
        });
    },
    getList: function () {
        var that = this;
        network.POST({
            url: 'v14/news/comments-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "resourcetypeid": typeid,
                "page": page,
                "resourceid": id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    that.setData({
                        list: a,
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
    onReachBottom: function () {
        var that = this;
        if (that.data.list.length > 0) {
            if (hasmore) {
                page++;
                that.getList();
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }

    },
  gettoken: function () {
    var userInfo = wx.getStorageSync('userInfo')
    var userid = userInfo.id
    console.log(userid)
    wx.request({
      url: app.requestUrl + 'v14/public/get-new-token',
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
    submitCommt: function () {
        var that = this;
        var a = that.data.msg;
        if (a) {
          wx.request({
            url: 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' + access_token,
            data: {
              "content": a
            },
            method: 'POST',
            success:function(res){
              console.log(res)
              if (res.data.errcode == 0){
                network.POST({
                  url: 'v14/news/comments-add',
                  params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "resourcetypeid": typeid,
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
                      that.getList();
                      that.setData({
                        msg: ''
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
            })
        }
    },
    modiHeight: function (e) {
        var b = e.currentTarget.dataset.id;
        if (this.data.showId == b) {
            this.setData({
                showId: ''
            });
        } else {
            this.setData({
                showId: b
            });
        }

    },
    onUnload: function () {
        page = 1;
        hasmore = '';
        this.setData({
            showEmpty: false,
            msg: ''
        });
    }
})