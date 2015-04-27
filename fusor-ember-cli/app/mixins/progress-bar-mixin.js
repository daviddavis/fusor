import Ember from 'ember';

export default Ember.Mixin.create({

  percentProgress: function() {
    return (this.get('model.progress') * 100).toFixed(1);
  }.property('model.progress'),

  percentProgressInt: function() {
    return (this.get('model.progress') * 100).toFixed(0);
  }.property('model.progress'),

  styleWidth: function () {
    return 'width: ' + (this.get('model.progress') * 100).toFixed(1) + '%;';
  }.property('model.progress'),

  progressBarClass: function() {
    var result = this.get('model.result');
    if (result === 'success') {
      return 'progress-bar progress-bar-success';
    } else if (result === 'error') {
      return 'progress-bar progress-bar-danger';
    } else if (result === 'warning') {
      return 'progress-bar progress-bar-warning';
    } else {
      return 'progress-bar';
    }
  }.property('model.result'),

  deploymentStatus: function() {
    var progress = this.get('model.progress');
    if (progress) {
      if (progress === 1) {
        return 'Finished';
      } else {
        return 'In Process';
      }
    } else {
      return 'Not Started';
    }
  }.property('model.progress'),

  isSpin: function() {
    return ((this.get('deploymentStatus') === 'In Process') && (this.get('model.result') === 'pending'));
  }.property('deploymentStatus', 'model.result'),

  progressBarMsg: function() {
    if ((this.get('deploymentStatus') === 'In Process') && (this.get('model.result') === 'pending')) {
      return "Downloading";
    } else if (this.get('deploymentStatus') === 'Finished') {
      return "Deployment successful";
    } else if (this.get('model.result') === 'error') {
      return "Error";
    } else if (this.get('model.result') === 'warning') {
      return "Warning";
    }
  }.property('deploymentStatus', 'model.result'),

  progressBarSubMsg: function() {
    if ((this.get('deploymentStatus') === 'In Process') && (this.get('model.result') === 'pending')) {
      return "Installing components";
    }
  }.property('deploymentStatus', 'model.result'),

});