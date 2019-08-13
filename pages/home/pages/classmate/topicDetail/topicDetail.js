const network = require("../../../../../utils/main.js");
var app = getApp();
Page({
  data: {
    list:'',
      base: '../../../../../'
  },
  onLoad: function (options) {
    var that=this;
    // console.log(options)
    var b = wx.getStorageSync('topic');
    // console.log(b)
    that.setData({
      list:b.categorytopic,
      topicname: options.topicname,
      title: options.topicname
    })
    // wx.setNavigationBarTitle({ title: options.topicname })
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
  tz_topicdetaildetail: function (e) {
    wx.navigateTo({
     
      url: '/pages/home/pages/classmate/topicDetail/topicDetailDetail/topicDetailDetail?topicnamedetail=' + e.currentTarget.dataset.topicnamedetail + '&forumid=' + e.currentTarget.dataset.forumid + '&readvolume=' + e.currentTarget.dataset.readvolume + '&count=' + e.currentTarget.dataset.count + '&topicimg=' + e.currentTarget.dataset.topicimg + '&topicdes=' + e.currentTarget.dataset.topicdes
    })
  },
})