const network = require("../../utils/main.js");
const app = getApp();

var params = {
    search: '',
    nianji: 0,
    kemu: 0,
    version: 0,
    ceshu: 4
}
// console.log(app.userInfo.grade_id)
var onloadnianji = app.userInfo.grade_id;

Component({
    properties: {},
    data: {
        nianji: onloadnianji,
        kemu: 0,
        version: 0,
        ceshu: 4,
        options: [],
        isShowOption: false,
        sctdOptIdx: null,
        animationData: null,
    },
    methods: {
        /*
        inputFn: function(e){
            params.search = e.detail.value.replace(/^\s*|\s*$/, '');
    
            this.triggerEvent('filterCallBack', params);
        },
        */
        seltClkFn: function (e) {
            var that = this;
            var a = e.target.dataset.idx;
            if (that.data.isShowOption && that.data.sctdOptIdx == a) {
                that.hideOption();
                that.setData({
                    sctdOptIdx: null
                });
            } else {
                that.getOptions(a);
            }
        },
        getOptions: function (idx) {
            var that = this;
            var a = null;
            if (idx == 1) {
                a = app.studyOptions.nianji;
            } else if (idx == 2) {
                a = app.studyOptions.kemu;
            } else if (idx == 3) {
                a = app.studyOptions.banben;
            } else if (idx == 4) {
                a = app.studyOptions.ceshu;
            } else { }
            that.setData({
                options: a
            });
            // console.log(that.data.options);
            that.showOption(idx);
            that.triggerEvent('showOptions');
        },
        selOptFn: function (e) {
            var that = this;
            var idx = that.data.sctdOptIdx;
            var a = e.target.dataset.id;
            if (idx == 1) {
                that.setData({
                    nianji: a
                });
            } else if (idx == 2) {
                that.setData({
                    kemu: a
                });
            } else if (idx == 3) {
                that.setData({
                    version: a
                });
            } else if (idx == 4) {
                a = e.target.dataset.ceshu;
                that.setData({
                    ceshu: a
                });
            } else { };

        },
        optCofmFn: function () {
            var that = this;
            var idx = that.data.sctdOptIdx;
            if (idx == 1) {
                params.nianji = that.data.nianji;
                that.setData({
                    kemu: params.kemu,
                    version: params.version,
                    ceshu: params.ceshu
                });
            } else if (idx == 2) {
                params.kemu = that.data.kemu;
                that.setData({
                    nianji: params.nianji,
                    version: params.version,
                    ceshu: params.ceshu
                });
            } else if (idx == 3) {
                params.version = that.data.version;
                that.setData({
                    nianji: params.nianji,
                    kemu: params.kemu,
                    ceshu: params.ceshu
                });
            } else if (idx == 4) {
                params.ceshu = that.data.ceshu;
                that.setData({
                    nianji: params.nianji,
                    kemu: params.kemu,
                    version: params.version
                });
            } else { };
            that.hideOption();
            that.triggerEvent('filterCallBack', params);
        },
        showOption: function (idx) {
            var animation = wx.createAnimation({
                duration: 200,
                timingFunction: "ease-out",
                delay: 0
            });
            this.animation = animation;
            animation.translateY(-200).step();
            this.setData({
                animationData: animation.export(),
                isShowOption: true,
                sctdOptIdx: idx
            });
            setTimeout(function () {
                animation.translateY(0).step();
                this.setData({
                    animationData: animation.export()
                })
            }.bind(this), 200);
        },
        hideOption: function () {
            var animation = wx.createAnimation({
                duration: 200,
                timingFunction: "ease-out",
                delay: 0
            });
            this.animation = animation;
            animation.translateY(-10).step();
            this.setData({
                animationData: animation.export()
            });
            setTimeout(function () {
                animation.translateY(-300).step();
                this.setData({
                    animationData: animation.export(),
                    isShowOption: false,
                    sctdOptIdx: 0
                });
            }.bind(this), 200);
        }
    },
    detached() {
        this.setData({
            nianji: 0,
            kemu: 0,
            version: 0,
            ceshu: 4,
            options: [],
            isShowOption: false,
            sctdOptIdx: null,
            animationData: null,
        });
        params = {
            search: '',
            nianji: 0,
            kemu: 0,
            version: 0,
            ceshu: 4
        }
    }
})
