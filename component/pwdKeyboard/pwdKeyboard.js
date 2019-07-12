const network = require("../../utils/main.js");
const app = getApp();
var password = [];

Component({
    properties: {
        flag: {
            type: Number,
            value: {},
            observer: function (newVal, oldVal) {
                if(newVal != oldVal){
                    password = [];
                }
            }
        },
    },
    data: {},
    attached() {
        password = [];  
    },
    methods: {
        hideKeyboard() {
            this.triggerEvent('hideKeyboard');
            password = [];
        },
        clickKey: function (e) {
            var that = this;
            var a = e.currentTarget.dataset.i;
         
            if (password.length < 6) {
                password.push(a);
                that.triggerEvent('watchPwd', password);
            }
        },
        del: function (e) {
            var that = this;
            var a = e.currentTarget.dataset.i;

            password.pop();
            that.triggerEvent('watchPwd', password);
        }
    }
})
