cc.Class({
    extends: cc.Component,

    properties: {
         inputOld:cc.EditBox,
         inputNew:cc.EditBox,
         inputRenew:cc.EditBox,
         msg:cc.Label
    },

    // use this for initialization
    onLoad: function () {

    },

    onChangeClick: function (){
        var old = this.inputOld.string;
        var newpwd = this.inputNew.string;
        var renew = this.inputRenew.string;

        if( !old || old == "" ||  !newpwd || newpwd == "" ||  !renew || renew == "")
        {
          this.msg.string = "数据不完整，请检查输入！"; 
          retrun ;
        }

        if( newpwd != renew )
        {   
            this.inputNew.string = "";
            this.inputRenew.string = "";
            this.msg.string = "两次新密码输入不同，请重新输入！";
            return ;
        }
        this.cleanInput();
        this.doChange(old,newpwd);
    },

    doChange: function (oldpwd,newpwd)
    {
        if( !oldpwd || oldpwd == "" ||!newpwd || newpwd == "" ){
            return;
        }
        var data = {
               token:cc.userdata.token,
               account:cc.userdata.account,
               oldpwd:oldpwd,
               newpwd:newpwd
            };        
        cc.http.sendRequest("/change_own_pwd",data,this.changeBack.bind(this));
    },

    changeBack: function (ret) {
        console.log(ret);
        if(ret.errcode == 0){
            this.msg.string = "修改成功！(请妥善保管密码信息)";
            //重新登录
            cc.sys.localStorage.removeItem("account");
            cc.sys.localStorage.removeItem("password");
            cc.app.cleanAllLayers();
            cc.app.showPage("prefabes/page_login/page_login",2);
        }
        else if(ret.errcode == 12580){
            this.msg.string = "登录状态异常，需要重新登录";
            // cc.alert.show("提示","登录状态异常，需要重新登录!",function(){
            //     this.node.dispatchEvent("exitLogin");    
            // });
        }else if(ret.errcode == 1){
            this.msg.string = "修改失败！请检查原密码是否正确";             
        }
        else{            
            // cc.alert.show("新增代理","服务器异常，请稍后再试！",1); 
            this.msg.string = "服务器异常，请稍后再试！";
        } 
    },


    cleanInput: function () {
        this.inputOld.string = "";
        this.inputNew.string = "";
        this.inputRenew.string = "";
    }



});
