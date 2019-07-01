

Component({
  properties: {
    item: Object,
    uid: Number
  },  
  methods: {
    swiMore: function () {
        var that = this;
        var a = that.data.more;
        that.setData({
            more: !a
        });
    },
    addMsg: function(e){    
        this.triggerEvent('comTap', e.currentTarget.dataset);       
    }
  },
  ready: function () {
    //  console.log(this.data.item);
  }
})