(function(Backbone) {

  var Marionette = Backbone.Marionette;

  Marionette.MultiRegion = Marionette.Region.extend({

    constructor: function() {
      this.currentViews = [];
      Marionette.Region.apply(this, arguments);
    },

    // Displays a backbone view instance inside of the region.
    // Handles calling the `render` method for you. Reads content
    // directly from the `el` attribute. Also calls an optional
    // `onShow` and `onDestroy` method on your view, just after showing
    // or just before destroying the view, respectively.
    // The `preventDestroy` option can be used to prevent a view from
    // the old view being destroyed on show.
    // The `forceShow` option can be used to force a view to be
    // re-rendered if it's already shown in the region.
    show: function(view, options){
      if (!this._ensureElement()) {
        return;
      }

      this._ensureViewIsIntact(view);

      var showOptions     = options || {};
      var isDifferentView = !this.hasView(view);
      var preventDestroy  = !!showOptions.preventDestroy;
      var forceShow       = !!showOptions.forceShow;

      // We are only changing the view if there is a current view to change to begin with
      var isChangingView = this.hasViews();

      // Only destroy the current view if we don't want to `preventDestroy` and if
      // the view given in the first argument is different than `currentView`
      var _shouldDestroyView = isDifferentView && !preventDestroy;

      // Only show the view given in the first argument if it is different than
      // the current view or if we want to re-show the view. Note that if
      // `_shouldDestroyView` is true, then `_shouldShowView` is also necessarily true.
      var _shouldShowView = isDifferentView || forceShow;

      if (isChangingView) {
        this.triggerMethod('before:swapOut', this.currentViews, this, options);
      }

      this.currentViews.forEach(function(currentView) {
        delete currentView._parent;
      });

      if (_shouldDestroyView) {
        this.empty();

      // A `destroy` event is attached to the clean up manually removed views.
      // We need to detach this event when a new view is going to be shown as it
      // is no longer relevant.
      } else if (isChangingView && _shouldShowView) {
        this.currentViews.forEach(function(currentView) {
          currentView.off('destroy', currentView._parentRemove, this);
        }, this);
      }

      if (_shouldShowView) {

        // We need to listen for if a view is destroyed
        // in a way other than through the region.
        // If this happens we need to remove the reference
        // to the currentView since once a view has been destroyed
        // we can not reuse it.
        view.once('destroy', (view._parentRemove = _.bind(this.remove, this, view)), this);
        view.render();

        view._parent = this;

        if (isChangingView) {
          this.triggerMethod('before:swap', view, this, options);
        }

        this.triggerMethod('before:show', view, this, options);
        Marionette.triggerMethodOn(view, 'before:show', view, this, options);

        // An array of views that we're about to display
        var attachedRegion = Marionette.isNodeAttached(this.el);

        // The views that we're about to attach to the document
        // It's important that we prevent _getNestedViews from being executed unnecessarily
        // as it's a potentially-slow method
        var displayedViews = [];

        var triggerBeforeAttach = showOptions.triggerBeforeAttach || this.triggerBeforeAttach;
        var triggerAttach = showOptions.triggerAttach || this.triggerAttach;

        if (attachedRegion && triggerBeforeAttach) {
          displayedViews = this._displayedViews(view);
          this._triggerAttach(displayedViews, 'before:');
        }

        // forward options to attachHtml so this one can
        // know if the view needs to be attached before / after
        this.attachHtml(view, options);
        this.currentViews.push(view);

        if (attachedRegion && triggerAttach) {
          displayedViews = this._displayedViews(view);
          this._triggerAttach(displayedViews);
        }

        if (isChangingView) {
          this.triggerMethod('swap', view, this, options);
        }

        this.triggerMethod('show', view, this, options);
        Marionette.triggerMethodOn(view, 'show', view, this, options);

        return this;
      }

      return this;
    },

    // Add & displays a backbone view instance inside of the region.
    // Handles calling the `render` method for you. Reads content
    // directly from the `el` attribute. Also calls an optional
    // `onShow` and `onDestroy` method on your view, just after showing
    // or just before destroying the view, respectively.
    // The `preventDestroy` option can be used to prevent a view from
    // the old view being destroyed on show.
    // The `forceShow` option can be used to force a view to be
    // re-rendered if it's already shown in the region.
    add: function(view, options){
      if (!this._ensureElement()) {
        return;
      }

      this._ensureViewIsIntact(view);

      var showOptions     = options || {};
      var isDifferentView = !this.hasView(view);
      var forceShow       = !!showOptions.forceShow;

      // Only show the view given in the first argument if it is different than
      // the current view or if we want to re-show the view. Note that if
      // `_shouldDestroyView` is true, then `_shouldShowView` is also necessarily true.
      var _shouldShowView = isDifferentView || forceShow;

      if (_shouldShowView) {

        // We need to listen for if a view is destroyed
        // in a way other than through the region.
        // If this happens we need to remove the reference
        // to the currentView since once a view has been destroyed
        // we can not reuse it.
        view.once('destroy', (view._parentRemove = _.bind(this.remove, this, view)), this);
        view.render();

        view._parent = this;

        this.triggerMethod('before:show', view, this, options);
        Marionette.triggerMethodOn(view, 'before:show', view, this, options);

        // An array of views that we're about to display
        var attachedRegion = Marionette.isNodeAttached(this.el);

        // The views that we're about to attach to the document
        // It's important that we prevent _getNestedViews from being executed unnecessarily
        // as it's a potentially-slow method
        var displayedViews = [];

        var triggerBeforeAttach = showOptions.triggerBeforeAttach || this.triggerBeforeAttach;
        var triggerAttach = showOptions.triggerAttach || this.triggerAttach;

        if (attachedRegion && triggerBeforeAttach) {
          displayedViews = this._displayedViews(view);
          this._triggerAttach(displayedViews, 'before:');
        }

        // forward options to attachHtml so this one can
        // know if the view needs to be attached before / after
        this.attachHtml(view, options);
        this.currentViews.push(view);

        if (attachedRegion && triggerAttach) {
          displayedViews = this._displayedViews(view);
          this._triggerAttach(displayedViews);
        }

        this.triggerMethod('show', view, this, options);
        Marionette.triggerMethodOn(view, 'show', view, this, options);

        return this;
      }

      return this;
    },

    // Override this method to change how the new view is
    // appended to the `$el` that the region is managing
    // TODO: handle more options
    attachHtml: function(view, options) {
      // empty the node and append new view
      // We can not use `.innerHTML` due to the fact that IE
      // will not let us clear the html of tables and selects.
      // We also do not want to use the more declarative `empty` method
      // that jquery exposes since `.empty` loops over all of the children DOM
      // nodes and unsets the listeners on each node. While this seems like
      // a desirable thing, it comes at quite a high perf cost. For that reason
      // we are simply clearing the html contents of the node.
      // this.$el.html('');
      this.el.appendChild(view.el);
    },

    // Destroy the current views, if there is one. If there is no
    // current view, it does nothing and returns immediately.
    empty: function() {
      // If there is no view in the region
      // we should not remove anything
      if (!this.hasViews()) { return; }

      // remove one by one
      // TODO: maybe better perf if bulk removed
      _.forEach(this.currentViews, this.remove, this);

      return this;
    },

    // Destroy the view given in parameter. If this view is not
    // shown, it does nothing and return immediately.
    remove: function(view) {
      // If there is no view in the region
      // we should not remove anything
      if (!this.hasView(view)) { return; }

      view.off('destroy', view._parentRemove, this);
      this.triggerMethod('before:empty', view);
      this._destroyView(view);
      this.triggerMethod('empty', view);

      // Remove region pointer to the currentViews
      this.currentViews = _.without(this.currentViews, view);

      return this;
    },

    // call 'destroy' or 'remove', depending on which is found
    // on the view (if showing a raw Backbone view or a Marionette View)
    _destroyView: function(view) {
      if (view.destroy && !view.isDestroyed) {
        view.destroy();
      } else if (view.remove) {
        view.remove();

        // appending isDestroyed to raw Backbone View allows regions
        // to throw a ViewDestroyedError for this view
        view.isDestroyed = true;
      }
    },

    // Attach an existing view to the region. This
    // will not call `render` or `onShow` for the new view,
    // and will not replace the current HTML for the `el`
    // of the region.
    attachView: function(view) {
      if (!this.hasView(view)) {
        this.currentViews.push(view);
      }
      return this;
    },

    // Checks whether a view is currently present within
    // the region. Returns `true` if there is and `false` if
    // no view is present.
    hasView: function(view) {
      return _.contains(this.currentViews, view);
    },

    hasViews: function() {
      return this.currentViews.length > 0;
    }

  });

})(Backbone);
