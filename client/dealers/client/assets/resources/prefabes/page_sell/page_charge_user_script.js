cc.Class({
    extends: cc.Component,

    properties: {
        inputUserID:cc.EditBox,
        msg:cc.Label,
        //search res
        searchResult:cc.Node,
        resUserID:cc.Label,
        resUserName:cc.Label,
        resUserGems:cc.Label,
        inputGems:cc.EditBox,        
        //charge res
        mkChargeState:cc.Label,
        mkChargeTime:cc.Label,
        mkDetail:cc.Node,
        mkResult:cc.Node,
        mkUserID:cc.Label,
        mkUserName:cc.Label,
        mkUserGems:cc.Label,
        
        //
         _targetData:null,
    },

    // use this for initialization
    onLoad: function () {
        this.searchResult.active = false;
        this.mkResult.active = false;
        this._targetData = null;
    },
/**=========================================================================================== */

    onChargeUser:function () {
        if( !this._targetData )
        {
            return ;
        }
         
	    var num = this.inputGems.string;
        if( !num || num == "")
        {
            // cc.alert.show("错误","请出入充值房卡数额。",1);            
            this.msg = "请输入充值数额";
            return ;
        }
        var data = {
               token:cc.userdata.token,
               userid:this._targetData.userid,
               num:num
            };
        cc.http.sendRequest("/transfer_gems2user",data,this.chargeBack.bind(this));
    },


    chargeBack: function (ret) {
        console.log(ret);    
       
        this.mkResult.active = true;
        this.mkDetail.active = false;
        this.mkChargeTime.string = new Date().toLocaleDateString();
        if(ret.errcode == 0){
            // cc.alert.show("玩家充值","为 "+ this._targetData.userid +" 充值成功，当前房卡变更为："+ret.targetgems+"。\n自身剩余："+ ret.gems ,1);            
            this.mkChargeState.string = "充值成功。";           

            this.mkDetail.active = true;
            this.mkUserID.string = this._targetData.userid;
            this.mkUserName.string = this._targetData.name;
            this.mkUserGems.string = ret.targetgems;            
        }
        else if(ret.errcode == 12580){
            // cc.alert.show("提示","登录状态异常，需要重新登录!",function(){
            //     this.node.dispatchEvent("exitLogin");    
            // });
            this.mkChargeState.string = "登录状态异常，需要重新登录"; 
        }else if( ret.errcode == 4 )
        {
            // cc.alert.show("玩家充值","自身房卡不足，充值失败！",1);            
            this.mkChargeState.string = "自身房卡不足，充值失败！"; 
        }else if( ret.errcode == 5 )
        {
            // cc.alert.show("玩家充值","服务器繁忙，请稍后再试！",1);  
           this.mkChargeState.string = "服务器繁忙，请稍后再试！";   
        }
        else{            
            // cc.alert.show("玩家充值","服务器异常，请稍后再试！",1); 
            this.mkChargeState.string = "服务器异常，请稍后再试！";     
        } 
    },










/**=========================================================================================== */
    onSearch: function () {
        var searchId = this.inputUserID.string;
        if( !searchId || searchId == "" )
        {
            return ;
        }
        this.doSearchUser(searchId);   
    },


    doSearchUser: function (searchId) {
        this._targetData = null;
        this.msg.string = "查询中。。。";
        this.searchResult.active = false;
        var data = {
               token:cc.userdata.token,
               userid:searchId
            };
        cc.http.sendRequest("/search_user",data,this.searchBack.bind(this));
    },

    searchBack: function (ret)
    {
        console.log(ret);
        
        if(ret.errcode == 0){
            this.msg.string = "查询成功";

            this.resUserID.string = ret.userid;
            this.resUserName.string = ret.name,
            this.resUserGems.string = ret.gems;

            this.inputGems.string = "";
            this._targetData = ret;

            this.searchResult.active = true;            
        }
        else if(ret.errcode == 12580){
            cc.alert.show("提示","登录状态异常，需要重新登录!",function(){
                this.node.dispatchEvent("exitLogin");    
            });
        }
        else{            
            this.msg.string = "未获得相关信息，请确认玩家ID";
        }    
    }
     
});
