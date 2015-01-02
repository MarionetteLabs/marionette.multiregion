(function() {

  var DummyItemView = Backbone.Marionette.ItemView.extend({
    template: _.template('<div><p><button data-action="remove">X</button><span></span></p></div>'),

    ui: {
      text: 'span'
    },

    triggers: {
      'click [data-action="remove"]': 'click:remove'
    },

    onShow: function() {
      this.ui.text.text(this.options.text);
    }

  });



  var Layout = Backbone.Marionette.LayoutView.extend({
    template: false,

    el: '#layout',

    ui: {
      input: 'input'
    },

    events: {
      'click [data-action="add"]':    'onClickAdd',
      'click [data-action="clear"]':  'onClickClear'
    },

    regionClass: Backbone.Marionette.MultiRegion,

    regions: {
      container: '#one-region'
    },



    onClickAdd: function(event) {
      var value = this.ui.input.val();
      if (!value) return;

      this._addDummyRegion(value);
    },

    onClickClear: function() {
      this.container.empty();
    },

    onDummyWantRemove: function(o) {
      // ?? WTF
      this.container.remove(o.view);
    },



    _addDummyRegion: function(text) {
      var dummyView = new DummyItemView({text: text});
      this.listenToOnce(dummyView, 'click:remove', this.onDummyWantRemove.bind(this));
      this.container.show(dummyView);
    }

  });

  var layout = new Layout();
  layout.render();

})();
