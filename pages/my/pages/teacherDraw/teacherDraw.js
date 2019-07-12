const network = require("../../../../utils/main.js");
const app = getApp();

Page({
    data: {
        base: '../../../../',
        list: [],
        showEmpty: false,
        
    },
    onLoad: function(options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
    },
    onShow: function() {
        
    },
    
    
})