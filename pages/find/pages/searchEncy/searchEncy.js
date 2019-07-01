const network = require("../../../../utils/main.js");
const app = getApp();


Page({
    data: {
        base: '../../../../',
        search: '',
        showContent: true,
        about: [],
        sort: []
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        var a = JSON.parse(options.data);
        this.setData({
            sort: a.sort,
            about: a.about
        });
    },
    toSearch(){
        wx.navigateTo({
            url: '/pages/find/pages/search/search',
            complete(err) {
                // console.log(err);
                if (err.errMsg == 'navigateTo:fail webview count limit exceed') {
                    app.webViewLimitate();
                }
            }
        })
    },
    cancel: function () {
        this.setData({
            search: '',
            showContent: false,
            about: [],
            sort: [],
        });
    }
})