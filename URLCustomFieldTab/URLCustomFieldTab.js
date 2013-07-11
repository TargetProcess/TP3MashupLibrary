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
            URL_CUSTOM_FIELD_TYPES: {
                URL: 'url',
                TEMPLATED_URL: 'templatedurl'
            },
            FIELDS_FOR_REQUEST: ['customFields', {
                project: [{
                    process: [{
                        customFields: ['name', 'value', {
                            entityType: ['name']}]
                    }]
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
                (new Storage())
                    .getEntity()
                        .ofType(context.entity.type)
                        .withId(context.entity.id)
                        .withFieldSetRestrictedTo(this.FIELDS_FOR_REQUEST)
                        .withCallOnDone(_.bind(this._processTab, this, tabConfig, contentElement))
                    .execute();
            },
            _processTab: function (tabConfig, contentElement, entity) {
                var tabCustomField = this._getRequiredCustomFieldByName(tabConfig, entity.customFields);
                if (!tabCustomField || !tabCustomField.value) {
                    return;
                }
                var entityCustomFieldDefinitions = this._getEntityCustomFieldDefinitions(tabConfig, entity.project.process.customFields);
                var tabFrameUrl = this._getUrl(tabCustomField, entityCustomFieldDefinitions);
                if (!tabFrameUrl) {
                    return;
                }
                this._appendFrameToTabContent($(contentElement), tabFrameUrl);
            },
            _getRequiredCustomFieldByName: function(tabConfig, customFields){
                return _.find(customFields, _.bind(function (customField) {
                    return customField.name.toLowerCase() === tabConfig.customFieldName.toLowerCase()
                        && _.contains(_.values(this.URL_CUSTOM_FIELD_TYPES), customField.type.toLowerCase());
                }, this));
            },
            _getEntityCustomFieldDefinitions: function(tabConfig, customFieldDefinitions){
                return _.filter(customFieldDefinitions, function(customFieldDefinition){
                    return customFieldDefinition.entityType.name.toLowerCase() === tabConfig.entityTypeName.toLowerCase();
                });
            },
            _getUrl: function(tabCustomField, entityCustomFieldDefinitions){
                var tabFrameUrl;
                switch (tabCustomField.type.toLowerCase()) {
                    case this.URL_CUSTOM_FIELD_TYPES.URL:
                        tabFrameUrl = tabCustomField.value.url;
                        break;
                    case this.URL_CUSTOM_FIELD_TYPES.TEMPLATED_URL:
                        var customFieldDefinition = _.find(entityCustomFieldDefinitions, function (entityCustomFieldDefinition) {
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