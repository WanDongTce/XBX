const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1
var yucunlisr = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number_sun:0
  },
  getList: function (page) {
    var that = this;
    var img;
    var lng;
    var lat;
    var gootlist
    wx.getLocation({
      success: function (res) {
        // console.log(res.latitude, res.longitude)
        lng = res.longitude
        lat = res.latitude
        console.log(lng, lat)
        network.POST({
          url: 'v13/bus-shop-goods/bus-list',
          // url: 'A_social/frontend/web/index.php/img/code',
          params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            // "business": 'pages/main/pages/Shopdetails/Shopdetails',
            // "id":1
            "lng": lng,
            "lat": lat,
            "page":page

          },
          success: function (res) {
            // console.log(res.lat);
            wx.hideLoading();
            if (res.data.code == 200) {

              var a = res.data.data[0].list;
              for (var i = 0; i < a.length; i++) {
                yucunlisr.push(a[i])
              }
            
              var number = yucunlisr.length

              if (number == 0) {
                that.setData({
                  show: true,
                  show_sun: false
                })
              } else {
                that.setData({
                  show: false,
                  show_sun: true
                })
              }

              that.setData({
                list: yucunlisr,

              })

            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 1000
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
    })

  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onTapdetail: function (event) {
    var postad = event.currentTarget.dataset.postad   //获取传递的值
    // console.log(postad);
    wx.navigateTo({
      // url: '/pages/main/pages/Shopdetails/Shopdetails'  //跳转详情页  切记配置app.json文件 
      url: '/pages/main/pages/Shopdetails/Shopdetails?id=' + postad    //传递参数
    })
  },
  topshoop:function(){
    wx.navigateTo({
      // url: '/pages/main/pages/Shopdetails/Shopdetails'  //跳转详情页  切记配置app.json文件 
      url: '/pages/main/pages/car/car'
    })
  },
  onLoad: function (options) {
    var that = this
    // console.log(that.length)

    that.getList(page);
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getcar()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    page = page + 1
    this.getList(page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  getcar:function(){
    var that = this;
    network.POST({
      url: 'v13/shop-cart/list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token
      },

      success: function (res) {
        // console.log(app.userInfo.token)
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list.length;
         that.setData({
           number_sun:a
         })
        } else {
          wx.showToast({
            title: res.data.message
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
   to_index: function () {
    wx.switchTab({
      url: '/pages/main/pages/home/home',
    })
  },
  to_find: function () {
    wx.switchTab({

      url: '/pages/main/pages/find/find',

    })
  },
  to_my: function () {
    wx.switchTab({

      url: '/pages/main/pages/my/my',
    })
  },
  
})