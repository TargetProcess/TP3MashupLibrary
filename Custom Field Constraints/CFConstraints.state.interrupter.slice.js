tau.mashups
    .addDependency('Underscore')
    .addDependency('tp3/mashups/sliceinterrupter')
    .addDependency('tp3/mashups/storage')
    .addDependency('CFConstraints.state.interrupter')
    .addDependency('CFConstraints.slice.decoder')
    .addModule('CFConstraints.state.interrupter.slice', function(_, SliceInterrupter, Storage, CFConstraintsStateInterrupter, SliceDecoder) {
        var CFConstraintsStateInterrupterSlice = CFConstraintsStateInterrupter.extend({
            init: function(dataProvider, requirements, requireEntityCFsCallback) {
                this._super(dataProvider, requirements, requireEntityCFsCallback);
                this.sliceDecoder = new SliceDecoder();
            },

            _getInterrupter: function() {
                return new SliceInterrupter();
            },

            _getChangedEntityId: function(change) {
                return this.sliceDecoder.decode(change.id);
            },

            _getNewState: function(entity, entityStatesDetailed, changesToInterrupt, defaultProcess) {
                var entityStateChange = _.find(changesToInterrupt, function(change) {
                    return parseInt(this.sliceDecoder.decode(change.id)) == entity.id;
                }, this);

                return this._getEntityState(entity, entityStatesDetailed, entityStateChange.changes, defaultProcess);
            },

            _getEntityState: function(entity, entityStates, changes, defaultProcess) {
                var stateName = this.sliceDecoder.decode(_.find(changes,function(change) {
                    return this._shouldChangeBeHandled(change);
                }, this).value);

                return _.find(entityStates, function(state) {
                    return state.process.id == this.dataProvider.getEntityProcessId(entity, defaultProcess)
                        && state.entityType.name == entity.entityType.name
                        && (stateName.toLowerCase() == state.name.toLowerCase()
                        || (stateName.toLowerCase() == '_initial' && state.isInitial)
                        || (stateName.toLowerCase() == '_final' && state.isFinal)
                        || (stateName.toLowerCase() == '_planned' && state.isPlanned)
                        )
                }, this);
            }
        });

        return CFConstraintsStateInterrupterSlice;
    });
