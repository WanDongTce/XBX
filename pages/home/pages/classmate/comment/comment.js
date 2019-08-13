const network = require("../../../../../utils/main.js");
const app = getApp();
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
  submit:function(){
    var that=this;
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
})