const network = require("../../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = '';
Page({
  data: {
    rightlist: '',
    currentleft: false,
    currentid: '',
    plateid: '',
    scrollTop: 0,  //用作跳转后右侧视图回到顶部
    classifyList:[],
    classifyRecommend: [],
    classifyid:'',
    classifytext: '',
    recommend_list: [],
  },
  backReturn: function () {
    wx.navigateBack({
    })
  },
  tz_periphery: function (e) {
    wx.navigateTo({
      url: '/pages/home/pages/ecology/periphery/periphery?showSearchType=' + 2,
    })
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      classifyid: options.classifyid
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({          
          scrollHeight: res.windowHeight - res.windowWidth / 750 * (133+120),  
          scrollHeight2: res.windowHeight - res.windowWidth / 750 * (133 + 120)            
        });
      }
    });
    that.getClassify();
    that.getList(false);
  },
  onShow: function () {

  },

  //点击左侧
  left_choice: function (e) {
    var that = this;
    that.setData({
      currentid: e.currentTarget.dataset.leftid
    })
    for (var i = 0; i < that.data.classifyList.length; i++) {
      if (e.currentTarget.dataset.leftid == that.data.classifyList[i].id) {
        that.setData({
          // plateid: that.data.list[i].id,
          // rightlist: that.data.list[i].categorytopic,
          classifyid: e.currentTarget.dataset.leftid,
          classifytext: e.currentTarget.dataset.classifytext
        })
      }
    }
    that.getList(false)
  },
  getClassify: function () {
    var that = this;
    network.POST({
      url: 'v13/shop-goods/category-all',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0];
          a.list.unshift({ id: '0', name: '为你推荐' });
          that.setData({
            classifyRecommend: a.recommend,
            classifyList: a.list,
          });
          
          
          for (var i = 0; i < that.data.classifyList.length; i++) {
            if (that.data.classifyid == that.data.classifyList[i].id) {
              that.setData({
                currentid: that.data.classifyid,
                classifytext: that.data.classifyList[i].name
              })
            }
          }
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
            console.log(that.data.list)
          } else {
            that.setData({
              list: a,
              showEmpty: a.length == 0 ? true : false
            });
          }
          hasmore = res.data.data[0].hasmore;
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
})