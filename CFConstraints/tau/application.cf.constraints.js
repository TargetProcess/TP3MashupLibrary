define([
    'jQuery'
    , 'Underscore'
    , 'tau/service.container'
    , 'tau/services/service.navigator'
    , 'tau/services/service.applicationContext'
    , 'tau/components/component.application.generic'
    , 'tau/ui/extensions/application.generic/ui.extension.application.generic.placeholder'
    , 'tau/cf.constraints/ui/extensions/application.generic/ui.extension.application.generic.popupCloseDisabler'
], function($, _, ServiceContainer, ServiceNavigator, ServiceApplicationContext, ApplicationGeneric, ExtensionPlaceholder, ExtensionPopupCloseDisabler) {

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
                        cssClass: 'cf-constraints-popup'
                    }
                },
                routes: routes,
                context: {
                    configurator: configurator
                },
                extensions: [
                    ExtensionPlaceholder,
                    ExtensionPopupCloseDisabler
                ]
            };

            var application = ApplicationGeneric.create(applicationConfig);
            application.initialize(applicationConfig);
        }});
    };
});
