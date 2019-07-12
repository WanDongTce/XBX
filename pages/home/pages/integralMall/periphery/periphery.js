const network = require("../../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = '';
var search = '', index = null;


Page({
  data: {
    IMGURL: app.imgUrl,
    tabIndex: 1,
    hotList: [],
    list: [],
    showEmpty: false,
    userInfo: app.userInfo,
    search: '',
    cartCount: 0,
    showSearch: false,
    mallSearchHis:[],
    focus:true,
  },
  onLoad: function (options) {
    // console.log(options);
    if (options.showSearchType==2){
      this.setData({
        showSearch: true,
        focus: true
      })
    }
    else{
      this.setData({
        classifyid: options.classifyid,
        mallSearchHis: app.mallSearchHis
      })
    }
    this.empty = this.selectComponent("#empty");
    // this.search = this.selectComponent("#search");     
  },
  
  saveSearch: function (e) {
    // console.log(this.data.showSearch)
    search = e.detail.value.replace(/^\s*|\s*$/, '');
    // console.log(search)
  },
  backReturn: function () {
    wx.navigateBack({
    })
  },
  submit: function (e) {
    // console.log(search)    
      app.mallSearchHis.push(search); 
    // console.log(app.mallSearchHis)
    
    var that = this;  
    that.setData({
      search: e.detail.value,
        mallSearchHis: app.mallSearchHis
    });
    that.getList(false);
    that.hideSearch();

    
  },
  tapHisItem: function (e) {
    var that = this;
    search = e.currentTarget.dataset.val;
    that.setData({
      search: search
    });
    that.getList(false);
    that.hideSearch();
  },
  clearHis: function () {       
      app.mallSearchHis = [];
   
    this.setData({
        mallSearchHis: []
    });
  },
  showSearch() {
    this.setData({
      showSearch: true
    });
  },
  hideSearch() {
    this.setData({
      showSearch: false
    });
  },
  
  onShow: function () {
    this.setData({
        mallSearchHis: app.mallSearchHis
    })
    var that = this;
    // that.getList(false);
   
    
  },
  getList: function (flag) {
    var that = this;
    network.POST({
      url: 'v14/shop-point/list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,       
        "search_name": that.data.search,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
           
          var a = res.data.data[0].list;
          if (flag) {
            a = that.data.list.concat(a);
            that.setData({
              list: a
            });
          } else {
            that.setData({
              list: a,
              // hotList: res.data.data[0].recommend_list,
              showEmpty: a.length == 0 ? true : false
            });
          }
          hasmore = res.data.data[0].hasmore;
        } else {
          wx.showToast({
            title: res.data.message,
              icon: 'none',
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
    var that = this;
    if (that.data.list.length > 0) {
      if (hasmore) {
        page++;
        that.getList(true);
      } else {
        wx.showToast({
          title: '没有更多了',
            icon: 'none',
          duration: 1000
        });
      }
    }
  },
  
    //跳转到详情
    tz_detail: function (e) {
        wx.navigateTo({
            url: '/pages/home/pages/integralMall/integralMallDetail/integralMallDetail?id=' + e.currentTarget.dataset.id
        });
    },
    toSetm: function (e) {
        var a = e.currentTarget.dataset.item;
        // console.log(a);
        wx.setStorageSync("goods", a);
        wx.navigateTo({
            url: '/pages/home/pages/integralMall/settlement/settlement'
        });
    },
  onUnload() {
    page = 1;
    hasmore = '';
    this.setData({
      showEmpty: false,
      search: ''
    });
  }
})