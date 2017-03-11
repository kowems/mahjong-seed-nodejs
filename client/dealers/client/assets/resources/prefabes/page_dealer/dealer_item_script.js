cc.Class({
    extends: cc.Component,

    properties: {
        account:cc.Label,
        dealerName:cc.Label,
        curGems:cc.Label,
        curSubs:cc.Label,
        _curInfo:null
    },

    // use this for initialization
    onLoad: function () {

    },

    showInfo: function (infovalue) {
        if( !infovalue )
        {
            return ;
        }

        this._curInfo = infovalue;
        this.account.string =  infovalue.account;
        this.dealerName.string =  infovalue.name;
        this.curGems.string =  infovalue.gems;
        this.curSubs.string =  infovalue.all_subs;
    },

     onEnterInto: function ()
     {
         if( this._curInfo )
            this.node.emit("showDealerDetail",this._curInfo.account);
     }
});
