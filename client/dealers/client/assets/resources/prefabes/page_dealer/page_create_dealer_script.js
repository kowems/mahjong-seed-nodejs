cc.Class({
    extends: cc.Component,

    properties: {
         inputAccount:cc.EditBox,
         inputName:cc.EditBox,
         inputPwd:cc.EditBox,
         msg:cc.Label,
         result:cc.Node,
         state:cc.Label,
         infos:cc.Node,
         mkId:cc.Label,
         mkName:cc.Label,
         mkPwd:cc.Label,
         _temp:null
    },

    // use this for initialization
    onLoad: function () {
        this.msg.string = "新增代理后，此代理自动成为自身下级代理。";
        this.hideResult();
    },

/**========================================================================================================== */
    onCreateClick: function () {
        var phone = this.inputAccount.string;
        var name = this.inputName.string;
        var pwd = this.inputPwd.string;

        if( !phone || phone == "" ||!name || name == "" || !pwd || pwd == ""  )
        {
            // cc.alert.show("错误","信息不完整，请检查信息。",1);
            this.msg.string = "信息不完整，请检查信息。";
        }else{

            this.hideResult();

            this._temp = {
               phone:phone,
               pwd:pwd,
               name:name
            };
            // cc.alert.show("新增代理","请确认信息：\n手机号：" + phone + "\n代理名称：" +name+ "\n初始密码：" +pwd ,0,this.doCreate.bind(this));
            this.doCreate(true);
        }       
    },

    doCreate: function (result) {
        if( result && this._temp )
        {
            this.addDealer(this._temp.phone,this._temp.name,this._temp.pwd);
        }        
    },

/**========================================================================================================== */
    addDealer:function (phone,name,pwd) {
         if( !phone || phone == "" ||!name || name == "" || !pwd || pwd == "" ){
            this.msg = "输入信息不合法，请检查输入。";
            return;
        }        

        var data = {
               token:cc.userdata.token,
               account:phone,
               password:pwd,
               name:name
            };
        cc.http.sendRequest("/create_dealer",data,this.addNewBack.bind(this));
    },

    addNewBack: function (ret) {
        console.log(ret);
        this.result.active = true;
        this.infos.active = false;
        if(ret.errcode == 0){
            this.state.string = "创建成功！(请妥善保管创建信息)";
            // this.resultInfo.string = "注册成功：\n手机号：" + this._temp.phone + "\n代理名称：" +this._temp.name+ "\n初始密码：" +this._temp.pwd ;
            this.mkId.string = this._temp.phone;
            this.mkName.string = this._temp.name;
            this.mkPwd.string = this._temp.pwd;

            this.infos.active = true;
        }
        else if(ret.errcode == 12580){
            this.state.string = "登录状态异常，需要重新登录";
            // cc.alert.show("提示","登录状态异常，需要重新登录!",function(){
            //     this.node.dispatchEvent("exitLogin");    
            // });
        }else if(ret.errcode == 1){
            this.state.string = "创建失败，请尝试更换手机号或检查输入是否正确";             
        }
        else{            
            // cc.alert.show("新增代理","服务器异常，请稍后再试！",1); 
            this.state.string = "服务器异常，请稍后再试！";
        } 
    },



/**==========================================================================================================*/

    onCopyClick: function () {
        if( this._temp )
        {
            var infos = "代理账号：\n";
            infos += "代理ID:" + this._temp.phone +"\n";
            infos += "代理名称:" + this._temp.name +"\n";
            infos += "初始密码:" + this._temp.pwd +"\n";
            this.copyTxt( infos);
        }       
    },


    copyTxt: function (value) {
        var clipboardBuffer = document.createElement('textarea');
        clipboardBuffer.style.cssText = 'position:fixed; top:-10px; left:-10px; height:0; width:0; opacity:0;';
        document.body.appendChild(clipboardBuffer);

        clipboardBuffer.focus();
        clipboardBuffer.value = value;
        clipboardBuffer.setSelectionRange(0, clipboardBuffer.value.length);
        var succeeded;
        try { 
            succeeded = document.execCommand('copy'); 
        } catch (e) 
        {
            cc.log("拷贝错误");
        }
        if( succeeded )
        {
            cc.log( "成功拷贝");
        }
    },


/**==========================================================================================================*/
    hideResult: function () {
        this.result.active = false;
    },


});
