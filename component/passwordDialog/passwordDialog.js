const network = require("../../utils/main.js");
const app = getApp();


Component({
    properties: {},
    data: {
        password: []
    },
    attached() {
   
    },
    methods: {
        hidePwdDialog(){    
            this.triggerEvent('hidePwdDialog');
        },
        clickKey: function(e){ 
            var that = this;  
            var a = e.currentTarget.dataset.i;
            var b = that.data.password;
            if(b.length < 6){
                b.push(a);
                that.setData({
                    password: b
                });
                that.watchPwd(b);
            }
        },
        watchPwd (arr){
            var that = this;
            if(arr.length == 6){
                // console.log(arr);
                that.triggerEvent('getPwd', arr.join(''));
            }
        },
        del: function(e){
            var that = this;
            var a = e.currentTarget.dataset.i;
            var b = that.data.password;
            b.pop();
            // console.log(b);
            that.setData({
                password: b
            });
        }
    }
})
