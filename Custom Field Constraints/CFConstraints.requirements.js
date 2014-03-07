tau.mashups
    .addDependency('Underscore')
    .addDependency('tau/core/class')
    .addModule('CFConstraints.requirements', function(_, Class) {
        var CFConstraintsRequirements = Class.extend({
            init: function(cfConstraintsConfig) {
                this.config = cfConstraintsConfig;
            },

            getConfig: function() {
                return this.config;
            },

            getEntityTypesToInterrupt: function() {
                var types = _.reduce(this.config, function(entityTypesMemo, rule) {
                    return entityTypesMemo.concat(_.keys(rule.constraints));
                }, []);

                return _.uniq(types);
            },

            getRequiredCFsForState: function(entityWithRequirements) {
                var entityTypeCFConstraintsRule = this.getEntityTypeCFConstraintsRule(entityWithRequirements);

                if (!entityTypeCFConstraintsRule) {
                    return [];
                }

                var stateCFConstraints = entityTypeCFConstraintsRule['entityStates'];

                var requiredCFConstraints = _.filter(stateCFConstraints, function(stateCFConstraint) {
                    return stateCFConstraint.name.toLowerCase() === entityWithRequirements.requirementsData.newState.name.toLowerCase();
                });

                return this._getRequiredCFs(entityWithRequirements, requiredCFConstraints);
            },

            getRequiredCFsForCFs: function(entityWithRequirements) {
                var entityCFConstraints = this.getEntityCFConstraints(entityWithRequirements);

                if (!entityCFConstraints) {
                    return [];
                }

                var requiredCFConstraints = _.reduce(entityWithRequirements.requirementsData.changedCFs, function(cfConstraintsMemo, changedCF) {
                    var cfConstraints = _.filter(entityCFConstraints, function(entityCFConstraint) {
                        return entityCFConstraint.name.toLowerCase() === changedCF.name.toLowerCase()
                            && (entityCFConstraint.valueIn
                            ? _.some(entityCFConstraint.valueIn, function(value) {
                            return value === changedCF.value;
                        })
                            : _.every(entityCFConstraint.valueNotIn, function(value) {
                            return value !== changedCF.value;
                        }))
                    });
                    return cfConstraintsMemo.concat(cfConstraints);
                }, []);

                return this._getRequiredCFs(entityWithRequirements, requiredCFConstraints);
            },

            getEntityTypeCFConstraintsRule: function(entityWithRequirements) {
                var processCFConstraintsRule = this.getProcessCFConstraintsRule(entityWithRequirements);

                if (!processCFConstraintsRule) {
                    return null;
                }

                return processCFConstraintsRule.constraints[entityWithRequirements.entity.entityType.name.toLowerCase()];
            },

            getEntityCFConstraints: function(entityWithRequirements) {
                var entityTypeCFConstraintsRule = this.getEntityTypeCFConstraintsRule(entityWithRequirements);
                return entityTypeCFConstraintsRule ? entityTypeCFConstraintsRule['customFields'] : null;
            },

            getProcessCFConstraintsRule: function(entityWithRequirements) {
                return _.find(this.config,
                    function(constraint) {
                        return constraint.processId == entityWithRequirements.processId;
                    });
            },

            _getRequiredCFs: function(entityWithRequirements, requiredCFConstraints) {
                var requiredCFs = _.reduce(requiredCFConstraints, function(requiredCFsMemo, cfConstraint) {
                    var requiredCFsByConstraint = _.filter(entityWithRequirements.entity.customFields, function(cf) {
                        return _.find(cfConstraint.requiredCustomFields, function(requiredCF) {
                            return cf.name.toLowerCase() === requiredCF.toLowerCase() && (!cf.value || cf.value.toString() === '');
                        });
                    });
                    return requiredCFsMemo.concat(requiredCFsByConstraint);
                }, []);

                return _.uniq(requiredCFs);
            }
        });

        return CFConstraintsRequirements;
    });
