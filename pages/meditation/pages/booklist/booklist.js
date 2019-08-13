// pages/Preview//pages/booklist/booklist.js
var id_sun;
flg: false
var nianji
var banben
var postId

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    list_sun: [],
    list_id:"",
    nianji:"",
    banben:"",
    jcmc: ""
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
     postId = options.id 
    nianji=options.nianji
    banben=options.banben
    this.getlist(postId)
    var jcmc = wx.getStorageSync("jcmc")
    that.setData({
      jcmc: jcmc
    })
    
  },
  topshoop: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  getlist: function (postId){
    var that=this
    console.log(postId)
      wx.request({
        url: 'http://yuxile.54xuebaxue.com/index/Textbook/dirList',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data:{
          "book_id": postId,
         
        },
        success:function(res){
          
 

          that.setData({
            list: res.data.data,
            nianji: nianji,
            banben: banben
          })
        }
        
      })
  },
  getCatalog:function(e){
    var id = e.currentTarget.dataset.id 
    
    if (id == id_sun ){
      var that=this
      that.setData({
       
        list_id: "",
      })
      id_sun=""
    }else{
      var that = this
      console.log(id)
      id_sun = id
      var user = wx.getStorageSync("userInfo")
      console.log(user.id)
      wx.request({
        url: 'http://yuxile.54xuebaxue.com/index/Textbook/readList',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          user_id: user.id,
          direct_id: id
        },
        success: function (res) {
          console.log(res)
          that.setData({
            list_sun: res.data.data,
            list_id: id,
          })
        }
      })
    }
  
  },
  toArticle:function(e){
    var postad = e.currentTarget.dataset.id
    var zjmc = e.currentTarget.dataset.name
    wx.setStorageSync("zjmc", zjmc)
    console.log(postad)
    wx.navigateTo({
      //url: 'post-detail/post-detail'  //跳转详情页  切记配置app.json文件 
      url: '../review/review?id=' + postad 
    })
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
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.customMethod()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
    that.setData({

      list_id: "",
    })
    id_sun = ""
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