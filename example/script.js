(function() {

    var DummyItemView = Backbone.Marionette.ItemView.extend({
        template: false,
        onShow: function() {
            this.$el.text(this.options.text);
        }
    });

    var Layout = Backbone.Marionette.LayoutView.extend({
        template: false,
        el: '#layout',

        ui: {
            input: 'input'
        },

        events: {
            'click button': 'onClickButton'
        },

        regions: {
            container: '#one-region'
        },



        onClickButton: function(event) {
            var value = this.ui.input.val();
            if (!value) return;

            this._addDummyRegion(value);
        },



        _addDummyRegion: function(text) {
            this.container.show(new DummyItemView({text: text}));
        }

    });

    var layout = new Layout();
    layout.render();

})();
