const network = require("../../../../../utils/main.js");
const app = getApp();
var access_token
Page({ 
  data: {
    author_mobile:'',
    post_id: '',
    content: '',
    mytype: '',
    commentid: '',
    base: '../../../../../'
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
  onLoad: function (options) {
    // console.log(options)
    var that = this;
    that.gettoken()
    that.setData({
      mytype:options.type,
      commentid: options.commentid,
      author_mobile: options.author_mobile,
    })
    var b = wx.getStorageSync('classmate');
    // console.log(b)
    that.setData({
      // author_mobile:b.mobile,
      post_id: b.id,
    })
    
  },
  saveMsg: function (e) {
    var a = e.detail.value.replace(/^\s*|\s*$/, '');
    this.setData({
      msg: a
    });
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
  submit:function(){
    var that=this;
    wx.request({
      url: 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' + access_token,
      data: {

        "content": that.data.msg
      },
      method: 'POST',
      success:function(res){
        console.log(res)
        if (res.data.errcode == 0){
          network.POST({
            url: 'v11/postcomments/comment',
            params: {
              "mobile": app.userInfo.mobile,
              "author_mobile": that.data.author_mobile,
              "type": that.data.mytype,
              // "post_id": that.data.post_id,
              "post_id": that.data.commentid,
              "content": that.data.msg,
              "token": app.userInfo.token,

            },
            success: function (res) {
              // console.log(res);
              wx.hideLoading();
              if (res.data.code == 200) {
                wx.navigateBack({
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
        }
      }
    })

  }
})