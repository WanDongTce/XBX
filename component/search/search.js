const network = require("../../utils/main.js");
const app = getApp();
var search = '', index = null;

Component({
    properties: {
        flag: Number
    },
    data: {
        list: []
    },
    attached: function () {
        var a = this.data.flag;
        // console.log(a);
        if(a == 1){// 易货
            this.setData({
                list: app.barterSearchHis
            });
        }
    },
    methods: {
        saveSearch: function (e) {
            search = e.detail.value.replace(/^\s*|\s*$/, '');
        },
        submit: function () {
            var that = this;
            var a = this.data.flag;
            if(search){
                if (a == 1) {// 易货
                    app.barterSearchHis.push(search);
                } 
            }
            that.triggerEvent('searchCallBack', search);
        },
        tapHisItem: function (e) {
            var that = this;
            search = e.currentTarget.dataset.val;
            that.triggerEvent('searchCallBack', search);
        },
        clearHis: function () {
            var a = this.data.flag;
            if (a == 1) {// 易货
                app.barterSearchHis = [];
            }
            this.setData({
                list: []
            });
        }
    },
    detached: function () {
        search = '';
        index = null;
    }
})