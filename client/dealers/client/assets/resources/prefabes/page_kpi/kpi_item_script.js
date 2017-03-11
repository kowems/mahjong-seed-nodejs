cc.Class({
    extends: cc.Component,

    properties: {
        month:cc.Label,
        gems:cc.Label,
        score:cc.Label,
        subs:cc.Label
    },

    // use this for initialization
    onLoad: function () {
        // this.cleanInfo();
    }, 

    showInfo: function (data) {
        this.month.string = "" + (data.month + 1);
        this.gems.string = data.gems;
        this.score.string = data.score;
        this.subs.string = data.subs;
    },

    cleanInfo: function () {
        this.month.string = "";
        this.gems.string = "";
        this.score.string = "";
        this.subs.string = "";
    }

});
