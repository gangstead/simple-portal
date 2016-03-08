import Ember from 'ember';

const { attr } = DS;

export default Ember.Route.extend({

  model: function() {
    return this.store.findAll('thing');
  }

});
