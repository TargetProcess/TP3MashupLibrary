define([
    'tau/components/component.creator'
    , 'tau/cf.constraints/models/model.cf.constraints.save'
    , 'tau/cf.constraints/ui/extensions/extension.cf.constraints.save'
    , 'tau/cf.constraints/ui/templates/ui.template.cf.constraints.save'
], function(ComponentCreator, Model, SaveExtension, Template) {
    return {
        create: function(config) {

            var creatorConfig = {
                extensions: [
                    Model,
                    SaveExtension
                ],
                template: Template
            };

            return ComponentCreator.create(creatorConfig, config);

        }
    };
});