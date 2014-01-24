define([
    'tau/core/extension.base'
], function(ExtensionBase) {
    return ExtensionBase.extend({
        'bus afterInit': function() {
            this.fire('dataBind', {});
        }
    });
});