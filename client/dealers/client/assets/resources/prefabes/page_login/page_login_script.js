cc.Class({
    extends: cc.Component,

    properties: {
        txt_account:cc.EditBox,
        txt_pwd:cc.EditBox,
        label_msg:cc.Label,
    },

    onLoad: function () {
        var account = cc.sys.localStorage.getItem("account");
        var pwd = cc.sys.localStorage.getItem("password");
        var lastLogin = cc.sys.localStorage.getItem("lastLogin");
        if( !lastLogin )
            lastLogin = 0;
        //1小时失效
        if( account && pwd && ( Date.now() - lastLogin ) < 3600000 )
        {
            this.doLogin(account,pwd);
        }else{
            cc.sys.localStorage.removeItem("password");
            this.showLogin(account);
        }

        this.showMsg();
    },

    showLogin: function (account) 
    {
        this.txt_account.string = account || "";
        this.txt_pwd.string = "";
    },

    onBeginEdit: function () {
        this.showMsg();
    },
    
    doLogin: function (uid,pwd) {
        var fn = function(ret){
            if(ret.errcode === 0){
                cc.log("登陆成功" + ret.name);               
                cc.sys.localStorage.setItem("lastLogin",Date.now());
                cc.userdata = ret;
                cc.app.removePage(2,0);
                cc.app.showPage("prefabes/page_index/page_index",0,false);
            }
            else{
                cc.sys.localStorage.removeItem("account");
                cc.sys.localStorage.removeItem("password");
                this.showMsg("用户名或密码不正确！");
            }
        };
        
        var data = {
            account:uid,
            password:pwd,
        }

        cc.sys.localStorage.setItem("account",data.account);
        cc.sys.localStorage.setItem("password",data.password);
        cc.sys.localStorage.setItem("lastLogin",0);
        cc.http.sendRequest("/login",data,fn.bind(this));
    },

    showMsg: function (msg) {
        if( msg && msg != "" )
        {
            this.label_msg.string = msg;
            this.label_msg.node.active = true;
            return ;
        }
        this.label_msg.node.active = false;
    },


    onLoginBtnClick: function () {
        var uid = this.txt_account.string;
        var pwd = this.txt_pwd.string;
        if( !uid || uid == "")
        {
           this.showMsg("请输入用户名!");
           return ;
        }
        if(!pwd || pwd=="")
        {
             this.showMsg("请输入密码！");
             return ;
        }
        this.doLogin( uid,pwd); 
    }
});
