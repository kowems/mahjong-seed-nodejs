cc.Class({
    extends: cc.Component,

    properties: {
        icons:{
            default:[],
            type:cc.SpriteFrame
        },
        icon:cc.Sprite,
        iname:cc.Label,
        _optionInfo:null
    },

    // use this for initialization
    onLoad: function () {

    },

    showInfo: function (info)
    {
        this._optionInfo = info;
        this.icon.spriteFrame = this.icons[info.icon];
        this.iname.string = this._optionInfo.name;
    },

    onEnterClick: function () {
        cc.log("选择了。。。。");
        cc.app.showPage(this._optionInfo.prefab,this._optionInfo.layerIndx,
                        this._optionInfo.showBack,this._optionInfo.backName,
                        this._optionInfo.scriptName,this._optionInfo.detail,
                        this._optionInfo.single,
                        this._optionInfo.store);

        // cc.app.showPage("prefabes/page_dealer/page_create_dealer",0,true,"代理");//"page_charge_user_script",{account:cc.user.account,target:123456}
    }


    // name:name,icon:icon,
    // prefab:prefab,
    // layerIndx:layerIndx,
    // showBack:showBack,backName:backName,
    // scriptName:scriptName,detail:detail,
    // single:single,
    // store:store
});
