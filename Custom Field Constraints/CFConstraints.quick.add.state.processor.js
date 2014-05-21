tau.mashups
    .addDependency('Underscore')
    .addDependency('CFConstraints.quick.add.processor')
    .addModule('CFConstraints.quick.add.state.processor', function(_, QuickAddProcessor) {
        var CFConstraintsQuickAddStateProcessor = QuickAddProcessor.extend({
            init: function(requirements) {
                this._super(requirements);
                this.initialState = '_initial';
                this.finalState = '_final';
                this.plannedState = '_planned';
            },

            _getRequiredCFs: function(newValue, entityStates, process, entityType, customFields) {
                var requiredCFs = [],
                    state = this._getState(newValue, entityStates, process, entityType);

                if (state) {
                    requiredCFs = this.requirements.getRequiredCFsForState({
                            entity: {
                                entityType: {name: entityType},
                                customFields: _.map(customFields, function(customField) {
                                    return {name: customField.name, value: customField.config.defaultValue}
                                })
                            },
                            processId: process.id,
                            requirementsData: {
                                newState: state
                            }
                        }
                    );
                }

                return requiredCFs;
            },

            _getState: function(stateName, entityStates, process, entityType) {
                return _.find(entityStates, function(item) {
                    return (
                        ((item.isInitial && stateName.toLowerCase() == this.initialState) ||
                            (item.isFinal && stateName.toLowerCase() == this.finalState) ||
                            (item.isPlanned && stateName.toLowerCase() == this.plannedState)
                        ) || (item.name.toLowerCase() == stateName.toLowerCase())) &&
                        item.entityType.name.toLowerCase() == entityType.toLowerCase() &&
                        item.process.id == process.id;
                }, this);
            },

            _getAxisValueName: function() {
                return 'entitystate';
            },

            _getAxisDefaultValue: function() {
                return this.initialState;
            },

            _getNewAxisValue: function(axisValue, axisAction) {
                return this.sliceDecoder.decode(axisAction);
            }
        });

        return CFConstraintsQuickAddStateProcessor;
    });