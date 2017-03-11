cc.Class({
    extends: cc.Component,

    properties: {
        time:cc.Label,
        goods:cc.Label,
        price:cc.Label
    },

    // use this for initialization
    onLoad: function () {

    },

    showInfo:function (item) {
        if(!item) return ;
        var t = new Date();
        t.setTime(item.time);
        this.time.string = t.toLocaleString();

        if( item.goods_type == 1){
            this.goods.string = "+ " + item.goods_num + "房卡";
        }else if(item.goods_type == 2){
           this. goods.string = "+ " + item.goods_num + "金币";
        }

        if( item.price_type == 1){
            this.price.string = "- " + item.goods_price + "积分";
        }else if(item.goods_type == 2){
            this.price.string = "- " + item.goods_price + "房卡";
        }
    }
});
