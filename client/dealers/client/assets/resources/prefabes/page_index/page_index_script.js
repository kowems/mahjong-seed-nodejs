cc.Class({
    extends: cc.Component,

    properties: {
        listContent:cc.Node,
        listItem:cc.Prefab,
        _myOptions:{
            default:[],
            type:Object
        }
    },

    // use this for initialization
    onLoad: function () {

        this.addOptions(0,"公告",0,"prefabes/page_notice/page_notice",0,true,"首页");
        this.addOptions(0,"代理商城",1,"prefabes/page_shop/page_shop",0,true,"首页");

        this.addOptions(0,"查询代理",2,"prefabes/page_dealer/page_search_dealer",0,true,"首页");
        this.addOptions(0,"新增代理",3,"prefabes/page_dealer/page_create_dealer",0,true,"首页");

        
        this.addOptions(0,"玩家充卡",4,"prefabes/page_sell/page_charge_user",0,true,"首页");
        this.addOptions(0,"代理充卡",5,"prefabes/page_sell/page_charge_dealer",0,true,"首页"); 

        this.addOptions(0,"我的信息",6,"prefabes/page_mine/page_mine",0,true,"首页","page_mine_script",cc.userdata.account);        

        this.showItems();
    },
    
    

    showItems: function ()
    {
        this.clearList();

        var privilege = cc.userdata.privilege_level;
        var pre = null;
        this._myOptions.forEach(function(element) {
            if( privilege >= element.privilege )
            {
                pre = cc.instantiate( this.listItem );
                pre.getComponent("option_item_script").showInfo(element);
                pre.parent = this.listContent;
            }
        }, this);
    },



    //prefab,index,showBack,name,scriptName,detail,single,store
    addOptions: function (privilege,name,icon,prefab,layerIndx,showBack,backName,scriptName,detail,single,store)
    {
        this._myOptions.push( { privilege:privilege,
                                name:name,icon:icon,
                                prefab:prefab,
                                layerIndx:layerIndx,
                                showBack:showBack,backName:backName,
                                scriptName:scriptName,detail:detail,
                                single:single,
                                store:store
                            } );
    },

    clearList: function (){
        this.listContent.removeAllChildren();
    }


});
