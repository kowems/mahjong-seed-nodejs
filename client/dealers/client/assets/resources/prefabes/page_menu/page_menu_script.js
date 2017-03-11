var MENU_ITEM = require("menu_item_script")
cc.Class({
    extends: cc.Component,

    properties: {
         menus:{
             default:[],
             type:MENU_ITEM
         },
         _curState:-1
    },

    onLoad: function () {
        this.menus.forEach(function(element) {
            element.isOn = false;
            element.node.on("change",this.onSelectChange.bind(this));
        }, this);
        this._curState = -1;
        // this.setSeletMenu(_curState);
    },

    start: function ()
    {
        this.setSeletMenu(0);
    },

    onSelectChange: function (event) {

        var olds = this.menus[this._curState];
        olds.isOn = false;

        var targ = event.target;
        var indx = this.menus.indexOf(targ.getComponent("menu_item_script"));
        this.setSeletMenu(indx);
    },


    setSeletMenu: function (index)
    {
        if( this._curState == index || index < 0 || index >= this.menus.length )
            return ;

        this._curState = index;
        this._updateState();
        cc.app.removePage(0,0);
        /**prefab,index,showBack,name,scriptName,detail,single,store*/
        switch(this._curState)
        {
            case 0:                
                cc.app.showPage("prefabes/page_index/page_index",0,false,null,null,null,true);
                break;
            case 1:
                cc.app.showPage("prefabes/page_shop/page_shop",0,false,null,null,null,true);
                break;
            case 2:
                cc.app.showPage("prefabes/page_sell/page_sell",0,false,null,null,null,true);
                break;
            case 3:
                cc.app.showPage("prefabes/page_dealer/page_dealer",0,false,null,null,null,true);
                break;
            case 4:
                cc.app.showPage("prefabes/page_mine/page_mine",0,false,null,"page_mine_script",cc.userdata.account,null,true);
                break;
        }

    },

    _updateState: function () {
        if(  this._curState < 0 || this._curState >= this.menus.length )
            return ;

        for (var index = 0; index < this.menus.length; index++) {
            
            if( index  == this._curState )
            {
                this.menus[index].isOn = true;
                continue;
            }                
            this.menus[index].isOn = false;            
        }       
    }



     
});
