const network = require("../../../../../utils/main.js");
const app = getApp();


Page({
    data: {
        base: '../../../../../'
    },
    onLoad: function() {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    }
})