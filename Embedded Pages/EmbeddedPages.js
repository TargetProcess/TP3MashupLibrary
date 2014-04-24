tau
    .mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tau/core/class')
    .addDependency('tp/general/view')
    .addDependency('tau/configurator')
    .addDependency('EmbeddedPages.config')
    .addCSS('EmbeddedPages.css')
    .addMashup(function($, _, Class, generalView, configurator, config) {

        'use strict';

        configurator.getGlobalBus().once('configurator.ready', function(e, appConfigurator) {
            configurator = appConfigurator;
        });

        var getData = function(entityName, fields) {
            var store = configurator.getStore();
            return store.freeze(true).then(function (promise) {
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
                    throw new Error('Embedded Pages mashup: Option "customFieldName" is required.');
                }

                this.config.entityTypeName = String(this.config.entityTypeName).toLowerCase();
                this.customField = null;
                this.template = this.config.frameTemplate || this.templateDefault;
                this.templateEmpty = this.templateEmptyDefault;
            },

            addToView: function(view) {

                view.addTab(this.getLabelText(), this.onContentReady.bind(this), this.onHeaderReady.bind(this), {
                    getViewIsSuitablePromiseCallback: this.preAdd.bind(this)
                });
            },

            getLabelText: function() {
                return this.config.customFieldName;
            },

            onHeaderReady: function($el) {

                return $
                    .when(this.checkByCustomField())
                    .then(function(hasField) {
                        if (!hasField) {
                            this.removeHeader($el);
                        }
                    }.bind(this));
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
                    }
                };

                return $.when(this.checkByType());
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
                    .when(this.getCustomFieldByProcess())
                    .then(function cacheFieldAndStartListenChanges(field) {

                        this.customField = field;
                        this.subscribeOnChanges(field);
                        return field;
                    }.bind(this));
            },

            getCustomFieldByProcess: function() {

                return $
                    .when(this.getProcess())
                    .then(function(process) {

                        if (this.config.processName && process.name !== this.config.processName) {
                            return null;
                        }
                        return this.findFieldInProcess(process);
                    }.bind(this));
            },

            getProcess: function() {

                return $
                    .when((function() {
                        if (this.entity.entityType.name === 'project') {
                            return this.getProjectProcess();
                        } else {
                            return this.getEntityProcess();
                        }
                    }.bind(this))())
                    .then(function(process) {
                        if (!process) {
                            return this.getDefaultProcess();
                        } else {
                            return process;
                        }
                    }.bind(this));
            },

            getProjectProcess: function() {

                var fields = [
                    'customFields', {
                        process: [
                            'name', {
                                customFields: [
                                    'name',
                                    'value',
                                    'fieldType', {
                                        entityType: ['name']
                                    }
                                ]
                            }
                        ]
                    }
                ];

                return getData(this.entity.entityType.name, {
                    id: this.entity.id,
                    fields: fields
                })
                    .then(function (res) {
                        return res.process;
                    });
            },

            getEntityProcess: function() {

                var fields = [
                    'customFields', {
                        project: [{
                            process: [
                                'name', {
                                    customFields: [
                                        'name',
                                        'value',
                                        'fieldType', {
                                            entityType: ['name']
                                        }
                                    ]
                                }
                            ]
                        }]
                    }
                ];

                return getData(this.entity.entityType.name, {
                        id: this.entity.id,
                        fields: fields
                    })
                    .then(function(res) {
                        return res.project ? res.project.process : null;
                    });
            },

            getDefaultProcess: function() {

                var fields = [
                    'name', {
                        customFields: [
                            'name',
                            'value',
                            'fieldType', {
                                entityType: ['name']
                            }
                        ]
                    }
                ];

                return getData('process', {
                        fields: fields,
                        $query: {
                            isDefault: 1
                        }
                    })
                    .then(function(res) {
                        return res[0];
                    });
            },

            findFieldInProcess: function(process) {

                return _.find(process.customFields, function(field) {

                    return field.name === this.config.customFieldName &&
                        this.checkCustomFieldType(field.fieldType) &&
                        field.entityType.name.toLowerCase() === this.config.entityTypeName;
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
                switch (field.fieldType.toLowerCase()) {

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

            removeHeader: function($labelEl) {

                var $header = $labelEl.parents('.i-role-tabheader:first');
                if ($header.hasClass('selected')) {
                    $header.prevAll('.i-role-tabheader:first').click();
                }

                var label = $header.data('label');
                this.disableHeaderElement($header);

                var $more = $header.parent().find('.i-role-moretrigger');
                var $moreBubble = $more.data('ui-tauBubble') ?
                    $more.tauBubble('option', 'content') :
                    null;
                if ($moreBubble) {
                    var $moreHeader = $moreBubble.find('.i-role-tabheader[data-label="' + label + '"]');
                    this.disableHeaderElement($moreHeader);
                }
            },

            disableHeaderElement: function($el) {

                $el.data('label', '__disabled');
                $el.attr('data-label', '__disabled');
                $el.addClass('disabled');
            },

            subscribeOnChanges: function(customField) {

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
