import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {

  this.resource('things', {path: 'localhost:3000/api/things'}, function() {
    this.resource('thing', {path: '/:thing_id'});
  });

});

export default Router;
