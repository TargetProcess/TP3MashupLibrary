tau.mashups
    .addDependency('libs/react/react-ex')
    .addDependency('tp/userStory/view')
    .addDependency('TaskTestCaseTemplate/TemplatesManager')
    .addDependency('tau/configurator')
    .addDependency('TaskTestCaseTemplate/store')
    .addCSS('style.css')
    .addMashup(function(React, view, TemplatesManager, configurator, store) {

        configurator.getGlobalBus().once('configurator.ready', function(e, appConfigurator) {
            configurator = appConfigurator;
        });

        view.addTab('Template', function($el, config) {

            store.entity = config.entity;
            store.configurator = configurator;
            React.renderComponent(TemplatesManager({
                store: store
            }), $el[0]);
        });
    });
