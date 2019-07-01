const network = require("../../../../../utils/main.js");
const app = getApp();


Page({
    data: {
        
        src: ''
    },
    onLoad: function (options) {
        console.log(options);
        console.log(options.src);
        var aaa=JSON.parse(options.src)
        console.log(aaa.dizhi);
        var that = this;
        // var dizhi = options.src.dizhi;
        // console.log(dizhi)
        that.setData({
            src: aaa.dizhi
        })
        
    },
    
    onUnload() {
        
    }
})