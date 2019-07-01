const network = require("../../../utils/main.js");
const app = getApp();
var typeid = '';
var id = '';
var timer = 90000;
var timeout = null;

Page({
    data: {
        base: '../../../',
        src: ''
    },
    onLoad: function (options) {
        // console.log(options);
        this.compontNavbar = this.selectComponent("#compontNavbar");
        var that = this;

        typeid = options.getpointype;
        id = options.studyid;
        if (id && (typeid == 1 || typeid == 2)) {
            this.setData({
                src: options.src
            });
            timeout = setTimeout(function () {
                that.getPoint();
            }, timer);
        }else{
            var a = options.src + '?';
            for(var k in options){
                if (k != 'src'){
                    a += k + '=' + options[k] + '&';
                }
            }
            // console.log(a);
            a = a.slice(0, a.length-1);
            // console.log(a);

            this.setData({
                src: a
            });
        }   
    },
    getPoint() {
        network.getPoint(typeid, id);
    },
    onUnload() {
        clearTimeout(timeout);
        timeout = null;
    }
})