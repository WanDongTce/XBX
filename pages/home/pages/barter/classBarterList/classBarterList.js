const network = require("../../../../../utils/main.js");
const app = getApp();
var selectName = '';


Page({
    data: {
        selectedId: '',
        list: [],
        base: '../../../../../'
    },
    onLoad(){
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function () {
        this.setData({
            list: app.classBarter.slice(1)
        });
      var that = this;
      that.component = that.selectComponent("#component")
      that.component.customMethod()
    },
    selectItm: function(e){
        var dt = e.currentTarget.dataset;
        this.setData({
            selectedId: dt.id
        });
        selectName = dt.name;
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    confirmFn: function(){
        var that = this;
        var a = that.data.selectedId;
        wx.setStorageSync('selectedBarClss', {id: a, name: selectName});
        wx.navigateBack({
            delta: 1
        });
    },
    cancleFn: function(){
        this.setData({
            selectedId: ''
        });
        selectName = '';
        // wx.removeStorageSync('selectedBarClss');

        wx.navigateBack({
            delta: 1
        });
    }
})