tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tp3/mashups/componenteventlistener')
    .addDependency('tau/core/class')
    .addDependency('CFConstraints.quick.add.cf.processor')
    .addDependency('CFConstraints.quick.add.state.processor')
    .addDependency('CFConstraints.quick.add.cascade.tracker')
    .addModule('CFConstraints.quick.add', function($, _, ComponentEventListener, Class, CFProcessor, StateProcessor, CascadeTracker) {
        var CFConstraintsQuickAdd = Class.extend({
            init: function(dataProvider, requirements) {
                this.requirements = requirements;
                this.dataProvider = dataProvider;
                this.cfProcessor = new CFProcessor(this.requirements);
                this.stateProcessor = new StateProcessor(this.requirements);
                this.cascadeTracker = new CascadeTracker(this.requirements);
                this.quickAddComponents = [
                    {componentName: 'board cell quick add'},
                    {componentName: 'board axis quick add'},
                    {componentName: 'board plus quick add general'},
                    {componentName: 'board plus quick add cells'},
                    {componentName: 'board general quick add'},
                    {componentName: 'entity quick add', doNotWaitSettingsReady: true}
                ];
            },

            subscribe: function() {
                _.forEach(this.quickAddComponents, function(quickAddComponent) {
                    this._subscribeComponent(quickAddComponent);
                }, this);
            },

            _subscribeComponent: function(quickAddComponent) {
                var eventListener = new ComponentEventListener(quickAddComponent.componentName),
                    readyToModifyFlowMethodTail = quickAddComponent.doNotWaitSettingsReady ? '' : ' + settings.ready',
                    flow = {};

                flow['bus afterInit:last + before_dataBind' + readyToModifyFlowMethodTail] = _.bind(this._readyToModifyBindData, this);
                flow['bus afterRender'] = _.bind(this._readyToTrackCascadeCFs, this, eventListener);

                eventListener.flow(flow, this);
            },

            _readyToModifyBindData: function(evtArgs, afterInitEvtArg, dataBindEvtArg, settingsReadyEvtArg) {
                evtArgs['before_dataBind'].suspendMain();

                var configurator = afterInitEvtArg.config.context.configurator;
                this._getContextPromise(configurator).done(_.bind(function(context) {
                    var processes = context.processes,
                        processIds = _.map(processes, function(process) {
                            return process.id;
                        }),
                        entityTypes = _.keys(dataBindEvtArg.types);

                    $.when(
                            this.dataProvider.getEntityStatesForTypesAndProcessesPromise(configurator, entityTypes, processIds),
                            this.dataProvider.getCustomFieldsForTypesAndProcessesPromise(configurator, entityTypes, processIds)
                        ).done(_.bind(function(entityStates, customFields) {

                            var requiredCFsToModify = this._buildRequiredCFsToModify(
                                {afterInitEvtArg: afterInitEvtArg, dataBindEvtArg: dataBindEvtArg, settingsReadyEvtArg: settingsReadyEvtArg},
                                {entityTypes: entityTypes, processes: processes, customFields: customFields, entityStates: entityStates}
                            );

                            this._modifyBindData(dataBindEvtArg, requiredCFsToModify);

                            evtArgs['before_dataBind'].resumeMain();
                        }, this));
                }, this));
            },

            _readyToTrackCascadeCFs: function(eventListener, afterRenderEvtArg) {
                this.cascadeTracker.track(afterRenderEvtArg.data.element, function() {
                    eventListener.fire('adjustPosition');
                });
            },

            _getContextPromise: function(configurator) {
                var getContextDeferred = $.Deferred();
                configurator.getAppStateStore().get({fields: ['acid'], callback: _.bind(function(acidData) {
                    configurator.getApplicationContextService().getApplicationContext({acid: acidData.acid}, {
                        success: _.bind(function(context) {
                            getContextDeferred.resolve(context);
                        }),
                        failure: _.bind(function(error) {
                            getContextDeferred.reject(error);
                        })
                    })
                }, this)});
                return getContextDeferred.promise();
            },

            _buildRequiredCFsToModify: function(evtArgs, data) {
                var stateName = this.stateProcessor.getChangedValue(evtArgs.afterInitEvtArg, evtArgs.settingsReadyEvtArg),
                    cf = this.cfProcessor.getChangedValue(evtArgs.afterInitEvtArg, evtArgs.settingsReadyEvtArg),
                    calculatedRequiredCFs = [];

                _.forEach(data.processes, function(process) {
                    _.forEach(data.entityTypes, function(entityType) {
                        var filteredCFs = _.filter(data.customFields, function(cf) {
                            return cf.processId == process.id && cf.entityTypeName.toLowerCase() == entityType.toLowerCase();
                        });
                        calculatedRequiredCFs = calculatedRequiredCFs.concat(this.stateProcessor.getCFs(stateName, data.entityStates, process, entityType, evtArgs.dataBindEvtArg, filteredCFs));
                        calculatedRequiredCFs = calculatedRequiredCFs.concat(this.cfProcessor.getCFs(cf, data.entityStates, process, entityType, evtArgs.dataBindEvtArg, filteredCFs));
                    }, this)
                }, this);

                var requiredCFs = _.filter(data.customFields, function(cf) {
                        return cf.required;
                    }),
                    cascadeCFs = this.cascadeTracker.buildCascadeCFs(calculatedRequiredCFs.concat(requiredCFs), data.customFields);

                return _.compact(calculatedRequiredCFs.concat(cascadeCFs));
            },

            _modifyBindData: function(dataBindEvtArg, requiredCFsToModify) {
                _.forEach(requiredCFsToModify, function(cf) {
                    dataBindEvtArg.types[cf.entityTypeName].template.items.push(this._createCFDataBindConfig(cf));
                }, this);
            },

            _createCFDataBindConfig: function(cf) {
                return {
                    caption: cf.name,
                    config: {
                        calculationModel: '',
                        calculationModelContainsCollections: null,
                        defaultValue: '',
                        resourceType: 'CustomFieldConfig',
                        units: ''
                    },
                    fieldType: cf.fieldType,
                    id: 'CustomFields',
                    options: cf.value ? {value: cf.value} : {},
                    processId: cf.processId,
                    required: true,
                    type: 'CustomField'
                };
            }
        });

        return CFConstraintsQuickAdd;
    });
