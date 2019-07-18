// pages/songdetail/songdetail.js
import Page from '../../common/page';
var classId='';
var typeId="";
var yearId=""
var list_wei = [];
var page = 1;
var flg="";

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: {
      right: false
    },
    list:[],
    author:"",
    class_list:[],
    type_list: [],
    year_list: [],
    current03:9999999,
    current02: 9999999,
    current01: 9999999
   
  },

  onTransitionEnd() {
    console.log(`You can't see me 🌚`);
  },
  toggle(type) {
    this.setData({
      [`show.${type}`]: !this.data.show[type]
    });
  },

  toggleRightPopup() {
    this.toggle('right');
  },

  filter: function(){
    this.toggle('right');
  },
  goTo:function(e){
    var postad = e.currentTarget.dataset.postad 
    wx.navigateTo({
      url: '/pages/dayuwen/pages/Ranking/Ranking?id=' + postad 
    })
  },
  tosearch:function(){
    wx.navigateTo({
      url: '/pages/dayuwen/pages/search/search'
    })
  },
getlist:function(name){
  var that=this
  
  

  
  wx.request({
    url: app.requestUrl + 'v14/chinese/poetry',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',

    data: {
      "token": app.userInfo.token,
      "mobile": app.userInfo.mobile,
      "app_source_type": app.app_source_type,
      "searchname":name?name:''
    },
    success: function (res) {
      console.log(res.data.data)
      console.log(res.data.data[0].hasmore)
      flg = res.data.data[0].hasmore
      for (var i = 0; i < res.data.data[0].list.length; i++) {
        list_wei.push(res.data.data[0].list[i])
      }
      that.setData({
       list: res.data.data[0].list
     })
    }
  })
},
  topshoop: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  xiala: function (options) {
    wx.showLoading({
      title: '加载中,请稍后',
    })
   
    console.log(flg)
    var that = this
    if (flg==0){

    }else{
      page = page + 1
      wx.request({
        url: app.requestUrl + 'v14/chinese/poetry',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          // "searchname": name,
          "app_source_type": app.app_source_type,
          "page": page,
          "pagesize": 20,
          "classid": classId,
          "poetryid": typeId,
          "yearid": yearId
        },
        success: function (res) {
          console.log(list_wei)
          for (var i = 0; i < res.data.data[0].list.length; i++) {
            list_wei.push(res.data.data[0].list[i])
          }
          console.log(list_wei)
          console.log(res.data.data[0].hasmore)
          flg = res.data.data[0].hasmore
          that.setData({

            list: list_wei
          })
        }
      })
      
    }
    wx.hideLoading();

  },

  getheight: function () {
    var wh;
    var lh;
    var hh;
    var _this = this
    wx.getSystemInfo({
      success: function (res) {
        wh = res.windowHeight

      },
    })
    var query = wx.createSelectorQuery();
    //选择id
    query.select('.main').boundingClientRect()
    query.exec(function (res) {
      //res就是 所有标签为mjltest的元素的信息 的数组

      //取高度
      lh = res[0].top
      console.log(lh)
      hh = wh - lh
      _this.setData({
        hh: hh
      })
    })


  },
  screenlist:function(){
    var that=this
    wx.request({
      url: app.requestUrl + 'v14/chinese/screening',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',

      data: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "app_source_type": app.app_source_type,
      },
      success: function (res) {
        that.setData({
          class_list: res.data.data[0].class,
          type_list: res.data.data[0].type,
          year_list: res.data.data[0].year
        })
      }
    })
  },
  classbtn:function(e){
    classId= e.currentTarget.dataset.id  
    console.log(e.currentTarget.dataset.index)
    if (this.data.current01 == e.currentTarget.dataset.index) {
      classId = ''
      this.setData({
        current01: 9999999
      })
    } else {
      this.setData({
        current01: e.currentTarget.dataset.index
      })
    }
  },
  typebtn: function (e) {
     typeId = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.index)
    if (this.data.current02 == e.currentTarget.dataset.index) {
      typeId = ""
      this.setData({
        current02: 9999999
      })
    } else {
      this.setData({
        current02: e.currentTarget.dataset.index
      })
    }
  },
  yearbtn: function (e) {
     yearId = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.index)
    if (this.data.current03 == e.currentTarget.dataset.index){
      yearId = ""
      this.setData({
        current03: 9999999
      })
    }else{
      this.setData({
        current03: e.currentTarget.dataset.index
      })
    }
    
  },
  onClick:function(){
    var that = this
    console.log(yearId)
    wx.request({
      url: app.requestUrl + 'v14/chinese/poetry',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',

      data: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "app_source_type": app.app_source_type,
        "classid": classId,
        "poetryid": typeId,
        "yearid": yearId
      },
      success: function (res) {
        console.log(res.data.data[0].list)
        flg = res.data.data[0].hasmore
        list_wei=[]
        for (var i = 0; i < res.data.data[0].list.length; i++) {
          list_wei.push(res.data.data[0].list[i])
        }
        that.setData({
          list: list_wei
        })
      }
    })
  },
  onClick_sun:function(){
    classId = ''
    this.setData({
      current01: 9999999
    })
    typeId = ""
    this.setData({
      current02: 9999999
    })
    yearId = ""
    this.setData({
      current03: 9999999
    })
    var that = this

    wx.request({
      url: app.requestUrl + 'v14/chinese/poetry',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',

      data: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "app_source_type": app.app_source_type,
      },
      success: function (res) {
        console.log(res.data.data[0].list)
        that.setData({
          list: res.data.data[0].list
        })
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nanme = options.name
    this.getlist(nanme)
    this.screenlist()
    this.getheight()
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
    this.onLoad()
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