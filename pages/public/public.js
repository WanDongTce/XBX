var ss = ""
var list = []
var flg=true
var flgging = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
      flg:true,
    flgging: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定

  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function () {
      var that = this
      wx.connectSocket({
        // // url: 'ws://121.40.165.18:8800',
        // url: 'ws://192.168.0.129:8282',
        success: function () {
          console.log("连接成功")
        },
        fail: function () {
          console.log("连接失败")
        }

      })
      wx.onSocketOpen(function () {
        console.log("已打开")
        wx.sendSocketMessage({
          data: 'stock',

        })
      })
      wx.onSocketMessage(function (data) {
        console.log(1)

        ss = data.data
        list.push(data.data)

        var animation = wx.createAnimation({
          // 动画持续时间
          duration: 500,
          // 定义动画效果，当前是匀速
          timingFunction: 'linear'
        })
        that.animation = animation
        animation.translateY(550).step()

        that.setData({
          // 通过export()方法导出数据
          animationData: animation.export(),
          // 改变view里面的Wx：if
          modelFlag: true
        })
        // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
        setTimeout(function () {
          animation.translateY(0).step()
          that.setData({
            animationData: animation.export()
          })
        }, 200)
        


        that.setData({
          list_sun: list,
          flg:true,
          flgging: true
        })
        list = []

      })
    },
    noShow: function () {
      var that = this;
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'linear'
      })
      that.animation = animation
      animation.translateY(550).step()
      that.setData({
        animationData: animation.export()

      })
      setTimeout(function () {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export(),
          modelFlag: false
        })
      }, 200)
    },
    close: function () {
      var that = this
      console.log(111)
      if (flg == true) {
        flg = false;
        that.setData({
          flg: false
        })


      } else {
        flg = true;
        that.setData({
          flg: true
        })
      }
    },
    type02: function () {
      var that = this
      console.log(111)
      if (flgging == true) {
        flgging = false;
        that.setData({
          flgging: false
        })
      } else {
        flgging = true;
        that.setData({
          flgging: true
        })
      }
    },
    nohide:function(){
      flgging = true;
      flg = true;
      this.setData({
        flgging: false,
        flg: false
      })
    }
  }
})



