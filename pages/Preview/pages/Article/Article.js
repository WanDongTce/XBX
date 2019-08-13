var time
var number=0
var userid
var opid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"",
    translation_list:[],
    note_list:[],
    id: 0, //课文id
    zjmc:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
   
    var user = wx.getStorageSync("userInfo")
    console.log(user.id)
     opid = options.id
     userid = user.id
    this.getlist(userid, opid)
    this.startSetInter()
    var zjmc = wx.getStorageSync("zjmc")
    this.setData({
      id: options.id,
      zjmc: zjmc
    });
  },
  startSetInter:function(){
    time=setInterval(function(){
      number=number+1
    },1000)
  },
  

  topshoop: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  getlist: function (userid, opid){
    console.log(opid)
    opid = opid
    userid = userid
    var that=this
      wx.request({
        url: 'http://yuxile.54xuebaxue.com/index/Textbook/readInfo',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data:{
          read_id: opid,
          user_id: userid
        },
        success:function(res){
          console.log(res.data.data.notes_list)
          that.setData({
            text: res.data.data.info.text_cent,
            translation_list: res.data.data.info_list,
            note_list: res.data.data.notes_list
          })
        }
        
      })
  },
  endSetInter: function () {
    let that = this;
    clearInterval(time)
    console.log(userid)
    wx.request({
      url: 'http://yuxile.54xuebaxue.com/index/Textbook/writeRead',
      data: {
        read_id: opid,
        user_id: userid,
        read_time: number
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success:function(res){
        wx.navigateTo({
          url: '/pages/Preview/pages/question/index?id=' + that.data.id,
        })
      }
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
    clearInterval(time)
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})