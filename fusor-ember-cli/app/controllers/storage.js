import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  step3RouteName: Ember.computed.alias("deploymentController.step3RouteName"),
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),

  hasEndingSlashInSharePath: Ember.computed('deploymentController.model.rhev_share_path', function() {
    if (Ember.isPresent(this.get('deploymentController.model.rhev_share_path'))) {
      return (this.get('deploymentController.model.rhev_share_path').slice('-1') === '/');
    }
  }),

  hasEndingSlashInExportPath: Ember.computed('deploymentController.model.rhev_export_domain_path', function() {
    if (Ember.isPresent(this.get('deploymentController.model.rhev_export_domain_path'))) {
      return (this.get('deploymentController.model.rhev_export_domain_path').slice('-1') === '/');
    }
  }),

  hasNoLeadingSlashInSharePath: Ember.computed('deploymentController.model.rhev_share_path', function() {
    if (Ember.isPresent(this.get('deploymentController.model.rhev_share_path'))) {
      return (this.get('deploymentController.model.rhev_share_path').charAt(0) !== '/');
    }
  }),

  hasNoLeadingSlashInExportPath: Ember.computed('deploymentController.model.rhev_export_domain_path', function() {
    if (Ember.isPresent(this.get('deploymentController.model.rhev_export_domain_path'))) {
      return (this.get('deploymentController.model.rhev_export_domain_path').charAt(0) !== '/');
    }
  }),

  errorsHashSharePath: Ember.computed('hasEndingSlashInSharePath', 'deploymentController.model.rhev_share_path', function() {
    if (this.get('hasNoLeadingSlashInSharePath')) {
      return {"name": 'You must have a leading slash'};
    } else if (this.get('hasEndingSlashInSharePath')) {
      return {"name": 'You cannot have a trailing slash'};
    } else {
      return {};
    }
  }),

  errorsHashExportPath: Ember.computed('hasEndingSlashInExportPath', 'deploymentController.model.rhev_export_domain_path', function() {
    if (this.get('hasNoLeadingSlashInExportPath')) {
      return {"name": 'You must have a leading slash'};
    } else if (this.get('hasEndingSlashInExportPath')) {
      return {"name": 'You cannot have a trailing slash'};
    } else {
      return {};
    }
  }),

  isNFS: Ember.computed('deploymentController.model.rhev_storage_type', function() {
    return (this.get('deploymentController.model.rhev_storage_type') === 'NFS');
  }),

  isLocal: Ember.computed('deploymentController.model.rhev_storage_type', function() {
    return (this.get('deploymentController.model.rhev_storage_type') === 'Local');
  }),

  isGluster: Ember.computed('deploymentController.model.rhev_storage_type', function() {
    return (this.get('deploymentController.model.rhev_storage_type') === 'Gluster');
  }),

  isInvalidStorageFields: Ember.computed(
    'deploymentController.model.rhev_storage_type',
    'deploymentController.model.rhev_storage_name',
    'deploymentController.model.rhev_storage_address',
    'deploymentController.model.rhev_share_path',
    'hasEndingSlashInSharePath',
    'hasNoLeadingSlashInSharePath',
    function() {
      return (Ember.isBlank(this.get('deploymentController.model.rhev_storage_type')) ||
              Ember.isBlank(this.get('deploymentController.model.rhev_storage_name')) ||
              Ember.isBlank(this.get('deploymentController.model.rhev_storage_address')) ||
              Ember.isBlank(this.get('deploymentController.model.rhev_share_path')) ||
              this.get('hasEndingSlashInSharePath') ||
              this.get('hasNoLeadingSlashInSharePath')
             );
    }
  ),

  isInvalidExportDomainFields: Ember.computed(
    'deploymentController.model.rhev_export_domain_name',
    'deploymentController.model.rhev_export_domain_address',
    'deploymentController.model.rhev_export_domain_path',
    'hasEndingSlashInExportPath',
    'hasNoLeadingSlashInExportPath',
    function() {
      return (Ember.isBlank(this.get('deploymentController.model.rhev_export_domain_name')) ||
              Ember.isBlank(this.get('deploymentController.model.rhev_export_domain_address')) ||
              Ember.isBlank(this.get('deploymentController.model.rhev_export_domain_path')) ||
              this.get('hasEndingSlashInExportPath') ||
              this.get('hasNoLeadingSlashInExportPath')
             );
    }
  ),

  invalidStorageName: Ember.computed('deploymentController.model.rhev_storage_name', function() {
      var validAlphaNumbericRegex = new RegExp(/^[A-Za-z0-9_-]+$/);
      if (Ember.isPresent(this.get('deploymentController.model.rhev_storage_name'))) {
          return !(this.get('deploymentController.model.rhev_storage_name').trim().match(validAlphaNumbericRegex));
      }
  }),

  invalidStorageAddress: Ember.computed('deploymentController.model.rhev_storage_address', function() {
      var validHostnameRegex = "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$";
      if (Ember.isPresent(this.get('deploymentController.model.rhev_storage_address'))) {
          return !(this.get('deploymentController.model.rhev_storage_address').trim().match(validHostnameRegex));
      }
  }),

  invalidExportDomainName: Ember.computed('deploymentController.model.rhev_export_domain_name', function() {
      var validAlphaNumbericRegex = new RegExp(/^[A-Za-z0-9_-]+$/);
      if (Ember.isPresent(this.get('deploymentController.model.rhev_export_domain_name'))) {
          return !(this.get('deploymentController.model.rhev_export_domain_name').trim().match(validAlphaNumbericRegex));
      }
  }),

  invalidExportAddress: Ember.computed('deploymentController.model.rhev_export_domain_address', function() {
      var validHostnameRegex = "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$";
      if (Ember.isPresent(this.get('deploymentController.model.rhev_export_domain_address'))) {
          return !(this.get('deploymentController.model.rhev_export_domain_address').trim().match(validHostnameRegex));
      }
  }),

  disableNextStorage: Ember.computed(
    'isInvalidStorageFields',
    'isInvalidExportDomainFields',
    'invalidStorageName',
    'invalidStorageAddress',
    'invalidExportDomainName',
    'invalidExportAddress',
    function () {
      if (this.get('isCloudForms')) {
        return (this.get('isInvalidStorageFields') ||
                this.get('isInvalidExportDomainFields') ||
                this.get('invalidStorageName') ||
                this.get('invalidStorageAddress') ||
                this.get('invalidExportDomainName') ||
                this.get('invalidExportAddress'));
      } else {
        return (this.get('isInvalidStorageFields') ||
                this.get('invalidStorageName') ||
                this.get('invalidStorageAddress'));
      }
    }
  ),

  validRhevStorage: Ember.computed.not('disableNextStorage')

});

