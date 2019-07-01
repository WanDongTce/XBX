const network = require("../../utils/main.js");
const app = getApp();


Component({
    properties: {},
    data: {
        list: [],
        selectedArr: [],
        checkedAll: null
    },
    attached() {
        var a = app.teacherLevel;
        var list = [];
        // console.log(a);
        for (var i = 0; i < a.length; i++) {
            list.push({
                title: a[i],
                checked: false
            })
        }
        this.setData({
            list: list
        });
        // console.log(this.data.list);
    },
    methods: {
        itemClick(e) {
            var a = e.currentTarget.dataset;
            var b = this.data.selectedArr;
            var c = b.indexOf(a.title);
            var d = this.data.checkedAll;
            var list = this.data.list;

            if (!a.title) {
                var obj = this.allCheck();
                b = obj.selectedArr;
                d = obj.checkedAll;
                list = obj.list;
            } else {
                if (c == -1) {
                    list[a.index].checked = true;
                    b.push(a.title);
                } else {
                    list[a.index].checked = false;
                    b = b.slice(0, c).concat(b.slice(c + 1));
                }
            }

            this.setData({
                selectedArr: b,
                checkedAll: d,
                list: list
            });
        },
        allCheck() {
            var a = this.data.checkedAll;
            var list = this.data.list;
            var b = [];

            a = !a;
            for (var i = 0; i < list.length; i++) {
                list[i].checked = a;
                if (a) b.push(list[i].title);
            }

            return { "list": list, "checkedAll": a, "selectedArr": b };
        },
        btnConfirm() {
            var a = this.data.selectedArr;
            var b = this.data.checkedAll;
            if (a.length > 0 && !b) {
                var obj = network.arrToObj(a);
                this.triggerEvent('confirm', obj);
            } else {
                this.triggerEvent('confirm', '');
            }

        },
        btnReset() {
            var list = this.data.list;
            for (var i = 0; i < list.length; i++) {
                list[i].checked = false;
            }
            this.setData({
                list: list,
                checkedAll: false,
                selectedArr: []
            });
        }
    }
})
