var listAccessDenied = {
    roles: [],
    ids: []
};
tau.mashups
    .addDependency('Underscore')
    .addDependency('jQuery')
    .addDependency('tau/core/bus.reg')
    .addDependency('tau/configurator')
    .addMashup(function(_, $, reg, configurator) {

        'use strict';

        var addBusListener = function(busName, eventName, listener) {

            reg.on('create', function(e, data) {

                var bus = data.bus;
                if (bus.name === busName) {
                    bus.on(eventName, listener);
                }
            });

            reg.on('destroy', function(e, data) {

                var bus = data.bus;
                if (bus.name === busName) {
                    bus.removeListener(eventName, listener);
                }
            });
        };

        var hideCreateViewButton = function() {

            configurator.getGlobalBus().on('configurator.ready', function(e, appConfigurator) {

                if (appConfigurator.getViewsMenuActionsIntegrationService().hideCreateTrigger) {

                    appConfigurator.getViewsMenuActionsIntegrationService().hideCreateTrigger();

                }

            });

        };

        var hideTemplatesTab = function() {

            addBusListener('board.editor.container', 'afterRender', function(e, data) {
                data.element.find('.i-role-tabheader[data-label=templates]').hide();
            });
        };

        var hideActionButtons = function() {

            addBusListener('actions-bubble', 'afterRender', function(e, data) {
                var $element = data.element;
                $element.find('.tau-board-actions-item:has(.clone-board-button)').hide();
                $element.find('.tau-board-actions-item:has(.save-template-button)').hide();
            });
        };

        var loggedUser = window.loggedUser || {};
        var isAccessDenied = _.contains(listAccessDenied.roles, loggedUser.role) ||
            _.contains(listAccessDenied.ids, loggedUser.id);

        if (isAccessDenied) {
            hideCreateViewButton();
            hideTemplatesTab();
            hideActionButtons();
        }
    });
