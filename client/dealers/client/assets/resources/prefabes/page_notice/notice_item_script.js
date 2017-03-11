cc.Class({
    extends: cc.Component,

    properties: {
        title:cc.Label,
        content:cc.RichText,
        time:cc.Label
    },

    // use this for initialization
    onLoad: function () {

    },

    showInfo: function (info) {
        if( !info )
            return ;
        this.title.string = info.title;
        this.content.string = info.content;

        var t = new Date();
        t.setTime(info.act_time);
        this.time.string = t.toLocaleString();
    }
});
