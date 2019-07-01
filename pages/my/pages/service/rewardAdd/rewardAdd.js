// pages/service/rewardAdd/rewardAdd.js
const network = require("../../../../../utils/main.js");
const app = getApp();
Page({

  data: {
    data1: "",
    currentdate: null,
    
    
    quanbu: "全部分类",
    schoolselect: '/images/home/select.png',

    feileiid: null,
    studentid: null,
    textarea: false,

    model: null,

    array: [
      "全部分类", "勤奋学习", "诚实正直", "礼貌谦逊", "勤俭节约", "热爱劳动", "创新能力", "其他"      
    ],
    index: 0,
  },
  bindPickerChange: function (e) {

    this.setData({
      index: e.detail.value
    })
    
  },
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          model: res.model
        });
      }
    });
    if (that.data.model.indexOf('iPhone') >= 0) {
      that.setData({
        model: 1
      });
    } else {
      that.setData({
        model: 2
      });
    }

    //当前时间
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate

    this.setData({
      currentdate: currentdate,      
    });
    
    
  },

  onShow: function () {
  
  },
  //时间1
  bindDateChange: function (e) {
    var that = this;
    that.setData({
      date1: e.detail.value
    })
  },
  //点击添加提交表单
  bindFormSubmit: function (e) {
    var that = this
    
    if (that.data.index == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择奖励类别',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          
        }
      })
      return false
    }
    else if (e.detail.value.xfmc.length == 0) {

      wx.showModal({
        title: '提示',
        content: '请输入奖励名称',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          
        }
      })
      return false
    }
    else if (e.detail.value.xfmc.length > 25) {
      wx.showModal({
        title: '提示',
        content: '奖励名称需小于25个字',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          
        }
      })
      return false
    }
    else if (that.data.date1 == null) {
      wx.showModal({
        title: '提示',
        content: '请输入奖励时间',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          
        }
      })
      return false
    }
    else if (e.detail.value.bzzy.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入备注摘要',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          
        }
      })
      return false
    }
    else {
      this.setData({
        hidden: false,
      })
      //提交
      network.POST({
        url: "v14/study/creat-reward",
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "re_type": that.data.index,
          "re_name": e.detail.value.xfmc,
          "re_time": that.data.date1,
          "re_abstract": e.detail.value.bzzy,          
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 200) {
            wx.showToast({
              title: '添加成功',
              duration: 1000
            });
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
      })

    }

  },
})