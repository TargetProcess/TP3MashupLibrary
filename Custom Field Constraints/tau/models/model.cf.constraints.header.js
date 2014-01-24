define([
    'tau/core/extension.base'
], function(ExtensionBase) {
    return ExtensionBase.extend({
        'bus afterInit': function(evtArgs, afterInitEvtArg) {
            this.fire('dataBind', {
                entity: afterInitEvtArg.config.context.entity
            });
        }
    });
});