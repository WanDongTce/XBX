// pages/Preview//pages/Preview/Preview.js;
var courseid;
var versionid;
var gradeid;
var list_sun = []
var num
var nianji;
var banben
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrent: 1,
    class_list:[],
    version_list:[],
    Subject_list:[],
    nianji:"",
    banben:"",
    current01:"0",
    current02: "0",
    current03: "0",
    arr: [],
    num:"",
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
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success:function(res){
        console.log(res.data.data.course_list)
        //科目ID
        courseid = res.data.data.course_list[0].id
        //版本ID
        versionid = res.data.data.version_list[0].id
        //年级id
        gradeid = res.data.data.grade_list[0].id
        nianji=res.data.data.grade_list[0].name
        banben = res.data.data.version_list[0].name
        that.setData({
          class_list: res.data.data.grade_list,
          version_list: res.data.data.version_list,
          Subject_list: res.data.data.course_list,
          nianji: res.data.data.grade_list[0].name,
          banben: res.data.data.version_list[0].name
          
        })
        
      }
    })
  },
  tobooklist:function(e){
    var postad = e.currentTarget.dataset.id 
    console.log(postad)
    wx.navigateTo({
      //url: 'post-detail/post-detail'  //跳转详情页  切记配置app.json文件 
      url: '../booklist/booklist?id=' + postad + "&nianji=" + nianji + "&banben=" + banben  //传递参数
    })

  },
  getteaching:function(){
    var that = this
    var user = wx.getStorageSync("userInfo")
    console.log(user.id)
    wx.request({
      url: 'http://yuxile.54xuebaxue.com/index/Textbook/tList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data:{
        course_id: courseid,
        version_id: versionid,
        grade_id: gradeid,
        user_id: user.id
      },
      success:function(res){
        console.log(res)
        if (res.data.data.length < 1) {
          num =  0/ 0 * 100

          that.setData({
            arr: res.data.data,
            num: num
          })
        }else{
          num = res.data.data[0].read.num / res.data.data[0].read.all * 100

          that.setData({
            arr: res.data.data,
            num: num
          })
        }
       
        console.log(that.data.arr)
      }
    })
  },
  onClick:function(){
    console.log(courseid)
    console.log(versionid)
    console.log(gradeid)
    this.getteaching()
  },

  classbtn:function(e){
    var that = this
    gradeid = e.currentTarget.dataset.id
    that.setData({
      current01: e.currentTarget.dataset.index
    })
   
  },
  typebtn: function (e) {
    var that = this
    versionid = e.currentTarget.dataset.id
    that.setData({
      current02: e.currentTarget.dataset.index
    })

  },
  yearbtn: function (e) {
    var that = this
    courseid = e.currentTarget.dataset.id
    that.setData({
      current03: e.currentTarget.dataset.index
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
    this.getteaching()
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