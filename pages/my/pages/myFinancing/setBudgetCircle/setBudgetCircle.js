const network = require("../../../../../utils/main.js");
const app = getApp();
Page({

    data: {
        IMGURL: app.imgUrl,
        mybudget: "",
        mynum: "",
        mysurplus: "",
    },
    onLoad: function (options) {
        // console.log(options);
        var that = this;
        this.compontNavbar = this.selectComponent("#compontNavbar");
        that.setData({
            mybudget: options.mybudget,
            mynum: options.mynum,
            mysurplus: options.mysurplus,
            prev_zhichu: options.prev_zhichu
        })
        if (that.data.mysurplus <= 0) {
            that.setData({
                mysurplus: -(options.mysurplus)
            })
        }
    },
    onShow: function () {

    },
    //点击设置预算
    tz_setBudget: function (options) {
        var that = this;
        wx.navigateTo({
            url: '/pages/my/pages/myFinancing/setBudget/setBudget?prev_zhichu=' + that.data.prev_zhichu,
        })
    },
})