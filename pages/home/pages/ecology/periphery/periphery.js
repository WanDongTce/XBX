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
    peripherySearchHis:[],
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
        peripherySearchHis: app.peripherySearchHis
      })
    }
    this.empty = this.selectComponent("#empty");
    this.peripheryBotmTab = this.selectComponent("#peripheryBotmTab");
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
    app.peripherySearchHis.push(search); 
    // console.log(app.peripherySearchHis) 
    
    var that = this;  
    that.setData({
      search: e.detail.value,
      peripherySearchHis: app.peripherySearchHis
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
    app.peripherySearchHis = [];
   
    this.setData({
      peripherySearchHis: []
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
      peripherySearchHis: app.peripherySearchHis
    })
    var that = this;
    that.getList(false);
    that.getCartCount();
    
  },
  getList: function (flag) {
    var that = this;
    network.POST({
      url: 'v13/shop-goods/index',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "search": that.data.search,
        "price_sort": '',
        "c_id": that.data.classifyid,
        "page": page
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
  
  getCartCount() {
    var that = this;
    network.POST({
      url: 'v13/shop-order/order-num',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            cartCount: res.data.data[0].cartcount
          });
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
  onUnload() {
    page = 1;
    hasmore = '';
    this.setData({
      showEmpty: false,
      search: ''
    });
  }
})