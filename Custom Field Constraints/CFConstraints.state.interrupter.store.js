tau.mashups
    .addDependency('Underscore')
    .addDependency('tp3/mashups/storage')
    .addDependency('CFConstraints.state.interrupter')
    .addModule('CFConstraints.state.interrupter.store', function(_, Storage, CFConstraintsStateInterrupter) {
        var CFConstraintsStateInterrupterStore = CFConstraintsStateInterrupter.extend({
            init: function(dataProvider, requirements, requireEntityCFsCallback) {
                this._super(dataProvider, requirements, requireEntityCFsCallback);
            },

            _getInterrupter: function() {
                return new Storage();
            },

            _getChangedEntityId: function(change) {
                return change.id;
            },

            _getNewState: function(entity, entityStatesDetailed, changesToInterrupt) {
                var entityStateChange = _.find(changesToInterrupt, function(change) {
                        return change.id == entity.id;
                    }
                );

                var newStateId = _.find(entityStateChange.changes,function(change) {
                    return this._shouldChangeBeHandled(change);
                }, this).value.id;

                return _.find(entityStatesDetailed, function(state) {
                    return state.id == newStateId;
                });
            }
        });

        return CFConstraintsStateInterrupterStore;
    });
