// pages/Preview//pages/Preview/Preview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrent: 1,
    class_list:[],
    version_list:[],
    current01:"0",
    arr: [{
      images: 'http://img.ajihua888.com/upload/2019/01/24/92d7be60fc2c92f8ede105f8967dff6f.png'
    },
    {
      images: 'http://img.ajihua888.com/upload/2019/01/24/92d7be60fc2c92f8ede105f8967dff6f.png'
    },
    {
      images: 'http://img.ajihua888.com/upload/2019/01/24/92d7be60fc2c92f8ede105f8967dff6f.png'
    },
    {
      images: 'http://img.ajihua888.com/upload/2019/01/24/92d7be60fc2c92f8ede105f8967dff6f.png'
    }
    ],
    show: {
      right: false
    },
    
  indicatorDots: true,
    autoplay: false,
    interval: 2000,
    duration: 1000,
    circular: true,
    beforeColor: "white",//指示点颜色 
    afterColor: "coral",//当前选中的指示点颜色 
    previousmargin: '128rpx',//前边距
    nextmargin: '128rpx',//后边距



  },
  getdata:function(){
    var that=this
    wx.request({
      url: 'http://yuxile.54xuebaxue.com/index/Typepublic/tList',
      success:function(res){
        console.log(res.data.data.grade_list)
        that.setData({
          class_list: res.data.data.grade_list,
          version_list: res.data.data.version_list
        })
      }
    })
  },
  classbtn:function(e){
    var that = this
    
    that.setData({
      current01: e.currentTarget.dataset.index
    })
  },

  toggle(type) {
    this.setData({
      [`show.${type}`]: !this.data.show[type]
    });
  },

  toggleRightPopup() {
    this.toggle('right');
  },

  filter: function () {
    this.toggle('right');
  },
  swiperChange: function (e) {
    console.log(e.detail.current);
    this.setData({
      swiperCurrent: e.detail.current  //获取当前轮播图片的下标
    })
  },
  //滑动图片切换 
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdata()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.animation = wx.createAnimation()

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