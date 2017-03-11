cc.Class({
    extends: cc.Component,

    properties: {
        listContent:cc.Node,
        listItem:cc.Prefab,
        msg:cc.Label,
        _curAccount:null,
        _targetData:null,
    },

    // use this for initialization
    onLoad: function () {
        this.msg.string = "";
        this.clearList();
        this.searchGoods();
    },
 
/**================================================================================================================*/   

    searchGoods: function () {
        var data = {
               token:cc.userdata.token,
            };
        cc.http.sendRequest("/get_goods",data,this.searchGoodsBack.bind(this));
    },

    searchGoodsBack: function (ret)
    {
        if( !ret )
            return ;

        this.clearList();
        var pre;
        ret.forEach(function(element) {
            pre = cc.instantiate( this.listItem );
            pre.getComponent("goods_item_script").showInfo(element);
            pre.on("buyGoods",this.onBuyGoods.bind(this));
            pre.parent = this.listContent;
        }, this);  
    },


    onBuyGoods: function (event) {
        var det = event.detail;
        if(!det) return ;
        cc.log("buy goods" + det);
        var data = {
               token:cc.userdata.token,
               id:det.id
            };
        cc.http.sendRequest("/buy_goods",data,this.buyBack.bind(this));
    },

    buyBack: function (ret) {
        if( !ret )
            return ;
       if(ret.errcode == 0){
           if( ret.goods_type == 1){
               this.msg.string = "购买成功！获得："+ ret.goods_num +"房卡";
           }else if(ret.goods_type == 2){
               this.msg.string = "购买成功！获得："+ ret.goods_num +"金币";
           }            
       }else if( ret.errcode == 1 ){
           this.msg.string = "数据错误，请稍后再试";
       }else if( ret.errcode == 2 ){
           this.msg.string = "货币不足，购买失败！";
       }else if( ret.errcode == 3 ){
           this.msg.string = "系统繁忙，请稍后再试。";
       }else if( ret.errcode == 4 ){
           this.msg.string = "系统错误，请联系客服人员！";
       }else if( ret.errcode == 5 ){
           this.msg.string = "系统繁忙，请稍后再试。";
       }
    },

/**===================================================================================================== */
    onBuyRecords: function () {       
        cc.app.showPage("prefabes/page_shop_log/page_shop_log",0,true,"商城");      
    },

/**===================================================================================================== */
    clearList: function (){
        this.listContent.removeAllChildren();
    }
});
