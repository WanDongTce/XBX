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
    goBack(e) {
      if (getCurrentPages().length < 2) {
        wx.reLaunch({
          url: '/pages/main/pages/home/home'
        })
      } else {
        wx.navigateBack({
          delta: 1
        });
        //答题适配
        app.questionOptions.progress--;
        if (app.questionOptions.progress > 0) { //没有跳出答题模块
          app.questionOptions.currentId = app.questionOptions.list[app.questionOptions.progress - 1].id;
        } else {
          //返回到课文页面 清空答题数据
          app.questionOptions = {
            list: [],
            currentId: 0,
            results: [],
            progress: 0,
            count: 0,
            rightTimes: 0 //分数
          }
        }
      }
    }
  }
})