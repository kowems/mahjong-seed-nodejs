cc.Class({
    extends: cc.Component,

    properties: {
        on:cc.Node,
        off:cc.Node,
        label:cc.Label,
        onColor:cc.Color,
        offColor:cc.Color,
         _isOn:false,
        isOn:{
            set:function(value){
                if( this._isOn != value )
                {
                    this._isOn = value;
                    this.updateState();                    
                }                
            },
            get:function(){
                return this._isOn;  
            }
        },
    },

    onLoad: function () {
        this.updateState();
    },   
     

    updateState: function () {
        this.on.active = false;
        this.off.active = false;
        if( this.isOn )
        {
            this.on.active = true;
            this.label.node.color = this.onColor;
        }else{
            this.off.active = true;
            this.label.node.color = this.offColor;
        }
    },

    onClick: function () {
        if( !this.isOn )        
        {
             this.isOn = !this.isOn;
            this.node.emit("change",this.isOn);
        }       
    }
     
});
