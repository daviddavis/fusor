import DS from 'ember-data';
import Ember from 'ember';

var token = Ember.$('meta[name="csrf-token"]').attr('content');
export default DS.ActiveModelAdapter.extend({
    namespace: 'api/v21',
    headers: {
        "X-CSRF-Token": token
    },
    shouldReloadRecord(store, ticketSnapshot) {
      return true;
    },
    handleResponse(status /*, headers, payload */) {
        if(status === 401) {
            this.eventBus.trigger('displayErrorModal', {
                errorMessage: 'It looks like your session has timed out.' +
                    ' Try logging back in again to continue.',
                okayCallback: () => {
                    document.location.pathname = '/'; // Redirect to root
                }
            });
        }
            return this._super.apply(this, arguments);
    }
});
