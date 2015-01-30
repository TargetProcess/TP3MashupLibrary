/* globals tau, loggedUser */
tau.mashups
    .addDependency('Underscore')
    .addDependency("jQuery")
    .addDependency('tau/configurator')
    .addDependency('QuickFilters.config')
    .addCSS('QuickFilters.css')
    .addMashup(function(_, $, configurator, config) {

        'use strict';

        var predefinedFilters = config.predefinedFilters.map(function(v) {
            v.isReadonly = true;
            return v;
        });

        var getNewID = function() {
            return (new Date()).getTime();
        };

        var getItems = function() {

            return $.ajax({
                type: 'GET',
                url: configurator.getApplicationPath() +
                    '/storage/v1/QuickFilters/?where=(scope == "Private")&select={UserData,key}',
                contentType: 'application/json; charset=utf8',
                dataType: 'json'
            }).then(function(data) {

                var storageData = _.findWhere(data.items, {
                    key: String(loggedUser.id)
                });
                var items = storageData && storageData.userData && storageData.userData.filters ?
                    JSON.parse(storageData.userData.filters) : [];
                return items;
            });
        };

        var saveItems = function(items) {

            var data = {
                filters: JSON.stringify(items)
            };

            return $.ajax({
                type: 'POST',
                url: configurator.getApplicationPath() + '/storage/v1/QuickFilters/',
                data: JSON.stringify({
                    'key': loggedUser.id,
                    'scope': 'Private',
                    'publicData': null,
                    'userData': data
                }),
                contentType: 'application/json; charset=utf8'
            });
        };

        var removeItem = function(item) {
            $
                .when(getItems())
                .then(function(items) {
                    items = items.filter(function(v) {
                        return v.ID !== item.ID;
                    });
                    return saveItems(items);
                });
        };

        var saveItem = function(item, desc) {

            var key = item.ID;
            return $
                .when(getItems())
                .then(function(items) {
                    items = items.map(function(v) {
                        if (key === v.ID) {
                            v.Desc = desc;
                        }
                        return v;
                    });
                    return saveItems(items);
                });
        };

        var addItem = function(filter, desc) {

            var item = {
                "ID": getNewID(),
                "Desc": desc,
                "Filter": filter
            };

            return $
                .when(getItems())
                .then(function(items) {
                    items.push(item);
                    return $.when(item, saveItems(items));
                });
        };

        var addFilter = function(item, $el, config) {

            // var id = item.ID;
            var filter = item.Filter;
            var description = item.Desc;

            var renderDescription = function(description) {
                return [
                    '<div class="quickfilters__description ',
                        (item.isReadonly ? '' : 'quickfilters__description-editable'),
                        '">',
                        $.jqotenc(description) || 'add description',
                    '</div>']
                .join('');
            };

            var renderForm = function(description) {
                return [
                    '<form class="quickfilters__form">',
                        '<input type="text" autofocus value="' + $.jqotenc(description) + '" />',
                    '</form>'
                ].join('');
            };

            var $row = $([
                '<tr class="i-role-complex-filter-example">',
                    '<td >',
                        '<button type="button" class="tau-btn tau-primary i-role-predefined-filter" data-value="', $.jqotenc(filter), '">use</button>',
                    '</td>',
                    '<td class="filter-help-output">',
                        // some fields by ace editor
                        '<div class="filter-help-line" style="max-width: ' + (config.width.filter - 75) + 'px; min-width: ' + (config.width.filter - 75) + 'px;">',
                            '<pre class="i-role-output-filter quickfilters__filter ace_editor ace-tomorrow">',
                                $.jqotenc(filter),
                            '</pre>',
                        '</div>',
                    '</td>',
                    '<td class="filter-help-description">',
                        '<div class="quickfilters__descriptionwrapper" style="max-width: ' + (config.width.description) + 'px; min-width: ' + (config.width.description) + 'px;">',
                            renderDescription(description),

                            (item.isReadonly ? '' : '<span class="tau-icon_name_close quickfilters__remove">&nbsp;</span>'),
                        '</div>',
                    '</td>',
                '</tr>'
            ].join(''));

            $row.on('click', '.quickfilters__description', function() {

                if (item.isReadonly) {
                    return;
                }

                var $desc = $(this);
                var $form = $(renderForm(item.Desc));
                $desc.replaceWith($form);

                $form.find(':text').focus();

                $form.on('submit', function(e) {
                    e.preventDefault();

                    var val = $form.find(':text').val().trim();
                    saveItem(item, val);
                    $form.replaceWith(renderDescription(val));
                });

                $form.on('focusout', ':text', function() {

                    var val = $form.find(':text').val().trim();
                    saveItem(item, val);
                    $form.replaceWith(renderDescription(val));
                });

            });

            $row.on('click', '.quickfilters__remove', function() {

                removeItem(item);
                $(this).parents('tr:first').remove();
            });

            $el.find('.filter-help-heading').after($row);
        };

        var addFilters = function($el, config) {

            return $
                .when(getItems())
                .then(function(items) {
                    items = predefinedFilters.concat(items);
                    items.forEach(function(item) {
                        addFilter(item, $el, config);
                    });
                });
        };

        var initFilterList = function($filter, $help) {

            var $el = $([
                '<tbody class="quickfilters">',
                    '<tr class="filter-help-heading">',
                        '<td colspan="3">',
                            '<h2>',
                                'Saved Filters',
                                '<div class="quickfilters__tools">',
                                    '<button class="tau-btn i-role-savecurrent">Save current filter</button>',
                                '</div>',
                            '</h2>',
                        '</td>',
                    '</tr>',
                    '<tr class="i-role-delimiter quickfilters__delimiterrow">',
                        '<td class="quickfilters__delimiter" colspan="3" />',
                    '</tr>',
                '</tbody>'
            ].join(''));

            var $mainTable = $help.find('table');
            $mainTable.find('.quickfilters').remove();
            $mainTable.find('.filter-help-heading').remove();

            var $tds = $mainTable.find('.i-role-complex-filter-example td');
            var elConfig = {
                width: {
                    filter: $tds.eq(1).width(),
                    description: $tds.eq(2).width()
                }
            };

            addFilters($el, elConfig);
            $mainTable.prepend($el);

            $el.on('click', '.i-role-savecurrent', function() {

                var $input = $filter.find('.i-role-filter-input');
                $
                    .when(addItem($input.val() || '', ''))
                    .then(function(item) {
                        addFilter(item, $el, elConfig);
                    });
            });
        };

        configurator.getGlobalBus().on('content.$element.ready', function(evt, $help) {

            var $el = $help.parents('.i-role-filter:first');
            if (!$el.length) {
                $el = $($help.context).parents('.i-role-filter:first');
            }

            var $trigger = $el.find('.i-role-help');

            // // to prevent inner help bubbles should be only one listener
            if ($trigger.data('init')) {
                return;
            }
            $trigger.data('init', true);
            $trigger.on('taububbleshow', function() {
                $
                    .when(initFilterList($el, $help))
                    .then(function() {
                        $trigger.tauBubble('adjust');
                    });
            });
        });
    });
