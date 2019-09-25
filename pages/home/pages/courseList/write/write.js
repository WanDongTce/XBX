const network = require("../../../../../utils/main.js");
const app = getApp();
var mytag=1;
var courseid = '';
var parent='';
var access_token
Page({
  data: {
      base: '../../../../../',
    value:''
  },
  onLoad: function (options) {
    this.compontNavbar = this.selectComponent("#compontNavbar");

    // console.log(options.mytag)
    // console.log(options.courseid)
    mytag = options.mytag;
    courseid = options.courseid;
    parent = options.parent;
    var that=this;
    that.gettoken()
    // mytag = options.mytag;
    if (mytag == 1) {
      //问个问题
      wx.setNavigationBarTitle({ title: '提问' })
      that.setData({
        placeholder:'点击输入提问内容',
        navtitle:'提问',
        maxlength:140
      })
    }
    else if (mytag == 2) {
      //记个笔记
      wx.setNavigationBarTitle({ title: '新增笔记' })
      that.setData({
        placeholder: '点击输入笔记内容',
        navtitle: '新增笔记',
        maxlength: -1
      })
    }
    else if (mytag == 3){
      //发个评论
      wx.setNavigationBarTitle({ title: '评论' })
      that.setData({
        placeholder: '点击输入评论内容',
        navtitle: '评论',
        maxlength: 140
      })
    }
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
  bindFormSubmit: function (e) {
    var that=this;
    var neirong = e.detail.value.neirong.replace(/^\s*|\s*$/, '');
    if (neirong.length == 0) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    else{
      if (mytag==1){
        //提问
        // console.log(11)
        that.submitTw(neirong);
      }
      else if (mytag == 2) {
        //新增笔记
        // console.log(22)
        that.submitNote(neirong);
      }
      else if (mytag == 3) {
        //新增评论
        // console.log(33)
        that.submitPl(neirong);
      }
    }
  },
  gettoken:function(){
    var userInfo = wx.getStorageSync('userInfo')
    var userid=userInfo.id
    console.log(userid)
    wx.request({
      url: app.requestUrl+'v14/public/get-new-token ',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        'userid': userid,
        "mini_type":'xuabaxue'

      },
      success:function(res){
        console.log(res.data.data[0].access_token)
        access_token = res.data.data[0].access_token
      }
    })
  },
  submitTw: function (neirong){
    var that = this;
    console.log(neirong)
    wx.request({
      url: 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' + access_token,
      data: {
        
        "content": neirong
      },
      method: 'POST',
      
      success: function (res) {
        console.log(res.data.errcode)
        if (res.data.errcode==0){
          network.POST({
            url: 'v14/question/add-resource',
            params: {
              "mobile": app.userInfo.mobile,
              "token": app.userInfo.token,
              "resourcetypeid": 4,
              "resourceid": courseid,
              "name": neirong
            },
            success: function (res) {
              // console.log(res);
              wx.hideLoading();
              wx.showToast({
                title: res.data.message
              });
              if (res.data.code == 200) {
                wx.navigateBack({

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
        }
    
      }
    })

  },
  submitNote: function (neirong){
    var that=this;
    wx.request({
      url: 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' + access_token,
      data: {

        "content": neirong
      },
      method: 'POST',

      success: function (res) {
        console.log(res.data.errcode)
        if (res.data.errcode == 0) {
          network.POST({
            url: 'v14/news/comments-add',
            params: {
              "mobile": app.userInfo.mobile,
              "token": app.userInfo.token,
              "resourcetypeid": 13,
              "resourceid": courseid,
              "content": neirong
            },
            success: function (res) {
              // console.log(res);
              wx.hideLoading();
              wx.showToast({
                title: res.data.message
              });
              if (res.data.code == 200) {
                wx.navigateBack({

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
        }

      }
    })
  
  },
  submitPl: function (neirong) {
    var that = this;
    wx.request({
      url: 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' + access_token,
      data: {

        "content": neirong
      },
      method: 'POST',

      success: function (res) {
        console.log(res.data.errcode)
        if (res.data.errcode == 0) {
          network.POST({
            url: 'v14/news/comments-add',
            params: {
              "mobile": app.userInfo.mobile,
              "token": app.userInfo.token,
              "resourcetypeid": 4,
              "resourceid": courseid,
              "content": neirong,
              "parent": parent,
            },
            success: function (res) {
              // console.log(res);
              wx.hideLoading();
              wx.showToast({
                title: res.data.message
              });
              if (res.data.code == 200) {
                wx.navigateBack({

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
        }

      }
    })
  
  },
})