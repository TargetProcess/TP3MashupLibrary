tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tp/general/view')
    .addDependency('tp3/mashups/storage')
    .addDependency('URLCustomFieldTab.config')
    .addCSS('URLCustomFieldTab.css')
    .addMashup(function ($, _, generalView, Storage, urlCustomFieldTabConfig) {
        var URLCustomFieldTab = function () {
            _.forEach(urlCustomFieldTabConfig.tabs, _.bind(this._addTab, this));
        };

        URLCustomFieldTab.prototype = {
            URL_CF_TYPES: {
                URL: 'url',
                TEMPLATED_URL: 'templatedurl'
            },
            REQUEST_FIELDS_FOR_ENTITY: ['customFields', {
                project: [{
                    process: [{
                        customFields: ['name', 'value', {
                            entityType: ['name']}]
                    }]
                }]
            }],
            REQUEST_FIELDS_FOR_DEFAULT_PROCESS: [{
                        customFields: ['name', 'value', {
                            entityType: ['name']
                         }]
            }],
            $FRAME_TEMPLATE: '<iframe class="url-custom-field-tab-frame" src="${url}"></iframe>',

            _addTab: function (tabConfig) {
                generalView.addTab(tabConfig.customFieldName,
                    _.bind(this._tabContentIsRenderedHandler, this, tabConfig),
                    $.noop,
                    {
                        viewIsSuitableCallback: _.bind(this._isViewSuitableForTab, this, tabConfig)
                    });
            },
            _isViewSuitableForTab: function(tabConfig, viewContext){
                return tabConfig.entityTypeName && tabConfig.entityTypeName.toLowerCase() === viewContext.entity.entityType.name.toLowerCase();
            },
            _tabContentIsRenderedHandler: function (tabConfig, contentElement, context) {
                this._getContextEntityPromise(context).done(_.bind(function(entity){
                        this._getCFDefinitionsPromise(entity).done(
                            _.bind(this._buildTab, this, tabConfig, contentElement, entity)
                        )
                    }, this)
                );
            },
            _getContextEntityPromise: function(context){
                var contextEntityDeferred = $.Deferred();
                (new Storage())
                    .getEntity()
                        .ofType(context.entity.type)
                        .withId(context.entity.id)
                        .withFieldSetRestrictedTo(this.REQUEST_FIELDS_FOR_ENTITY)
                        .withCallOnDone(contextEntityDeferred.resolve)
                    .execute();
                return contextEntityDeferred.promise();
            },
            _getCFDefinitionsPromise: function(entity){
                var cfDefinitionsDeferred = $.Deferred();
                if (entity.project){
                    cfDefinitionsDeferred.resolve(entity.project.process.customFields);
                } else {
                    (new Storage())
                        .getEntities()
                            .ofType('process')
                            .filteredBy({isDefault: 'true'})
                            .withFieldSetRestrictedTo(this.REQUEST_FIELDS_FOR_DEFAULT_PROCESS)
                            .withCallOnDone(function(process){ cfDefinitionsDeferred.resolve(process.customFields);})
                        .execute();
                }
                return cfDefinitionsDeferred.promise();
            },
            _buildTab: function (tabConfig, contentElement, entity, cfDefinitions) {
                var tabCustomField = this._getRequiredCustomFieldByName(tabConfig, entity.customFields);
                if (!tabCustomField || !tabCustomField.value) {
                    return;
                }
                var entityCFDefinitions = this._getEntityCFDefinitions(tabConfig, cfDefinitions);
                var tabFrameUrl = this._getUrl(tabCustomField, entityCFDefinitions);
                if (!tabFrameUrl) {
                    return;
                }
                this._appendFrameToTabContent($(contentElement), tabFrameUrl);
            },
            _getRequiredCustomFieldByName: function(tabConfig, customFields){
                return _.find(customFields, _.bind(function (customField) {
                    return customField.name.toLowerCase() === tabConfig.customFieldName.toLowerCase()
                        && _.contains(_.values(this.URL_CF_TYPES), customField.type.toLowerCase());
                }, this));
            },
            _getEntityCFDefinitions: function(tabConfig, CFDefinitions){
                return _.filter(CFDefinitions, function(customFieldDefinition){
                    return customFieldDefinition.entityType.name.toLowerCase() === tabConfig.entityTypeName.toLowerCase();
                });
            },
            _getUrl: function(tabCustomField, entityCFDefinitions){
                var tabFrameUrl;
                switch (tabCustomField.type.toLowerCase()) {
                    case this.URL_CF_TYPES.URL:
                        tabFrameUrl = tabCustomField.value.url;
                        break;
                    case this.URL_CF_TYPES.TEMPLATED_URL:
                        var customFieldDefinition = _.find(entityCFDefinitions, function (entityCustomFieldDefinition) {
                            return entityCustomFieldDefinition.name.toLowerCase() === tabCustomField.name.toLowerCase()
                        });
                        if (!customFieldDefinition){
                            break;
                        }
                        tabFrameUrl = customFieldDefinition.value.replace(/\{0\}/, tabCustomField.value);
                        break;
                }

                return tabFrameUrl;
            },
            _appendFrameToTabContent: function($contentElement, tabFrameUrl){
                $.tmpl(this.$FRAME_TEMPLATE, {url: tabFrameUrl}).appendTo($contentElement);
            }
        };

        new URLCustomFieldTab();

    });