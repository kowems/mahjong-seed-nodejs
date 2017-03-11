cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // use this for initialization
    onLoad: function () {

    },

    /**prefab,index,showBack,name,scriptName,detail,single,store*/
    onChargeUser: function ()
    {
        cc.app.showPage("prefabes/page_sell/page_charge_user",0,true,"售卡");
    },

    onChargeDealer: function (){
        cc.app.showPage("prefabes/page_sell/page_charge_dealer",0,true,"售卡");//"page_charge_user_script",{account:cc.user.account,target:123456}
    },

    onFreshInfo: function () {

    }


});
