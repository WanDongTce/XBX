const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1
var yucunlisr = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: "all",
    id: '',
    //商家姓名
    name: "55",
    //商家头像
    pic: "",
    address: "",
    num: 0,
    list_sun: [],
    sopid: "",
    imgurl: [],
    type_list: [],
    hh:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // console.log(that.length)
    var postId = options.id
    console.log(postId)
    that.setData({
      id: postId
    })
    that.getlist();
    that.getheight();
    that.shangpin()
  },
  getheight:function(){
    var wh;
    var lh;
    var hh;
    var _this=this
    wx.getSystemInfo({
      success: function (res) {
        wh = res.windowHeight
       
      },
    })
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#mjltest').boundingClientRect()
    query.exec(function (res) {
      //res就是 所有标签为mjltest的元素的信息 的数组
     
      //取高度
      lh = res[0].top
       hh = wh - lh
      _this.setData({
         hh: hh
       })
    })
    

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  getlist: function () {
    var _this = this
    network.POST({
      url: 'v13/bus-shop-goods/bus-info',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "bid": this.data.id,

      },
      success: function (res) {

        wx.hideLoading();
        if (res.data.code == 200) {
          var inf = res.data.data[0].item
        console.log(inf)
          var list_weix = []
          var type = []

          for (let i = 0; i < inf.images.length; i++) {

            var pbj = { url: inf.images[i].url }
            list_weix.push(pbj)

          }

          for (let i = 0; i < inf.category_list.length; i++) {

            var pbj = { id: inf.category_list[i].id, name: inf.category_list[i].name }
            type.push(pbj)

          }

          _this.setData({
            name: inf.name,
            pic: inf.pic,
            address: inf.address,
            imgurl: list_weix,
            type_list: type
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

  shangpin: function () {
    var _this = this
    network.POST({

      url: 'v13/shop-goods/index',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "bid": this.data.id,
        "page":page

      },
      success: function (res) {

        wx.hideLoading();

        if (res.data.code == 200) {

          var a = res.data.data[0].list;

          for (var i = 0; i < a.length; i++) {
            yucunlisr.push(a[i])
          }
          _this.setData({
            list: yucunlisr,
            list_sun: yucunlisr
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
  /**
   * 生命周期函数--监听页面显示
   */
  addCount: function (e) {

    const index = e.currentTarget.dataset.id;
    let carts = this.data.list_sun;
    let sid = ""
    carts = carts.map(function (item) {
      if (item.id == index) {
        item.cart_num = parseInt(item.cart_num) + 1
        sid = item.s_id
      }

      return item;
    })

    this.setData({
      list_sun: carts
    })
    network.POST({

      url: 'v13/shop-cart/add',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "num": 1,
        "s_id": sid

      },
      success: function (res) {

        wx.hideLoading();

        if (res.data.code == 200) {
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


  reduce: function (e) {
    const index = e.currentTarget.dataset.id;
    let carts = this.data.list_sun;
    let sid = ""
    carts = carts.map(function (item) {
      if (item.id == index) {
        if (parseInt(item.cart_num) > 0) {
          item.cart_num = parseInt(item.cart_num) - 1
          sid = item.s_id
        }
      }

      return item;
    })

    this.setData({
      list_sun: carts
    })
    network.POST({

      url: 'v13/shop-cart/reduce',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "num": 1,
        "s_id": sid

      },
      success: function (res) {

        wx.hideLoading();

        if (res.data.code == 200) {
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
  bttype: function (e) {
    var dataindex = e.currentTarget.dataset.index;
    var dataid = e.currentTarget.dataset.id;
    if (dataindex == undefined){
      dataindex="all"
    }
    
    var _this = this
    network.POST({

      url: 'v13/shop-goods/index',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "bid": this.data.id,
        "cb_id": dataid

      },
      success: function (res) {

        wx.hideLoading();

        if (res.data.code == 200) {

          var a = res.data.data[0].list;

          console.log(res.data.message)
          _this.setData({
            list: a,
            list_sun: a,
            currentTab: dataindex
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

  topshoop: function () {
    // 正常为2 扫描为1
    if (getCurrentPages().length < 2) {
      wx.reLaunch({
        url: '/pages/main/pages/home/home'
      })
    } else {
      wx.navigateBack({
        delta: 1
      });
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
  scrollToLower:function(){
    console.log(page)
    page = page + 1
   
    this.shangpin(page)
  },
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})