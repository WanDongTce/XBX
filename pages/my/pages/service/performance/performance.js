// pages/edutlList/performance/performance.js
const network = require("../../../../../utils/main.js");
const app = getApp();
Page({

  data: {
    data1: "",
    currentdate: null,
    textarea: false,
    model: null,
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

    that.setData({
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
    var myReg = /^$|^0{1}([.]\d{1})?$|^[1-9]\d*([.]{1}[0-9]{1})?$/
    if (e.detail.value.xfmc.length == 0) {

      wx.showModal({
        title: '提示',
        content: '请输入考试名称',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          /*if (res.confirm) {
            console.log('用户点击确定')
          } */
        }
      })
      return false
    }
    else if (e.detail.value.xfmc.length > 25) {
      wx.showModal({
        title: '提示',
        content: '考试名称需小于25个字',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          /*if (res.confirm) {
            console.log('用户点击确定')
          } */
        }
      })
      return false
    }
    else if (that.data.date1 == null) {
      wx.showModal({
        title: '提示',
        content: '请输入考试时间',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          /*if (res.confirm) {
            console.log('用户点击确定')
          } */
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
    else if ((e.detail.value.shuxue.length > 6) || (e.detail.value.yuwen.length > 6) || (e.detail.value.yingyu.length > 6) || (e.detail.value.wuli.length > 6) || (e.detail.value.huaxue.length > 6) || (e.detail.value.dili.length > 6) || (e.detail.value.lishi.length > 6) || (e.detail.value.shengwu.length > 6) || (e.detail.value.zhengzhi.length > 6) || (e.detail.value.kexue.length > 6) || (e.detail.value.lizong.length > 6) || (e.detail.value.wenzong.length > 6)) {
      wx.showModal({
        title: '提示',
        content: '输入成绩不合法',
        showCancel: false,
        confirmText: '确定',
      })
    }
    else if ((!myReg.test(e.detail.value.shuxue)) || (!myReg.test(e.detail.value.yuwen)) || (!myReg.test(e.detail.value.yingyu)) || (!myReg.test(e.detail.value.wuli)) || (!myReg.test(e.detail.value.huaxue)) || (!myReg.test(e.detail.value.dili)) || (!myReg.test(e.detail.value.lishi)) || (!myReg.test(e.detail.value.shengwu)) || (!myReg.test(e.detail.value.zhengzhi)) || (!myReg.test(e.detail.value.kexue)) || (!myReg.test(e.detail.value.lizong)) || (!myReg.test(e.detail.value.wenzong))) {
      wx.showModal({
        title: '提示',
        content: '输入成绩不合法',
        showCancel: false,
        confirmText: '确定',
      })
    }
    else {
      var newarr=[];
      newarr = [
        e.detail.value.shuxue, 
        e.detail.value.yuwen, 
        e.detail.value.yingyu,
        e.detail.value.wuli,
        e.detail.value.huaxue,
        e.detail.value.dili,
        e.detail.value.lishi,
        e.detail.value.shengwu,
        e.detail.value.zhengzhi,
        e.detail.value.kexue, 
        e.detail.value.lizong,
        e.detail.value.wenzong,
      ]
      // console.log(newarr)
      var obj = {};
      var key = '';
      for (var i = 0; i < newarr.length; i++) {
        key = i+1;
        obj[key] = newarr[i];
      }
      // console.log(obj)
      // JSON.stringify(obj)
      // console.log(JSON.stringify(obj))

      //提交
      network.POST({
        url: "v14/user-exam/create",
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "title": e.detail.value.xfmc,
          "exam_time": that.data.date1,
          "subjectgrade": JSON.stringify(obj),
          "remark": e.detail.value.bzzy,          
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