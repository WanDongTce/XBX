const network = require("../../utils/main.js");
const app = getApp();

Component({
    properties: {
        item: {
            type: Object,
            value: {},
            observer: function (newVal, oldVal) {
            }
        },
        resourcetypeid: Number,
        agreenum: {
            type: Number,
            observer: function (newVal, oldVal) {
                if (newVal > oldVal){
                    this.setData({count: 1});
                }else{
                    this.setData({count: 0});
                }
            }
        }
    },
    data: {
        count: 0,
        base: '../../'
    },
    methods: {
        onTap: function (e) {
            var id = e.currentTarget.dataset.id;
            if (this.data.count == 0) {
                var a = this.data.agreenum;
                a++;
                this.setData({
                    agreenum: a
                });
                this.addAgree(id);
            } else {
                wx.showToast({
                    title: '您已点赞',
                    icon: 'none',
                    duration: 1000
                })
            }
        },
        addAgree: function (id) {
            var that = this;
            network.addAgree(that.data.resourcetypeid, id);
        }
    },
    detached: function () {
        this.setData({
            count: 0
        });
    },
    attached: function (){
        this.setData({
            count: 0
        });
    }
})
