tau.mashups
    .addDependency('tau/components/component.page.base')
    .addDependency('tau/cf.constraints/ui/extensions/ui.extension.cf.constraints')
    .addDependency('tau/cf.constraints/views/view.cf.constraints')
    .addModule('tau/cf.constraints/components/component.cf.constraints', function(ComponentPageBase, ExtensionCfConstraints, ViewType) {
        return {
            create: function(componentContext) {

                var componentConfig = {
                    name: "cf constraints page component",
                    extensions: [ExtensionCfConstraints],
                    ViewType: ViewType
                };

                return ComponentPageBase.create(componentConfig, componentContext);
            }
        };
    });
