tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tau/core/class')
    .addDependency('CFConstraints.graph')
    .addModule('CFConstraints.quick.add.cascade.tracker', function($, _, Class, CFConstraintsGraph) {
        var CFConstraintsQuickAddCascadeTracker = Class.extend({
            init: function(requirements) {
                this._requirements = requirements;
                this._cascadeCFConstraintsGraph = null;
                this._cascadeCFs = [];
                this._$quickAddElement = null;
            },
            buildCascadeCFs: function(rootCFs, cfDefinitions) {
                this._cascadeCFs = [];
                this._cascadeCFConstraintsGraph = new CFConstraintsGraph(
                    rootCFs, this._requirements.getConfig(), this._mapDefaultValues(cfDefinitions), _.bind(this._cascadeCFChangedHandler, this));

                var verticesWrapped = this._cascadeCFConstraintsGraph.getVerticesWrapped(),
                    processId,
                    entityTypeName,
                    cfVertices,
                    cfNameLowered,
                    isRootCF,
                    cascadeCF;

                for (processId in verticesWrapped.processes) {
                    //noinspection JSUnfilteredForInLoop
                    for (entityTypeName in verticesWrapped.processes[processId].entityTypes) {
                        //noinspection JSUnfilteredForInLoop
                        cfVertices = verticesWrapped.processes[processId].entityTypes[entityTypeName].cfs;
                        _.forEach(cfVertices, function(cfVertex) {
                            cfNameLowered = cfVertex.getId().toLowerCase();
                            //noinspection JSUnfilteredForInLoop
                            isRootCF = this._isRootCF(rootCFs, cfNameLowered, processId, entityTypeName);
                            if (!isRootCF) {
                                //noinspection JSUnfilteredForInLoop
                                cascadeCF = this._findCFDefinition(cfDefinitions, cfNameLowered, processId, entityTypeName);
                                this._cascadeCFs.push(cascadeCF);
                            }
                        }, this)
                    }
                }

                return this._cascadeCFs;
            },
            track: function($quickAddElement, positionShouldBeAdjustedCallback) {
                if (this._cascadeCFs.length === 0) {
                    return;
                }
                this._positionShouldBeAdjustedHandler = positionShouldBeAdjustedCallback;
                this._$quickAddElement = $quickAddElement;
                this._actualizeCascadeCFsElements();
                this._bindGraphToCFsChanges();
                this._cascadeCFs = [];
            },
            _mapDefaultValues: function(cfDefinitions) {
                var defaultValues = {};
                _.forEach(cfDefinitions, function(cf) {
                    defaultValues[cf.name] = cf.config.defaultValue;
                });
                return defaultValues;
            },
            _cascadeCFChangedHandler: function(processId, entityTypeName, cfVertex) {
                this._toggleCFElement(processId, entityTypeName, cfVertex.id, cfVertex.value, cfVertex.isValid);
            },
            _isRootCF: function(rootCFs, cfNameLowered, processId, entityTypeName) {
                return !!_.find(rootCFs, function(cf) {
                    return cf.name.toLowerCase() === cfNameLowered
                        && cf.processId == processId
                        && cf.entityTypeName.toLowerCase() === entityTypeName.toLowerCase();

                });
            },
            _findCFDefinition: function(cfDefinitions, cfNameLowered, processId, entityTypeName) {
                return _.find(cfDefinitions, function(cfDefinition) {
                    return cfDefinition.name.toLowerCase() === cfNameLowered
                        && cfDefinition.processId == processId
                        && cfDefinition.entityTypeName.toLowerCase() === entityTypeName.toLowerCase()
                });
            },
            _toggleCFElement: function(processId, entityTypeName, cfName, cfValue, shouldBeVisible) {
                var cfElement = this._findCFElement(processId, entityTypeName, cfName);

                cfElement
                    .val(this._buildCFElementValue(cfElement, cfValue, shouldBeVisible))
                    .toggleClass('placeholder', !shouldBeVisible)
                    .parent().toggle(!!shouldBeVisible);

                if (this._positionShouldBeAdjustedHandler) {
                    this._positionShouldBeAdjustedHandler();
                }
            },
            _findCFElement: function(processId, entityTypeName, cfName) {
                if (!this._$quickAddElement) {
                    return $();
                }

                return this._$quickAddElement
                    .find('.cf-wrap.cf-process_' + processId)
                    .find('.tau-required-field-editor')
                    .filter('[data-fieldname="' + cfName + '"]');
            },
            _buildCFElementValue: function(cfElement, cfValue, shouldBeVisible) {
                if (cfElement.length === 0 || !cfValue || !shouldBeVisible) {
                    return null;
                }
                return cfElement.data('fieldtype').toLowerCase() === 'multipleselectionlist'
                    ? cfValue.split(',')
                    : cfValue;
            },
            _actualizeCascadeCFsElements: function() {
                var verticesWrapped = this._cascadeCFConstraintsGraph.getVerticesWrapped();
                _.forEach(this._cascadeCFs, function(cf) {
                    if (!verticesWrapped.processes[cf.processId].entityTypes[cf.entityTypeName.toLowerCase()].cfs[cf.name].isValid()) {
                        this._toggleCFElement(cf.processId, cf.entityTypeName, cf.name);
                    }
                }, this);
            },
            _bindGraphToCFsChanges: function() {
                this._$quickAddElement.delegate('[data-iscf="true"]', 'change', _.bind(function(e) {
                    var $target = $(e.target),
                        cfName = $target.data('fieldname'),
                        entityTypeNameLowered = this._$quickAddElement.find('.quick-add__entity-items').find('button.tau-active').data('type').toLowerCase(),
                        processId = entityTypeNameLowered === 'project'
                            ? this._$quickAddElement.find('[data-fieldname="Process"]').find('option:selected').data('option').id
                            : this._$quickAddElement.find('[data-fieldname="project"]').find('option:selected').data('option').processId,
                        cfValue = this._getCFValueFromElement($target);
                    this._cascadeCFConstraintsGraph.setCFValue(processId, entityTypeNameLowered, cfName, cfValue);
                }, this));
            },
            _getCFValueFromElement: function(cfElement) {
                var $targetVal = cfElement.val();
                return _.isArray($targetVal) ? $targetVal.join(',') : $targetVal;
            }
        });

        return CFConstraintsQuickAddCascadeTracker;
    });