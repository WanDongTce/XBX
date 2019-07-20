const network = require("../../utils/main.js");
const app = getApp();


Component({
    properties: {
        url: String,
        title: String,
        isShowBack: Boolean
    },
    externalClasses: ['component-class'],
    methods: {
        goBack(e){
          if (getCurrentPages().length < 2) {
            wx.reLaunch({
              url: '/pages/main/pages/home/home'
            })
          } else {
            wx.navigateBack({
              delta: 1
            });
          } 
        }
    }
})
