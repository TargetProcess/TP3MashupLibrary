tau.mashups
    .addDependency('Underscore')
    .addDependency('tau/configurator')
    .addMashup(function(_, configurator) {

        'use strict';

        var templates = {
            'UserStory': 'As a <i>type of user</i>, I want <i>some goal</i> so that <i>some reason</i>',
            'Feature': '<table border="1"><caption>Features and Benefits matrix</caption>' +
                '<thead><tr><th scope="col">Features</th><th scope="col">Benefits</th></tr></thead>' +
                '<tbody><tr>' +
                '<td><em>A short phrase, giving a name and some implied context to the feature</em></td>' +
                '<td><em>A short description which describes the benefit to the user and the business. There may be multiple benefits per feature which are highlighted here</em></td>' +
                '</tr>' +
                '<tr><td><em>...</em></td><td><em>...</em></td></tr>' +
                '<tr><td>...</td><td>...</td></tr>' +
                '</tbody></table>',
            'Task': null,
            'Request': null,
            'Bug': '', //put an HTML-formatted template into quotes
            'TestCase': ''
        };

        var reg = configurator.getBusRegistry();

        var addBusListener = function(busName, eventName, listener) {

            reg.on('create', function(e, data) {

                var bus = data.bus;
                if (bus.name === busName) {
                    bus.once(eventName, listener);
                }
            });

            reg.on('destroy', function(e, data) {

                var bus = data.bus;
                if (bus.name === busName) {
                    bus.removeListener(eventName, listener);
                }
            });
        };

        addBusListener('description', 'afterRender', function(e, renderData) {

            var $el = renderData.element;
            var $description = $el.find('.ui-description__inner');

            if ($description.length && !$description.find('div').length) {

                var entityTypeName = renderData.view.config.context.entity.entityType.name.toLowerCase();
                var term = _.find(renderData.view.config.context.getTerms(), function(v) {
                    return (v.wordKey || v.name).toLowerCase() === entityTypeName;
                });
                var termValue = term ? term.value.toLowerCase() : null;

                var template = _.find(templates, function(v, k) {
                    return k.toLowerCase() === entityTypeName || k.toLowerCase() === termValue;
                });

                if (template) {
                    $description.attr('data-placeholder', '');
                    $description.append('<div>' + template + '</div>');
                }
            }
        });
    });
