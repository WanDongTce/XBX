// pages/my/myreferee/myreferee.js
const network = require("../../../../utils/main.js");
const app = getApp();
Page({
  data: {
    phone:'',
    showModal: false,
    list:'',
    validate:'',
    state:''//0 无推荐人，1有推荐人
  },
  onLoad: function (options) {
    var that=this;
    this.compontNavbar = this.selectComponent("#compontNavbar");
    that.getState();
  },
  getState:function(){
    var that = this;
    network.POST({
      url: 'v14/user-info/my-recommend',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].item;          
          that.setData({
            list: a,           
          });
          if(a.length==0){
            that.setData({
              state:0,
            })
          }
          else{
            that.setData({
              state: 1,
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
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value.replace(/^\s*|\s*$/, '')
    })
  },
  bindreferee:function(){
    var that = this;
    var phone = that.data.phone;
    if (phone.length == 0 ) {
      wx.showToast({
        title: '不能为空',
          icon: 'none',
        duration: 1000
      })
    }
    else if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
      wx.showToast({
        title: '手机号不合法',
          icon: 'none',
        duration: 1000
      })
    }
    else{
      that.getValidate();
    }
  },
  getValidate:function(){
    var that = this;
    network.POST({
      url: 'v14/user-info/ver-recommend',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "rec_mobile": that.data.phone
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].item;
          that.setData({
            validate: a,
          });
          that.setData({
            showModal: true
          })
        } else {         
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel:false,
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
  /**
     * 弹窗
     */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    var that = this;
    network.POST({
      url: 'v14/user-info/add-recommend',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "rec_mobile": that.data.phone
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.message,
            duration: 1000
          });
          that.hideModal();
          that.getState();
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

