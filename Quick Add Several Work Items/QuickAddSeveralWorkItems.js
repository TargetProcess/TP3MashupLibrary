/*eslint quotes:[0, "single"] */
require([
    'Underscore',
    'jQuery',
    'app.bus'
], function(_, $, appBusDeferred) {

    'use strict';

    appBusDeferred.then(function(bus) {

        var isQuickAddEvent = function(evt) {
            return ['board.cell.quick.add', 'board plus quick add cells'].indexOf(evt.caller.name.toLowerCase()) >= 0;
        };
        var addedItems = [];
        var queue = [];
        var $quickAdd = null;

        $("<style type='text/css'> .file-upload-item { padding-bottom: 5px; white-space: nowrap; text-overflow: ellipsis; font-size: 12px; } </style>").appendTo("head");
        $("<style type='text/css'> .file-upload-container { overflow-x: hidden ; overflow-y: auto; max-height: 200px; } </style>").appendTo("head");

        bus.on('model.data.item.did.add', function(evt, data) {
            if (!isQuickAddEvent(evt)) {
                return;
            }

            if (queue.length) {
                if (queue.shift) {
                    queue.shift();

                    setTimeout(function() {
                        queue.processNextItem();
                    }, 10);

                }
            }
        });

        bus.on('model.data.item.did.fail.add', function(evt, data) {
            if (!isQuickAddEvent(evt)) {
                return;
            }
            if (queue.length) {
                queue.showImportButton();
            }
        });

        bus.on('model.add.item', function(evt) {
            if (!isQuickAddEvent(evt)) {
                return;
            }
            if (queue.length) {
                queue.hideImportButton();
            }
        });

        bus.on('blur', function(evt, data) {
            if (!isQuickAddEvent(evt)) {
                return;
            }

            queue = [];
            addedItems = [];
            $quickAdd = $('<div ></div>');
        });

        bus.on('afterRender', function(evt, data) {
            if (!isQuickAddEvent(evt)) {
                return;
            }

            $quickAdd = data.element;

            if (!addedItems.length) {
                return;
            }

            $('.tau-entity-fields', $quickAdd).each(function() {
                var $form = $(this);
                var argumentsCount = addedItems[0].length;

                var $name = $('input.tau-required-field-editor:lt(' + argumentsCount + ')', $form);
                $name.hide();

                var $icons = $('.tau-select-team-icon', $form);
                $icons.hide();

                var $ivite = $('.tau-invite-widget', $form);
                $ivite.hide();

                var $assignTeams = $('.tau-teams', $form);
                $assignTeams.hide();

                var $container = $('<div class="file-upload-container" ></div>');
                _.each(addedItems, function (item, index) {
                    var $item = $('<div class="file-upload-item"></div>').text((index + 1) + ". " + item.join(', '));
                    $container.append($item);
                });
                var $parent = $name.eq(0).parent();
                $container.appendTo($parent);

                var $tauButton = $('.tau-add-item', $form);
                $tauButton.hide();

                var $importButton = $('<div class="tau-success tau-btn" style="height: 15px; font-size: 14px;">Add ' + addedItems.length + ' item(s)</div>');
                $importButton.appendTo($tauButton.parent());

                var items = addedItems.concat([]);

                $importButton.click(function() {

                    queue = items;
                    var $messagePool = $('.tau-message-pool', $quickAdd);

                    var $inputs = $form.find('form :input[data-fieldname]');
                    var initFormValues = $inputs.map(function() {

                        var $field = $(this);
                        return {
                            name: $field.data('fieldname'),
                            value: $field.is(':checkbox') ? $field.prop('checked') : $field.val()
                        };
                    }).toArray();

                    queue.showImportButton = function() {
                        $importButton.show();
                        $messagePool.show();
                    };

                    queue.hideImportButton = function() {
                        $importButton.hide();
                        $messagePool.hide();
                    };

                    queue.processNextItem = function() {

                        initFormValues.map(function(v) {
                            var $field = $inputs.filter('[data-fieldname="' + v.name + '"]');
                            if ($field.is(':checkbox')) {
                                $field.prop('checked', v.value);
                            } else {
                                $field.val(v.value);
                            }
                        });

                        var countToImport = this.length;

                        var $items = $('.file-upload-item', $container);
                        var countOfDone = $items.length - countToImport;

                        $items = $('.file-upload-item:lt(' + countOfDone + ')', $container)
                            .css({
                                'text-decoration': 'line-through'
                            });

                        if ($items.length) {
                            $container.scrollTop($container.scrollTop() + $($items[$items.length - 1]).position().top);
                        }

                        var item = this[0];

                        if (item) {
                            $name.each(function (i, v) {
                                $(v).val(item[i]);
                            })
                            $tauButton.click();
                        }
                    };

                    queue.processNextItem();
                });
            });

            addedItems = [];
        });

        var noDrop = false;
        var complexEntity = false;

        bus.on('board.configuration.ready', function(evt, data) {

            if (!data.cells) {
                noDrop = true;
                return;
            }

            if (!data.cells.types) {
                noDrop = true;
                return;
            }

            if (data.cells.types.length === 0) {
                noDrop = true;
                return;
            }

            if (!data.cells.types[0]) {
                noDrop = true;
                return;
            }

            if (data.cells.types[0].indexOf('iteration') >= 0 || data.cells.types[0].indexOf('release') >= 0 || data.cells.types[0] === 'projectmember') {
                noDrop = true;
                return;
            }

            if (data.cells.types[0] === 'user') {
                complexEntity = true;
            }

            noDrop = false;
        });

        bus.on('overview.board.ready', function(evt, data) {

            if (noDrop) {
                return;
            }

            var processItems = function($cell, items) {
                if ($cell.hasClass('i-role-ch-quickadd-target')) {
                    addedItems = items;
                    $('.i-role-cell', $cell).trigger('dblclick');
                }
            };

            var $grid = $(".i-role-grid", data.element);
            var $cells = $(".i-role-cellholder", $grid);

            $cells.on('dragover', function(e) {
                e.preventDefault();
                return false;
            });

            $cells.on('drop', function(e) {
                e.preventDefault();

                if (!window.FileReader || !e.originalEvent.dataTransfer || !e.originalEvent.dataTransfer.files || !e.originalEvent.dataTransfer.files.length) {
                    return false;
                }

                var file = e.originalEvent.dataTransfer.files[0];

                if (!file.type.match(/^text\//)) {
                    return false;
                }

                var $cell = $(this);
                var reader = new FileReader();

                reader.onload = function(e) {
                    var text = reader.result || '';
                    var lines = _.compact(text.split(/\r?\n/).map(function(v) {
                        return v.trim();
                    }));
                    var items = lines.map(function(v){
                        if (complexEntity == true) {
                            //allow commas in non-complex entities
                            return (v || '').split(',');
                        }
                        else {
                            return [(v || '').trim()];
                        }
                    });
                    processItems($cell, items);
                };

                reader.readAsText(file, 'utf8');
                return false;
            });
        });
    });
});
