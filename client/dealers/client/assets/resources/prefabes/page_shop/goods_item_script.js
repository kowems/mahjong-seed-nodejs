cc.Class({
    extends: cc.Component,

    properties: {
         icon:cc.Sprite,
         title:cc.Label,
         info:cc.Label,
         price:cc.Label,
         _curItem:null
    },

    // use this for initialization
    onLoad: function () {

    },

    showInfo: function (item) {        
        if( !item )
        {
            this._curItem = null;
            return ;
        }
        this._curItem = item;

        //icon

        this.title.string = item.goods_name;
        if( item.goods_type == 1 ){
            this.info.string = item.goods_num + " 房卡";
        }else if(item.goods_type == 2) {
            this.info.string = item.goods_num + " 金币";
        }

        if( item.price_type == 1){
            this.price.string = item.goods_price+" 积分";
        }else if( item.price_type == 2){
            this.price.string = item.goods_price+" 房卡";
        }       

    },


    onBuyClick:function () {
        if(this._curItem ){
            this.node.emit("buyGoods",this._curItem);
        }
    }



});
