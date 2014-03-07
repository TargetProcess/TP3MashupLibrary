tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tau/service.container')
    .addDependency('tau/services/service.navigator')
    .addDependency('tau/services/service.applicationContext')
    .addDependency('tau/components/component.application.generic')
    .addDependency('tau/ui/extensions/application.generic/ui.extension.application.generic.placeholder')
    .addDependency('tau/cf.constraints/ui/extensions/application.generic/ui.extension.application.generic.cf.constraints')
    .addModule('tau/cf.constraints/application.cf.constraints', function($, _, ServiceContainer, ServiceNavigator,
                                                                         ServiceApplicationContext, ApplicationGeneric,
                                                                         ExtensionPlaceholder, ExtensionApplicationCfConstraints) {

        var routes = [
            {
                pattern: /cfConstraints/,
                host: {
                    name: 'master empty',
                    type: 'master.empty'
                },
                type: {
                    name: 'cf constraints',
                    type: 'cf.constraints',
                    namespace: 'tau/cf.constraints'
                }
            }
        ];

        var getProcessCustomFields = function(entityConfig, applicationContext) {
            return _.map(entityConfig.customFields, function(customField) {
                return _.find(applicationContext.processes[0].customFields, function(cf) {
                    return cf.entityKind.toLowerCase() == entityConfig.entity.entityType.name.toLowerCase()
                        && cf.name == customField.name;
                });
            })
        };

        return function(config) {
            var configurator = new ServiceContainer();
            var contextService = new ServiceApplicationContext(configurator);
            contextService.getApplicationContext({ids: [config.entity.id]}, {success: function(context) {
                config.customFields = getProcessCustomFields(config, context);
                var placeholder = config.placeholder;
                var applicationId = 'cf.constraints';

                configurator._id = _.uniqueId('cf.constraints');
                configurator.registerService('navigator', new ServiceNavigator(configurator, { parameterName: applicationId }));
                configurator.registerService('cf.constraints.config', _.extend(config, {applicationContext: context}));
                configurator.getExternal().setFakeWindow();

                if (!configurator.getHashService().getHash()) {
                    configurator.service('navigator').to('cfConstraints');
                }

                var applicationConfig = {
                    name: 'cf constraints',
                    options: {
                        applicationId: applicationId,
                        placeholder: placeholder,
                        integration: {
                            showInPopup: true,
                            cssClass: 'cf-constraints-popup',
                            keepAlive: false
                        }
                    },
                    routes: routes,
                    context: {
                        configurator: configurator
                    },
                    extensions: [
                        ExtensionPlaceholder,
                        ExtensionApplicationCfConstraints
                    ]
                };

                var application = ApplicationGeneric.create(applicationConfig);
                application.initialize(applicationConfig);
            }});
        };
    });
