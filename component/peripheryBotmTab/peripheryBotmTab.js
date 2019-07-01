const network = require("../../utils/main.js");
const app = getApp();


Component({
    properties: {
        index: Number,
        cartCount: Number
    },
    methods: {
        tabClick(e) {
            var a = parseInt(e.currentTarget.dataset.index);
            switch (a) {
                case 1:
                    wx.navigateTo({
                      url: '/pages/home/pages/ecology/ecology'
                    });
                    break;
                case 2:
                    wx.navigateTo({
                        url: '/pages/home/pages/periphery/gift/gift'
                    });
                    break;
                case 3:
                    wx.navigateTo({
                        url: '/pages/home/pages/periphery/order/order'
                    });
                    break;
                case 4:
                    wx.navigateTo({
                        url: '/pages/home/pages/ecology/classify/classify?classifyid=' + 0,
                    });
                    break; 
                case 5:
                  wx.navigateTo({
                      url: '/pages/home/pages/ecology/business/business',
                  });
                  break;  
            }
        }
    }
})
