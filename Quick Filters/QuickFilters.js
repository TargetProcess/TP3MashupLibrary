tau.mashups
    .addDependency("jQuery")
    .addDependency('tau/configurator')
    .addMashup(function($, configurator) {

        'use strict';

        var tableCSS = {
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'max-width': '200px',
            'min-width': '200px'
        };

        var addCSS = function() {
            $('head').append('<style type="text/css">' +
                '.i-role-complex-filter-example .filter-description:hover span {background-color: #fff;border: solid 1px #cbd1d6;border-top-color: #a3a7ab;padding: 2px 7px;min-width: 200px;color: #acb6bf;display: inline-block;height: 18px;line-height: 18px;}' +
                //+'.i-role-complex-filter-example .filter-description {padding-right:20px;}' + '.i-role-complex-filter-example .filter-description span {display:block;height: 18px;line-height: 18px;overflow:hidden;text-overflow:ellipsis;}' +
                '.i-role-complex-filter-example .filter-description.edit-mode span,.i-role-complex-filter-example:hover .filter-description.edit-mode span {background-color: #fff;border: solid 1px #cbd1d6;border-top-color: #a3a7ab;padding: 2px 7px;min-width:200px;color: #16343b;font-weight: 600;display: inline-block;height: 18px;line-height: 18px;}' +
                '</style>');
        };

        var getNewID = function() {
            return (new Date()).getTime();
        };

        var getinfo = function() {

            var info = false;

            $.ajax({
                type: 'GET',
                url: configurator.getApplicationPath() + '/storage/v1/QuickFilters/?where=(scope == "Private")&select={UserData,key}',
                async: false,
                contentType: 'application/json; charset=utf8',
                success: function(data) {
                    $.each(data.items, function(k, item) {
                        info = item.userData;
                    });
                }
            });

            var array = [];

            if (info) {
                array = $.parseJSON(info.filters);
            }

            return array;
        };

        var saveinfo = function(savedata) {

            var saves = {};

            saves["Filters"] = JSON.stringify(savedata);

            $.ajax({
                type: 'POST',
                async: false,
                url: configurator.getApplicationPath() + '/storage/v1/QuickFilters/',
                data: JSON.stringify({
                    'key': loggedUser.id,
                    'scope': 'Private',
                    'publicData': null,
                    'userData': saves
                }),
                contentType: 'application/json; charset=utf8',

                success: function() {
                    //console.log('save success');
                    return true;
                },
                error: function() {
                    //console.log('fail');
                    return false;
                }
            });
        };

        var addFilterToList = function(filter, desc, el, sampleFilter, filterID) {

            var lastFilterClone = sampleFilter.clone();
            lastFilterClone.find('.i-role-predefined-filter').data('value', unescape(filter));
            lastFilterClone.find('.i-role-output-filter').css(tableCSS);
            lastFilterClone.find('.i-role-output-filter').html(unescape(filter));
            lastFilterClone.find('td:last').html('');

            var descTD = $("<td class='filter-description'><span>" + unescape(desc) + "</span></td>").click(function() {

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

            var removebtn = $('<td data-id="' + filterID + '"><span class="tau-icon_name_close" style="cursor: pointer;display:block;width:10px; background-position:-1067px -103px;">&nbsp;</span</td>').click(function() {

                var current_info = getinfo();
                var filterID = $(this).data('id');

                $(this).parents('tr').remove();
                //console.log(filterID);

                var indexToRemove = null;

                $.each(current_info, function(k, item) {
                    if (item.ID == filterID) {
                        indexToRemove = k;
                        return false;
                    }
                });

                current_info.splice(indexToRemove, 1);
                saveinfo(current_info);
            });

            lastFilterClone.append(removebtn);
            el.find('#customfilters > tbody').prepend(lastFilterClone);
        };

        var addSavedFilters = function($element, sampleFilter) {

            var customfilters = getinfo();

            $.each(customfilters, function(k, item) {
                addFilterToList(item.Filter, item.Desc, $element, sampleFilter, item.ID);
            });
        };

        var saveDesc = function(desc, filter, key) {

            var current_info = getinfo();
            var indexToUpdate = null;
            var itemToUpdate = null;
            $.each(current_info, function(k, item) {

                if (item.ID == key) {
                    indexToUpdate = k;
                    itemToUpdate = item;
                    return false;
                }
            });

            if (indexToUpdate !== -1) {
                itemToUpdate.Desc = escape(desc);
                current_info[indexToUpdate] = itemToUpdate;
            }

            saveinfo(current_info);
        };

        addCSS();
        configurator.getGlobalBus().on('content.$element.ready', function(evt, $element) {

            var sampleFilter = $element.find('tr').last().clone();
            var inputbox = $element.parents('.i-role-filter').find('.i-role-filter-input');
            var currentTable = $element.find('table');
            var newtable = $element.find('table').clone().attr('id', 'customfilters');

            //make coulmns match
            currentTable.find('.i-role-output-filter').css(tableCSS);
            currentTable.find('td:nth-child(3)').css(tableCSS);

            var savebutton = $("<div style='float:right;'><button class='tau-btn'>Save current filter</button></div>").click(function() {

                var current_info = getinfo();
                var filterText = inputbox.val();
                var filterID = getNewID();
                var filterToAdd = {
                    "ID": filterID,
                    "Desc": "",
                    "Filter": escape(filterText)
                };

                current_info.push(filterToAdd);
                saveinfo(current_info);

                var table = $(this).parents('.tau-help-content.i-role-help-content');
                table.find('tr').last();
                addFilterToList(escape(filterText), "", table, table.find('tr').last(), filterID);
            });

            if (!$element.find('#filter_wrapper').length) {
                currentTable.wrap("<div id='filter_wrapper'></div>");
            }

            newtable.find('tr:not(.filter-help-heading)').remove();
            //When reports is open it runs 3 times...

            if (!$element.find('#quickfilters_actions').length) {
                $element.find('#filter_wrapper').prepend("<div id='quickfilters_actions' style = 'height:23px;'></div>");
                $element.find('#quickfilters_actions').append("<div style='margin-top:10px;margin-bottom:-25px;margin-left:10px;'>Saved Filters</div>");
                $element.find('#quickfilters_actions').append(savebutton);
                $element.find('#quickfilters_actions').after("<div style='border-bottom-color: rgb(215, 215, 215); border-bottom-style: dashed; border-bottom-width: 1px;'></div>");
            }

            $element.find('#quickfilters_actions').after(newtable);
            $element.find('.filter-help-heading').remove();

            addSavedFilters($element, sampleFilter);
        });
    });
