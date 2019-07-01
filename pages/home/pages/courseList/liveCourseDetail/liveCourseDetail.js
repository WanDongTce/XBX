const network = require("../../../../../utils/main.js");
const app = getApp();
var courseid = '';
Page({
  data: {
      base: '../../../../../',
    list:[],
    enrolltext:'立即报名',
    enroll:false,
    state:''
  },
  onLoad: function (options) {
    // console.log(options)
    courseid = options.id;
    var that=this;
    this.getList();
    
  },
  getList:function(){
    var that = this;
    network.POST({
      url: 'v14/live-course/detail',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "cid": courseid,
        
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].item;          
          that.setData({
            list: a,
            state: a.state           
          });
        //   console.log(that.data.state)
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
  //点击报名
  enroll: function () {
    var that = this;
    network.POST({
      url: 'v14/live-course/enroll',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "cid": courseid,
        "uname":app.userInfo.register_realname,
        "utel": app.userInfo.mobile,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          //报名成功后
          wx.showToast({
            title: '报名成功',
              icon: 'none',
            duration: 1000
          });
          that.setData({
            enrolltext:'已报名',
            enroll:true
          })
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
  onShow: function () {
    
  }
})