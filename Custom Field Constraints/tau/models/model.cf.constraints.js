tau.mashups
    .addDependency('tau/core/extension.base')
    .addModule('tau/cf.constraints/models/model.cf.constraints', function(ExtensionBase) {
        return ExtensionBase.extend({
            'bus afterInit': function(evtArgs, afterInitEvtArg) {
                this.fire('dataBind', {
                    entity: afterInitEvtArg.config.context.entity
                });
            }
        });
    });