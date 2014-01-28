tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('CFConstraints.interrupter')
    .addModule('CFConstraints.cf.interrupter', function($, _, CFConstraintsInterrupter) {
        var CFConstraintsCFInterrupter = CFConstraintsInterrupter.extend({
            init: function(dataProvider, requirements, requireEntityCFsCallback) {
                this._super(dataProvider, requirements, requireEntityCFsCallback);
            },

            _getEntityRequiredCFs: function(entityToRequire) {
                return this.requirements.getRequiredCFsForCFs(entityToRequire);
            },

            _buildEntitiesWithRequirements: function(entitiesDetailed, changesToHandle, defaultProcess) {
                var EntitiesWithRequirementsDeferred = $.Deferred();

                var entitiesWithRequirements = _.map(entitiesDetailed, function(entity) {
                    return {
                        entity: entity,
                        processId: this.dataProvider.getEntityProcessId(entity, defaultProcess),
                        requirementsData: {
                            changedCFs: this._getCFsChanges(entity, changesToHandle)
                        }
                    };
                }, this);

                EntitiesWithRequirementsDeferred.resolve(entitiesWithRequirements);
                return EntitiesWithRequirementsDeferred.promise();
            }
        });

        return CFConstraintsCFInterrupter;
    });