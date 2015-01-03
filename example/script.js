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
      'click [data-action="show"]':    'onClickShow',
      'click [data-action="add"]':    'onClickAdd',
      'click [data-action="clear"]':  'onClickClear'
    },

    regionClass: Backbone.Marionette.MultiRegion,

    regions: {
      container: '#one-region'
    },


    onClickShow: function(event) {
      this._addDummyRegion(this.ui.input.val(), 'show');
    },

    onClickAdd: function(event) {
      this._addDummyRegion(this.ui.input.val(), 'add');
    },

    onClickClear: function() {
      this.container.empty();
    },

    onDummyWantRemove: function(o) {
      // ?? WTF
      this.container.remove(o.view);
    },



    _addDummyRegion: function(text, method) {
      if (!text) return;

      var dummyView = new DummyItemView({text: text});
      this.listenToOnce(dummyView, 'click:remove', this.onDummyWantRemove.bind(this));
      this.container[method](dummyView);
    }

  });

  var layout = new Layout();
  layout.render();

})();
