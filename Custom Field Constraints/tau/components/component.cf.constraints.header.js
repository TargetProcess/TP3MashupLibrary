tau.mashups
    .addDependency('tau/components/component.creator')
    .addDependency('tau/cf.constraints/models/model.cf.constraints')
    .addDependency('tau/cf.constraints/ui/templates/ui.template.cf.constraints.header')
    .addModule('tau/cf.constraints/components/component.cf.constraints.header', function(ComponentCreator, Model, Template) {
        return {
            create: function(config) {

                var creatorConfig = {
                    extensions: [
                        Model
                    ],
                    template: Template
                };

                return ComponentCreator.create(creatorConfig, config);
            }
        };
    });
