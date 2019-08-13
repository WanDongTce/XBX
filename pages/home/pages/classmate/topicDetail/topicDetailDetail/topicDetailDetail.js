const network = require("../../../../../../utils/main.js");
var app = getApp();
var page = 1;
var contaFlag = false;
var hasmore = '';
Page({
  data: {
    
    list: '',
    page: 1,
    contaFlag: false,
    topicimg: '',
    readvolume: '',
    count: '',
    topicnamedetail: '',
    topicdes: '',
    myshow: false,
      base: '../../../../../../'
  },
  onLoad: function (options) {
    // console.log(options)
    // wx.setNavigationBarTitle({ title: options.topicnamedetail })
    var that=this;
    that.setData({
      topicnamedetail: options.topicnamedetail,
      forumid: options.forumid,
      topicimg: options.topicimg,
      readvolume: options.readvolume,
      count: options.count,
      topicdes: options.topicdes,
      title: options.topicnamedetail
    })

    // var b = wx.getStorageSync('topic');
    // console.log(b)
  },
  onShow: function () {
    page = 1;
    this.getList(true, page);
    that.component = that.selectComponent("#component")
    that.component.customMethod()
  },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
  getList: function (contaFlag, page) {
    var that = this;
    network.POST({
      url: 'v11/post/post-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "community_id": app.userInfo.register_community_id,
        "forum_id": that.data.forumid,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data.item;
          if (contaFlag == false) {
            // a = that.data.list.concat(a);
            that.setData({
              list: that.data.list.concat(a),
            });
          }
          else {
            // console.log(a)
            that.setData({
              list: a,
              myshow: a.length == 0 ? true : false,
            });
            // console.log(that.data.list)
          }
          hasmore = res.data.data.pageCount;
          // console.log(hasmore)
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
  // 点赞
  addAgree: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.dianzan)
    if (e.currentTarget.dataset.dianzan == 1) {
      wx.showToast({
        title: '您已点赞',
          icon: 'none',
        duration: 1000
      });
    }
    else {

      network.POST({
        url: 'v6/post/thumbs-for-post',
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "author_mobile": e.currentTarget.dataset.ftrphone,
          "post_id": e.currentTarget.dataset.postid
        },
        success: function (res) {
          console.log(res);
          wx.hideLoading();
          if (res.data.code == 200) {
            for (var i = 0; i < that.data.list.length; i++) {
              if (that.data.list[i].id == e.currentTarget.dataset.postid) {
                that.data.list[i].is_thumbs = 1;
                that.setData({
                  list: that.data.list
                })
              }
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
    }
  },
  onReachBottom: function () {
    var that = this;

    if (that.data.list.length > 0) {
      if (hasmore > 1) {
        page++;
        if (page <= hasmore) {
          that.getList(false, page);
        } else {
          wx.showToast({
            title: '没有更多了',
              icon: 'none',
            duration: 1000
          })
        }
      } else {
        wx.showToast({
          title: '没有更多了',
            icon: 'none',
          duration: 1000
        })
      }
    }
  },
  //跳转到详情
  tz_detail: function (e) {

    var a = e.currentTarget.dataset.item;
    wx.setStorageSync("classmate", a);
    wx.navigateTo({
      url: '/pages/home/pages/classmate/classmateDetail/classmateDetail',
    })
  },
  tz_write: function () {
    wx.navigateTo({
      url: '/pages/home/pages/classmate/classmateWrite/classmateWrite',
    })
  },
  onUnload: function () {
    page = 1;
    // subId = 0;
    // hasmore = null;

    // this.setData({
    //   showEmpty: false,
    //   keyword: ''
    // });
  },
    toWrite: function () {
        wx.navigateTo({
            url: '/pages/home/pages/classmate/classmateWrite/classmateWrite'
        })
    },
})

