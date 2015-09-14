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
                        return change.id === entity.id;
                    }
                );

                var change = _.find(entityStateChange.changes, function(change) {
                    return this._shouldChangeBeHandled(change);
                }, this);

                return this._getStateFromChange(entityStatesDetailed, change);
            },

            _getStateFromChange: function(entityStatesDetailed, change) {
                if (this._isTeamStateChange(change)) {
                    var value = change.value;
                    if (_.isArray(value) && value.length === 1 && value[0].entityState) {
                        return this._getTeamStateFromChange(entityStatesDetailed, value[0].entityState.id);
                    } else {
                        return null;
                    }
                } else {
                    var newStateId = change.value.id;
                    return _.find(entityStatesDetailed, function(state) {
                        return state.id === newStateId;
                    });
                }
            },

            _getTeamStateFromChange: function(entityStatesDetailed, teamStateId) {
                return _.find(entityStatesDetailed, function(state) {
                    return _.some(state.subEntityStates, function(sub) {
                        return sub.id === teamStateId;
                    });
                });
            }
        });

        return CFConstraintsStateInterrupterStore;
    });
