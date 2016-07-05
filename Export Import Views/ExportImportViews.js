tau
    .mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tau/configurator')
    .addMashup(function ($, _, configurator) {

        'use strict';

        $('head').append([
            '<style>',
            '.mashup-import-view .drop-zone {',
            'border: 2px dashed #bbb;',
            '-moz-border-radius: 5px;',
            '-webkit-border-radius: 5px;',
            'border-radius: 5px;',
            'padding: 25px;',
            'text-align: center;',
            'color: #bbb;',
            'margin-top: 24px;',
            'margin-bottom: 12px;',
            '}',
            '.mashup-import-file {',
            ' display:none;',
            '}',

            '</style>'
        ].join('\n'));

        var reg = configurator.getBusRegistry();
        var bs;

        var addBusListener = function (busName, eventName, listener) {

            reg.on('create', function (e, data) {

                var bus = data.bus;
                if (bus.name === busName) {
                    bus.on(eventName, listener);
                }
            });

            reg.on('destroy', function (e, data) {

                var bus = data.bus;
                if (bus.name === busName) {
                    bus.removeListener(eventName, listener);
                }
            });

            reg.getByName(busName).done(function (bus) {
                bus.on(eventName, listener);
            });
        };
        var $exportButton;


        var changeHandler = function () {
            bs.boardSettings
                .get([])
                .then(prepareButton);
        };


        var prepareButton = function (res) {
            var json = _.omit(res, 'createdAt', 'id', 'isShared', 'menuIsVisible', 'menuNumericPriority', 'ownerIds', 'acid', 'edit');
            var blob = new Blob([JSON.stringify(json)], {type: "application/json"});
            var url = URL.createObjectURL(blob);
            if ($exportButton) {
                $exportButton.prop({
                    href: url,
                    download: res.name + '.json'
                })
            }

        };


        addBusListener('board.toolbar', 'boardSettings.ready', function (e, boardSettings) {
            bs = boardSettings;
            bs.boardSettings
                .onChange
                .add(changeHandler);
        });

        addBusListener('board.toolbar', 'destroy', function (e) {
            bs.boardSettings.onChange.remove(changeHandler);
            $exportButton = null;
        });

        addBusListener('board_templates', 'afterRender', function (e, render) {

            var $el = render.element;

            if (!$el.find('#import-view').length) {
                var $templateList = $el.find('.template-list.template-list--board');

                var $import = $([
                    '<div class="mashup-import-view template-list__item" data-title="Import" id="import-view">',
                    '<div class="template-list__preview">',
                    '<label for="mashup-import-files" class="drop-zone">Import</label>',
                    '<input class="mashup-import-file" type="file" id="mashup-import-files" name="files[]"/>',
                    '</div>',
                    '<div class="template-list__name">Import</div>',
                    '<div class="template-list__desc">Import view</div>',
                    '</div>'
                ].join(''));

                $templateList.prepend($import);


                $import.find('.mashup-import-file').change(function (evt) {
                    evt.preventDefault();
                    var files = evt.target.files;

                    var reader = new FileReader();
                    var file = files[0];
                    reader.onload = function (e) {
                        try {
                            var json = JSON.parse(e.target.result);
                            if (json.name && json.viewMode) {
                                json.edit = false;
                                bs.boardSettings.set({
                                    set: json
                                });
                            }
                        }
                        catch (ex) {
                            alert('Invalid file!')
                        }
                    };
                    reader.readAsText(file);
                });
            }
        });

        var addExportButton = function ($el) {
            var $a = $(_.flatten([
                '<a class="tau-btn tau-extension-board-tooltip" id="mashup-export-view" data-title="Export view settings" alt="Export view">',
                'Export',
                '</a>'
            ]).join(''));

            if (!$el.find('#mashup-export-view').length) {
                $el.find('[role=actions-button]').before($a);
            }
            return $a;
        };

        addBusListener('board.toolbar', 'afterRender', function (e, renderData) {

            var $el = renderData.element;
            $exportButton = addExportButton($el);
            changeHandler();

        });

    });