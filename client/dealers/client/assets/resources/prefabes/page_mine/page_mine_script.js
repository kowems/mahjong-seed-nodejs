cc.Class({
    extends: cc.Component,

    properties: {
        title:cc.Label,
        account:cc.Label,
        gems:cc.Label,
        score:cc.Label,
        allGems:cc.Label,
        allScore:cc.Label,
        allSubs:cc.Label,
        
        options:cc.Node,

        _curAccount:null,
        _targetData:null,
    },

 // use this for initialization
    onLoad: function () {
        this.title.string = "错误";
        this.options.active = false;
        this.defaultSeting();
    },

    init: function (account) {
        this.searchInfo(account);        
    },
/**=====================================================================================================================*/  

    onKpiClick :function () {
        //跳转到 kpi 界面
        /**prefab,index,showBack,name,scriptName,detail,single,store*/
        cc.app.showPage("prefabes/page_kpi/page_kpi",0,true,"我的信息","page_kpi_script",this._curAccount);
    },

    onChangePwdClick: function (){
        cc.app.showPage("prefabes/page_pwd/page_pwd",0,true,"我的信息");
    },

    onExitLoginClick: function (){
        cc.sys.localStorage.removeItem("account");
        cc.sys.localStorage.removeItem("password");
        cc.app.cleanAllLayers();
        cc.app.showPage("prefabes/page_login/page_login",2);
    },

/**================================================================================================================== */
    searchInfo: function (account) {
         this._curAccount = account;
        if( !this._curAccount )
        {
            this.title.string = "数据错误！";
            return ;
        }            
        this._targetData = null;
        var data = {
               token:cc.userdata.token,
               account:this._curAccount
            };
        cc.http.sendRequest("/search_dealer",data,this.searchBack.bind(this));
    },

    searchBack: function (ret)
    {
        console.log(ret);
        
        if( !ret.errcode  || ret.errcode == 0){

            this._targetData = ret;

            this.title.string = ret.name;
            this.account.string = ret.account;
            this.gems.string = ret.gems,
            this.score.string = ret.score;

            this.allGems.string = ret.all_gems;
            this.allScore.string = ret.all_score;
            this.allSubs.string = ret.all_subs;

            this.options.active = true;       
        }
        else if(ret.errcode == 12580){
            cc.alert.show("提示","登录状态异常，需要重新登录!",function(){
                this.node.dispatchEvent("exitLogin");    
            });
        }
        else{            
            this.title.string = "数据错误";
        }    
    },


    defaultSeting: function () {
        this.title.string = "";
        this.account.string = "";
        this.gems.string = "",
        this.score.string = "";

        this.allGems.string = "";
        this.allScore.string = "";
        this.allSubs.string = "";
    }

});
