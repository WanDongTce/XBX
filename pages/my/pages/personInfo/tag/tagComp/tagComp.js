const network = require("../../../../../../utils/main.js");
const app = getApp();

Component({
    properties: {
        item: Object
    },
    data: {
        isOdd: false,
        arr: []
    },
    methods: {
        selectTag: function(e){
            var that = this;
            var a = that.data.isOdd;
            var b = e.currentTarget.dataset.item;

            that.setData({
                isOdd: !a
            });

            var obj = {
                item: b,
                flag: !a
            }
       
            that.triggerEvent('selectTag', obj);
        }
    },
    attached: function () {
        var that = this;
        that.setData({
            isOdd: that.data.item.is_checked == 1? true : false
        });
    }
})
