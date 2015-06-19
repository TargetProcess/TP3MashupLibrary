tau.mashups
    .addDependency('Underscore')
    .addDependency('CFConstraints.data.provider')
    .addDependency('CFConstraints.requirements')
    .addDependency('CFConstraints.config')
    .addDependency('CFConstraints.state.interrupter.store')
    .addDependency('CFConstraints.cf.interrupter.store')
    .addDependency('CFConstraints.state.interrupter.slice')
    .addDependency('CFConstraints.cf.interrupter.slice')
    .addDependency('CFConstraints.quick.add')
    .addDependency('tau/cf.constraints/application.cf.constraints')
    .addCSS('CFConstraints.css')
    .addMashup(function(_, DataProvider, Requirements, config, StateInterrupterStore, CFInterrupterStore,
        StateInterrupterSlice, CFInterrupterSlice, QuickAddAdapter, ApplicationCFConstraints, mashupConfig) {
        var CFConstraints = function() {
            this.entityStateName = 'entityState';
            this.init();
        };

        CFConstraints.prototype = {
            init: function() {
                var dataProvider = new DataProvider(),
                    requirements = new Requirements(config),
                    subscribers = [
                        new StateInterrupterStore(dataProvider, requirements, this._showPopUp),
                        new CFInterrupterStore(dataProvider, requirements, this._showPopUp),
                        new StateInterrupterSlice(dataProvider, requirements, this._showPopUp),
                        new CFInterrupterSlice(dataProvider, requirements, this._showPopUp),
                        new QuickAddAdapter(dataProvider, requirements)
                    ];

                _.invoke(subscribers, 'subscribe');
            },

            _showPopUp: function(entityToRequire, entityDeferred) {

                new ApplicationCFConstraints({
                    placeholder: '#' + mashupConfig.placeholderId,
                    customFields: entityToRequire.customFields,
                    entity: entityToRequire.entity,
                    entityDeferred: entityDeferred
                });
            }
        };

        return new CFConstraints();
    });
