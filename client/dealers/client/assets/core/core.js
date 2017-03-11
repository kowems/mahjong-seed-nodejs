cc.Class({
    extends: cc.Component,

    // 页面名称，显示层级，是否显示回退，回退名称，
    // 点击回退则删除当前层级的最后一个子对象。
    // 层级 ：回退名称
    properties: {
        layers:{
            default:[],
            type:cc.Node,
        },
        back:cc.Button,
        backName:cc.Label,
       _backInfo:[],
       _curInfoIdx:0, 
       _loading:false,   
    },

    // use this for initialization
    onLoad: function () {

        cc.http = require("HTTP");

        cc.page = {
            SHOW_PAGE:"show_page",
            BACK_PAGE:"back_page",
            REMOVE_PAGE:"remove_page",
            CLEAN_ALL_LAYERS:"clean_all_layers"
        };

        this.initEventListener();
    },

    start: function () {
        cc.log("框架初始完毕。。。");
    },

    initEventListener:function () {
        this.node.on(cc.page.SHOW_PAGE,this.onShowPage.bind(this));
        this.node.on(cc.page.BACK_PAGE,this.onBackPage.bind(this));
        this.node.on(cc.page.REMOVE_PAGE,this.onRemovePage.bind(this));
        this.node.on(cc.page.CLEAN_ALL_LAYERS,this.cleanAllLayers.bind(this));
    },

    /** path, layerIndex,showBack,backName,single,store*/
    onShowPage: function (info) {
        if( !info || !info.detail || this._loading)
            return ;       
        info = info.detail;

        var pageidx = info.layerIndex;
        if( pageidx < 0 || pageidx >= this.layers.length )
            return ;
        
        this._backInfo.push(info);
        this._curInfoIdx = this._backInfo.length - 1;
        this._curPath = info.path;
        //加载prefab
        cc.loader.loadRes(info.path, function (err, prefab) {
                if(prefab)
                {
                    this._prefabLoaded( prefab );
                }
                if(err)
                {
                     this._loading = false;
                    cc.log(err);
                }            
            }.bind(this)); 
        this._loading = true;

    },

    _prefabLoaded: function (prefab){        
        if( prefab )
        {   
            this._loading = false;
            var curInfo = this._backInfo[this._curInfoIdx];

            var newNode = cc.instantiate(prefab);
            newNode.name = "page"+ this._backInfo.length;

            var parent = this.layers[curInfo.layerIndex];
            if( curInfo.single )
            {
                parent.removeAllChildren();
            }
            parent.addChild( newNode );

            this.back.node.active = false;
            if( curInfo.showBack )
            {
                this.back.node.active = true;
                this.backName.string = curInfo.backName;
            }

            if( curInfo.scriptName && curInfo.scriptName != "" )
            {
                newNode.getComponent(curInfo.scriptName).init( curInfo.detail );
            }
        }
    },

    onBackPage: function (event) {
        var last = this._backInfo.pop();        

        var parent = this.layers[last.layerIndex];
        parent.removeChild( parent.getChildByName( "page"+ (this._backInfo.length + 1) ) ,true );

        //config pre 
        this.back.node.active = false;
        last = this._backInfo[ this._backInfo.length - 1 ];
        if( last )
        {            
            if( last.showBack )
            {
                this.back.node.active = true;
                this.backName.string = last.backName;
            }
        }
    },

    /**删除某一层 的 N 个界面 */
    onRemovePage: function (event)
    {
        var info = event.detail;
        if( !info && info.layerIndex > this.layers.length)
        {
            return ;
        }

        var cont = this.layers[info.layerIndex];
        if( info.removeNum < 1)
        {            
            cont.removeAllChildren();
            return ;
        }

        while ( info.removeNum >=1 ) {
            cont.removeChild( cont.children[ cont.children.length -1 ] );
            info.removeNum -= 1;
        }
    },


    cleanAllLayers: function () {
       this._curInfoIdx = 0;
       this._backInfo = [];
       this._loading = false;
       this.layers.forEach(function(element) {
            element.removeAllChildren();
       }, this);


    }



    // onCleanAlert: function (info) {

    // },

    // onRestart: function (info) {
        
    // },



});
