tau.mashups
    .addDependency('Underscore')
    .addDependency('tp3/mashups/storage')
    .addDependency('CFConstraints.cf.interrupter')
    .addModule('CFConstraints.cf.interrupter.store', function(_, Storage, CFConstraintsCFInterrupter) {
        var CFConstraintsCFInterrupterStore = CFConstraintsCFInterrupter.extend({
            init: function(dataProvider, requirements, requireEntityCFsCallback) {
                this._super(dataProvider, requirements, requireEntityCFsCallback);
            },

            _getInterrupter: function() {
                return new Storage();
            },

            _shouldChangeBeHandled: function(change) {
                return change.name && change.name.toLowerCase() === 'customfields';
            },

            _getChangedEntityId: function(change) {
                return change.id;
            },

            _getCFsChanges: function(entity, changesToHandle) {
                var entityChanges = _.find(changesToHandle, function(change) {
                    return change.id == entity.id;
                });

                var cfsChangesToHandle = _.reduce(entityChanges.changes, function(cfsChangesToHandleMemo, change) {
                    return this._shouldChangeBeHandled(change)
                        ? cfsChangesToHandleMemo.concat(change.value)
                        : cfsChangesToHandleMemo;
                }, [], this);

                return _.filter(cfsChangesToHandle, function(changedCf) {
                    return _.find(entity.customFields, function(cf) {
                        return changedCf.name == cf.name && changedCf.value != cf.value;
                    });
                });
            }
        });

        return CFConstraintsCFInterrupterStore;
    });