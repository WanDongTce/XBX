var network = require("../../../../utils/main.js");
var app = getApp();


Page({
  data: {
        selected: '',
        list: []
  },
  onLoad: function (options) {
      this.compontNavbar = this.selectComponent("#compontNavbar");
  },
  onShow: function () {
      var that = this;
      that.getList();
  },
  getList() {
      var that = this;
      var a = app.bankCardList;
      for(var i = 0; i < a.length; i++){
          a[i].bankNum = a[i].bank_number.substr(-4,4);
      }

      that.setData({
          list: app.bankCardList,
          showAdd: a.length == 0 ? true : false
      });

      app.bankCardList = a;
    //   console.log(a);
  },
  checkCard(e){
      var a = e.currentTarget.dataset.item;
      this.setData({
          selected: a.id
      });
      wx.setStorageSync("wCashBankCard", a);
      wx.navigateTo({
          url: '/pages/my/pages/withCash/withCash'
      });
  }
})