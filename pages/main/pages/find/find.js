const network = require("../../../../utils/main.js");
const app = getApp();

Page({
    data: {
        base: '../../../../',
        IMGURL: app.imgUrl
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    }
})