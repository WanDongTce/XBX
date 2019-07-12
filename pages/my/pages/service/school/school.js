// pages/edutlList/school/school.js
const network = require("../../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = null;
var positiontype = ''
Page({

  data: {
    positiontitle:''
  },

  onLoad: function (options) {
    this.empty = this.selectComponent("#empty");    
    positiontype = options.positiontype;
    var that=this;
    if (positiontype==1){
      wx.setNavigationBarTitle({ title: '放学到家' })
      that.setData({
        positiontitle:'放学到家'
      })
    }
    else if (positiontype == 2) {
      wx.setNavigationBarTitle({ title: '外出活动' })
      that.setData({
        positiontitle: '外出活动'
      })
    }
    else if (positiontype == 3) {
      wx.setNavigationBarTitle({ title: '外出到家' })
      that.setData({
        positiontitle: '外出到家'
      })
    }
    this.getList(false)
  },
  onShow: function () {
  
  },
  getList: function (contaFlag) {
    var that = this;
    
    network.POST({
      url: 'v14/study/user-gps-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,
        "type": Number(positiontype),
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          if (contaFlag) {
            var a = that.data.list.concat(res.data.data[0].list);
            that.setData({
              list: a
            });
          } else {
            that.setData({
              list: res.data.data[0].list
            });
          }
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
    
      if (hasmore) {
        page++;
        this.getList(true);
      } else {
        wx.showToast({
          title: '没有更多了',
            icon: 'none',
          duration: 1000
        })
      }
  },
  onUnload: function () {
    page = 1;
    hasmore = null;
    
  },
  userLocationDetail: function (e) {
    
    var longitude = e.currentTarget.dataset.lng;
    var latitude = e.currentTarget.dataset.lat;
    
    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
    })
  },
})