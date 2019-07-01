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
            wx.navigateBack({
                delta: 1
            });
        }
    }
})
