/* globals tau, loggedUser */
tau.mashups
    .addDependency('Underscore')
    .addDependency("jQuery")
    .addDependency('tau/configurator')
    .addCSS('QuickFilters.css')
    .addMashup(function(_, $, configurator) {

        'use strict';

        var tableCSS = {
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'max-width': '200px',
            'min-width': '200px'
        };

        var getNewID = function() {
            return (new Date()).getTime();
        };

        var getinfo = function() {

            return $.ajax({
                type: 'GET',
                url: configurator.getApplicationPath() + '/storage/v1/QuickFilters/?where=(scope == "Private")&select={UserData,key}',
                contentType: 'application/json; charset=utf8',
                dataType: 'json'
            }).then(function(data) {
                var storageData = _.first(data.items);
                var items = storageData && storageData.userData && storageData.userData.filters ? JSON.parse(storageData.userData.filters) : [];
                return items;
            });
        };

        var saveinfo = function(savedata) {

            var data = {
                filters: JSON.stringify(savedata)
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

        var saveDesc = function(desc, filter, key) {

            return $
                .when(getinfo())
                .then(function(items) {
                    items = items.map(function(v) {
                        if (key === v.ID) {
                            v.Desc = desc;
                        }
                        return v;
                    });
                    return saveinfo(items);
                });
        };

        var addFilterToList = function(filter, desc, $table, $rowTemplate, filterID) {

            var lastFilterClone = $rowTemplate.clone();
            lastFilterClone.find('.i-role-predefined-filter').data('value', filter);
            lastFilterClone.find('.i-role-output-filter').css(tableCSS);
            lastFilterClone.find('.i-role-output-filter').text(filter);
            lastFilterClone.find('td:last').html('');

            var descTD = $("<td class='filter-description'><span>" + desc + "</span></td>").click(function() {

                if ($(this).children(":first").hasClass('placeholder')) {

                    $(this).children(":first").removeClass('placeholder');
                    $(this).children(":first").text('');
                }

                $(this).addClass('edit-mode');
                $(this).children(":first").attr('contentEditable', true);
                $(this).children(":first").focus();

            }).focusout(function() {

                $(this).removeClass('edit-mode');
                $(this).children(":first").attr('contentEditable', false);
                //console.log(">> " + filterID);
                saveDesc($(this).children().text(), $(this).parents('tr').find('.i-role-predefined-filter').data('value'), filterID);
            }).keypress(function(e) {

                //when enter is pressed save as well.
                if (e.which === 13) {
                    $(this).removeClass('edit-mode');
                    $(this).children(":first").attr('contentEditable', false);
                    //console.log(">> " + filterID);
                    $(this).scrollTop();
                    saveDesc($(this).children().text(), $(this).parents('tr').find('.i-role-predefined-filter').data('value'), filterID);
                }
            });

            if (!desc.length) {
                descTD.children().addClass('placeholder');
                descTD.children().text('add description');
            }

            lastFilterClone.find('td:last').replaceWith(descTD);
            lastFilterClone.find('td:last').css(tableCSS);

            var removebtn = $('<td><span class="tau-icon_name_close" style="cursor: pointer;display:block;width:10px; background-position:-1067px -103px;">&nbsp;</span</td>');
            removebtn.click(function() {

                $(this).parents('tr:first').remove();
                $
                    .when(getinfo())
                    .then(function(items) {
                        items = items.filter(function(v) {
                            return v.ID !== filterID;
                        });
                        return saveinfo(items);
                    });
            });

            lastFilterClone.append(removebtn);
            $table.find('tbody').prepend(lastFilterClone);
        };

        var addSavedFilters = function($table, $rowTemplate) {

            return $
                .when(getinfo())
                .then(function(items) {
                    items.forEach(function(item) {
                        addFilterToList(item.Filter, item.Desc, $table, $rowTemplate, item.ID);
                    });
                });
        };

        var initFilterList = function($filter, $help) {

            var $input = $filter.find('.i-role-filter-input');
            var $table = $help.find('table:last');

            $table.find('.filter-help-heading').remove();
            $table.find('.i-role-output-filter').css(tableCSS);
            $table.find('td:nth-child(3)').css(tableCSS);
            var $rowTemplate = $table.find('tr:last').clone();

            $help.find('#filter_wrapper').remove();

            var $wrapper = $("<div id='filter_wrapper'></div>");

            var $savedTable = $table.clone().addClass('i-role-savedfilters').attr('id', 'customfilters');
            $savedTable.find('tr').remove();

            var $actions = $([
                "<div id='quickfilters_actions' style='height:23px;'>",
                "<div style='margin-top:10px;margin-bottom:-25px;margin-left:10px;'>Saved Filters</div>",
                "<div style='float:right;'><button class='tau-btn'>Save current filter</button></div>",
                "</div>"
            ].join(''));

            $wrapper.prepend("<div style='border-bottom-color: rgb(215, 215, 215); border-bottom-style: dashed; border-bottom-width: 1px;'></div>");
            $wrapper.prepend($savedTable);
            $wrapper.prepend($actions);

            var savebutton = $actions.find('button');
            savebutton.click(function() {

                var item = {
                    "ID": getNewID(),
                    "Desc": "",
                    "Filter": $input.val() || ''
                };

                $
                    .when(getinfo())
                    .then(function(items) {
                        items.push(item);
                        return $.when(item, saveinfo(items));
                    })
                    .then(function(item) {
                        addFilterToList(item.Filter, item.Desc, $savedTable, $rowTemplate, item.ID);
                    });
            });

            $wrapper.insertBefore($table);

            return addSavedFilters($savedTable, $rowTemplate);
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
