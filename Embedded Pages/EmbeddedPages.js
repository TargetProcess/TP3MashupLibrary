tau
    .mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tau/core/class')
    .addDependency('tp/general/view')
    .addDependency('tau/configurator')
    .addDependency('tau/models/page.entity/entity.context.factory')
    .addDependency('EmbeddedPages.config')
    .addCSS('EmbeddedPages.css')
    .addMashup(function($, _, Class, generalView, configurator, ContextFactory, config) {

        'use strict';

        configurator.getGlobalBus().once('configurator.ready', function(e, appConfigurator) {
            configurator = appConfigurator;
        });

        var getData = function(entityName, fields) {
            var store = configurator.getStore();
            return store.freeze(true).then(function(promise) {
                var result = store.getDef(entityName, fields);
                promise.unfreeze();
                return result;
            });
        };

        var validTypes = ['bug', 'build', 'feature', 'impediment', 'iteration', 'project', 'release',
            'request', 'task', 'testcase', 'testplan', 'testplanrun', 'time', 'userstory'
        ];

        var Tab = Class.extend({

            validTypes: validTypes,

            templateDefault: [
                '<iframe class="embedded-pages-tab-frame" src="${url}" frameborder="0"></iframe>'
            ].join(''),

            templateEmptyDefault: ['<span class="embedded-pages-tab-empty">',
                'Nothing to display in the Tab: the value of the \'${name}\' Custom Field is empty',
                '</span>'
            ].join(''),

            init: function(config) {

                this.config = config;

                if (!this.config.customFieldName) {
                    this._error('\'Embedded Pages\' mashup misconfiguration: \'customFieldName\' is required');
                    return;
                }

                this.config.entityTypeName = String(this.config.entityTypeName).toLowerCase();
                this.customField = null;
                this.template = this.config.frameTemplate || this.templateDefault;
                this.templateEmpty = this.templateEmptyDefault;
            },

            addToView: function(view) {

                view.addTab(this.getLabelText(), this.onContentReady.bind(this), $.noop, {
                    getViewIsSuitablePromiseCallback: this.preAdd.bind(this)
                });
            },

            getLabelText: function() {
                return this.config.customFieldName;
            },

            onContentReady: function($el) {

                this.$el = $el;
                return $
                    .when(this.checkByCustomField())
                    .then(function(hasField) {
                        if (!hasField) {
                            return $.Deferred().reject();
                        }
                    })
                    .then(function() {
                        return $.when(this.getCustomField(), this.getCustomFieldValue());
                    }.bind(this))
                    .then(function(field, value) {
                        this.$el.html(this.renderContent(field, value));
                    }.bind(this));
            },

            preAdd: function(context) {

                this.customField = null;

                if (!context.entity) {
                    return $.when(false);
                }

                this.entity = {
                    id: context.entity.id,
                    entityType: {
                        name: (context.entity.type ? context.entity.type : context.entity.entityType.name).toLowerCase()
                    },
                    projectId: context.entity.projectId,
                    teamId: context.entity.teamId
                };

                if (!this.checkByType()){
                    return $.when(false);
                }

                return $.when(this.checkByCustomField());
            },

            checkByType: function() {
                return _.contains(this.validTypes, this.entity.entityType.name) &&
                    this.entity.entityType.name === this.config.entityTypeName;
            },

            checkByCustomField: function() {

                return $
                    .when(this.getCustomField())
                    .then(function(customField) {
                        return Boolean(customField);
                    });
            },

            getCustomField: function() {

                if (this.customField) {
                    return this.customField;
                }

                return $
                    .when(this.getCustomFieldByContext())
                    .then(function cacheFieldAndStartListenChanges(field) {
                        try {
                            this.customField = field;
                            this.subscribeOnChanges(field);
                        } catch (e) {
                            this._error(e);
                        }
                        return field;
                    }.bind(this));
            },

            getCustomFieldByContext: function() {
                var fieldDeferred = $.Deferred();

                try{
                    ContextFactory.create(this.entity, configurator).done(function(appContext) {
                        var field = null;
                        try {
                            if (appContext.getProcess().name === this.config.processName){
                                field = this.findField(appContext.getCustomFields());
                            }
                            fieldDeferred.resolve(field);
                        }
                        catch (e){
                            fieldDeferred.reject(e);
                            this._error(e);
                        }
                    }.bind(this));
                } catch (e){
                    fieldDeferred.reject(e);
                    this._error(e);
                }

                return fieldDeferred.promise();
            },

            findField: function(customFields) {
                return _.find(customFields, function(field) {
                    return field.name === this.config.customFieldName &&
                        this.checkCustomFieldType(field.type) &&
                        field.entityKind.toLowerCase() === this.config.entityTypeName;
                }.bind(this));
            },

            getCustomFieldValue: function() {

                return $
                    .when(this.getCustomFieldInEntity())
                    .then(function(field) {
                        return field ? field.value : null;
                    });
            },

            getCustomFieldInEntity: function() {

                var fields = [
                    'customFields'
                ];

                return getData(this.entity.entityType.name, {
                    id: this.entity.id,
                    fields: fields
                })
                    .then(function(entity) {
                        return this.findFieldInEntity(entity);
                    }.bind(this));
            },

            findFieldInEntity: function(entity) {

                return _.find(entity.customFields || [], function(field) {
                    return field.name === this.config.customFieldName && this.checkCustomFieldType(field.type);
                }.bind(this));
            },

            checkCustomFieldType: function(fieldType) {
                return _.contains(['url', 'templatedurl'], fieldType.toLowerCase());
            },

            renderContent: function(field, value) {

                var url = null;
                switch (field.type.toLowerCase()) {

                    case 'url':
                        url = (value && value.url) ? value.url : null;
                        break;
                    case 'templatedurl':
                        url = field.value ? String(field.value).replace(/\{0\}/, value) : null;
                        break;
                }

                var data = {
                    url: url,
                    name: field.name
                };
                if (url) {
                    return $.tmpl(this.template, data);
                } else {
                    return $.tmpl(this.templateEmpty, data);
                }
            },

            subscribeOnChanges: function(customField) {
                if (!customField){
                    return;
                }
                configurator.getStore().unbind(this);
                configurator.getStore().on({
                    eventName: 'afterSave',
                    hasChanges: ['customFields'],
                    type: this.entity.entityType.name,
                    filter: {
                        id: this.entity.id
                    },
                    listener: this
                }, function(e) {

                    var field = this.findFieldInEntity(e.data.changes);
                    if (field && this.$el) {
                        this.$el.html(this.renderContent(customField, field.value));
                    }
                }.bind(this));
            },

            _error: function(e) {
                console && console.error && console.error(e);
            }
        });

        var embedPages = function() {

            config.tabs.forEach(function(config) {

                if (!config.entityTypeName) {
                    validTypes.forEach(function(entityTypeName) {

                        var entityTab = new Tab(_.defaults({
                            entityTypeName: entityTypeName
                        }, config));
                        entityTab.addToView(generalView);
                    });
                } else {

                    var tab = new Tab(config);
                    tab.addToView(generalView);
                }
            });
        };

        return embedPages();
    });
