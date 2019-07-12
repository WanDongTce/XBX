const network = require("../../../../../utils/main.js");
var amapFile = require('../../../../../utils/amap-wx.js');


const app = getApp();
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
  //点击定位
  getLocation: function (e) {
    // //console.log(e.currentTarget.id)
      var index = e.currentTarget.id;
      var that = this;
      var key = app.gaodekey;
      var myAmapFun = new amapFile.AMapWX({ key: key });
      myAmapFun.getRegeo({
          
          success: function (data) {
            //   console.log(data)
              
              that.setData({
                  textData: {
                      name: data[0].name,
                      desc: data[0].desc
                  },
                  latitude: data[0].latitude,
                  longitude: data[0].longitude
              })
                if (index == 1) {
                    that.addLocation(index)
                    // that.getAddress()
                } else if (index == 2) {
                    that.addLocation(index)
                } else if (index == 3) {
                    that.addLocation(index)
                }
          },
          fail: function (info) {
              wx.showModal({title:info.errMsg})
          },
          
          
      })
    //   var index = e.currentTarget.id;
    //   var that = this;
    //   wx.getLocation({
    //     type: 'gcj02',
    //     success: function (res) {
    //       console.log(res.longitude);
    //       console.log(res.latitude);

    //       that.setData({
    //         longitude: res.longitude,
    //         latitude: res.latitude,
    //       })
    //       if (index == 1) {
    //         that.addLocation(index)
    //         // that.getAddress()
    //       } else if (index == 2) {
    //         that.addLocation(index)
    //       } else if (index == 3) {
    //         that.addLocation(index)
    //       }
    //     },
    //   })
    

  },
  getAddress:function(){
    var that=this;
    var longitude = that.data.longitude;
    var latitude = that.data.latitude;
    
    
  },
  addLocation: function (index) {
    var that = this;
    that.setData({
      hidden: false
    })
    
    network.POST({
      url: 'v14/study/add-user-gps',
      params: {
        

        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,        
        "type": index,
        "lat": that.data.latitude,
        "lng": that.data.longitude,
        "address": that.data.textData.name,
      },
      success: function (res) {
        //console.log(res.data.a)
        wx.hideLoading();
        //console.log(res)
        if (res.data.code == 200) {
          wx.showToast({
            title: '定位成功',            
            duration: 1000
          });
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
  },
})