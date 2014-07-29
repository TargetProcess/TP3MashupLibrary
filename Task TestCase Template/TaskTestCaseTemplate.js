tau.mashups
    .addDependency('libs/react/react-ex')
    .addDependency('tp/userStory/view')
    .addDependency('TaskTestCaseTemplate/TemplatesManager')
    .addDependency('TaskTestCaseTemplate/store')
    .addCSS('style.css')
    .addMashup(function(React, view, TemplatesManager, store) {

        view.addTab('Template', function($el, config) {

            store.entity = config.entity;
            React.renderComponent(TemplatesManager({
                store: store
            }), $el[0]);
        });
    });
