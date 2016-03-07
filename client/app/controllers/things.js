import Ember from 'ember';

export default Ember.Controller.extend({
  //
  // firstName: null,

  actions: {
    createThing() {
      const firstName = this.get('firstName');
      console.log(firstName);

      let newThing = this.store.createRecord('thing', {firstName: firstName});
      this.set('firstName', '');
      newThing.save();
    }
  }
});
