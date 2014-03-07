tau.mashups
    .addDependency('Underscore')
    .addDependency('CFConstraints.quick.add.processor')
    .addModule('CFConstraints.quick.add.cf.processor', function(_, QuickAddProcessor) {
        var CFConstraintsQuickAddCFProcessor = QuickAddProcessor.extend({
            _getAxisValueName: function() {
                return 'ddl';
            },

            _getAxisDefaultValue: function() {
                return null;
            },

            _getNewAxisValue: function(axisValue, axisAction) {
                return {name: axisValue.substring(3), value: this.sliceDecoder.decode(axisAction)};
            },

            _getRequiredCFs: function(newValue, entityStates, process, entityType, customFields) {
                return this.requirements.getRequiredCFsForCFs({
                        entity: {
                            entityType: {name: entityType},
                            customFields: _.map(customFields, function(customField) {
                                return {name: customField.name, value: customField.config.defaultValue}
                            })
                        },
                        processId: process.id,
                        requirementsData: {
                            changedCFs: [newValue]
                        }
                    }
                );
            }
        });

        return CFConstraintsQuickAddCFProcessor;
    });