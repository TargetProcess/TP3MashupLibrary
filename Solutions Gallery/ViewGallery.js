/*globals tau*/
/*eslint new-cap: [2, {"capIsNew": false}] */

tau
    .mashups
    .addDependency('react')
    .addDependency('Underscore')
    .addDependency('jQuery')
    .addDependency('tau/configurator')
    .addDependency('tau/core/event')
    .addDependency('tp3/mashups/topmenu')
    .addDependency('ViewGallery/ExternalTrigger')
    .addDependency('ViewGallery/externalData')
    .addDependency('ViewGallery/ViewGallery.config')
    .addDependency('ViewGallery/ViewGallery.settings')
    .addMashup(function(React, _, $,
        configurator, EventEmitter, topMenuApi,
        ExternalTrigger, externalData, config, settings,
        mashupSettings) {

        'use strict';

        if (settings.loadCSS) {
            tau.mashups
                .addCSS('externaltrigger.css')
                .addCSS('icons.css');
        }

        var makeCb = function(cb) {
            return function() {
                cb.apply(null, _.rest(_.toArray(arguments)));
            };
        };

        var reg = configurator.getBusRegistry();

        var addBusListener = function(busName, eventName, listener) {

            reg.on('create', makeCb(function(data) {

                var bus = data.bus;
                if (bus.name === busName) {
                    bus.on(eventName, listener);
                }
            }));

            reg.on('destroy', makeCb(function(data) {

                var bus = data.bus;
                if (bus.name === busName) {
                    bus.removeListener(eventName, listener);
                }
            }));
        };

        var loadDeps = function() {

            if (settings.loadCSS) {
                tau.mashups
                    .addCSS('index.css');
            }

            var bundles = [];
            if (settings.loadBundles) {
                bundles = [mashupSettings.mashupPath + '/bundles/app.js'];
            }

            var def = $.Deferred();

            require(bundles, function() {
                require(['ViewGallery/App', 'ViewGallery/appStore'], function() {
                    def.resolve(_.toArray(arguments));
                });
            });

            return def;
        };

        var addToToolbar = function($el, store) {

            var addButton = function(permissions) {
                if (permissions.add) {
                    var $button = $(
                            '<button class="tau-btn vg-button-add">Add to Solutions Gallery</button>'
                        )
                        .on('click', store.addView.bind(store));

                    $el.find('[role=actions-button]').before($button);
                }
            };

            store
                .getPermissions()
                .then(addButton);

        };

        var $toolbarEl;

        var busNames = ['board.toolbar', 'customReport.toolbar', 'dashboard.toolbar']

        busNames.forEach(function(busName) {
            addBusListener(busName, 'afterRender', makeCb(function(renderData) {
                if (!$toolbarEl) {
                    $toolbarEl = renderData.element;
                }
            }));
        });

        var initApp = function() {

            return $
                .when(loadDeps())
                .then(function(res) {
                    var App = res[0];
                    var Store = res[1];

                    var holder = document.querySelector('#tp3placeholder');
                    if (holder) {
                        holder = holder.appendChild(document.createElement('div'));
                    }

                    var store = new Store(config, settings);
                    var appFactory = React.createFactory(App);
                    React.render(appFactory({
                        store: store
                    }), holder);

                    busNames.forEach(function(busName) {
                        addBusListener(busName, 'afterRender', makeCb(function(renderData) {
                            var $el = renderData.element;
                            addToToolbar($el, store);
                        }));
                    });

                    if ($toolbarEl) {
                        addToToolbar($toolbarEl, store);
                    }

                    return store;
                });
        };

        var appStore;

        var activateApp = function() {
            if (!appStore) {
                return $
                    .when(initApp())
                    .then(function(store) {
                        appStore = store;
                        appStore.activateFromMenu();
                    });

            } else {
                return appStore.activateFromMenu();
            }
        };

        if (config.login && config.password) {
            $
                .when(initApp())
                .then(function(store) {
                    appStore = store;
                });
        }

        var initTrigger = function() {

            var trigger;
            var store = new EventEmitter();
            store.isActive = true;

            store.activate = function() {

                if (!this.isActive) {
                    return null;
                }

                this.isActive = false;
                setTimeout(function() {
                    this.fire('change');
                }.bind(this), 1000);

                return $
                    .when(activateApp())
                    .then(function() {
                        this.isActive = true;
                        this.fire('change');
                    }.bind(this));
            };

            var externalTriggerFactory = React.createFactory(ExternalTrigger);
            trigger = externalTriggerFactory({
                store: store
            }, config.triggerLabel);

            return trigger;
        };

        configurator.getGlobalBus().once('configurator.ready', makeCb(function(configurator) {

            externalData.configurator = configurator;

            if (configurator.getViewsMenuActionsIntegrationService) {

                configurator.getViewsMenuActionsIntegrationService().addReactMenuItem(initTrigger());

            } else {

                topMenuApi.addItem({
                    title: 'Browse Views Gallery'
                }).$element.on('click', function() {
                    activateApp();
                });
            }
        }));
    });
