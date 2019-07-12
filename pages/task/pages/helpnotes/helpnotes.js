var network = require("../../../../utils/main.js");
var app = getApp();


Page({
    data: {
        base: '../../../../',
        curIndex: 1,
        tabs: [{ index: 1, title: '积分使用', width: '30%' }, { index: 2, title: '积分获取', width: '30%' }],
    },
    onLoad(){
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    swiTab: function (e) {
        this.setData({
            curIndex: e.currentTarget.dataset.index
        });
    }
})