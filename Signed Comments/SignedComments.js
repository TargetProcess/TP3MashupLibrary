tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tau/configurator')
    .addDependency('tp3/api/settings/v1')
    .addMashup(function($, _, configurator, Settings) {
        'use strict';

        var globalBus = configurator.getGlobalBus();
        var appHostAndPath = configurator.getApplicationPath();
        var loggedUser = configurator.getLoggedUser();
        var escape = window.escape;
        var unescape = window.unescape;
        var MARKDOWN_MARKER = '<!--markdown-->';
        var EditorType = {
            MARKDOWN: 'markdown',
            HTML: 'html'
        };

        var EditorTypesToEditorWidget = {
            'markdown': 'richeditorMarkdown',
            'html': 'richeditor'
        };

        function processMarkdown(text) {
            return text && _.startsWith(text, MARKDOWN_MARKER) ? text.replace(MARKDOWN_MARKER, '') : text;
        }

        var resolveWhenTimeout = function(timeout) {
            var deferred = $.Deferred();

            setTimeout(function() {
                deferred.resolve();
            }, timeout);

            return deferred.promise();
        };

        var renderSaveIndicator = function() {
            var template = [
                '<div class="save-indicator tau-text-success tau-active i-role-save-indicator">',
                    '<span class="tau-icon-general tau-icon-action-completed">',
                    '</span>',
                    '<span class="save-indicator__text">',
                        'Saved',
                    '</span>',
                '</div>'
            ].join('');

            return $(template);
        };

        var removeSaveIndicator = function() {
            $('.i-role-save-indicator').remove();
        };

        var signatureService = {
            load: function() {
                return $.ajax({
                    type: 'GET',
                    url: appHostAndPath + '/storage/v1/Signatures/' + loggedUser.id,
                    dataType: 'text' // use text because server may return nothing and promise will be rejected even if code is 200
                }).then(function (data) {
                    if (data) {
                        var jsonData = JSON.parse(data);

                        return jsonData.userData && jsonData.userData.sig ? unescape(jsonData.userData.sig) : '';
                    }

                    return '';
                });
            },

            save: function(text) {
                return $.ajax({
                    type: 'POST',
                    url: appHostAndPath + '/storage/v1/Signatures/' + loggedUser.id,
                    data: JSON.stringify({
                        'scope': 'Private',
                        'publicData': null,
                        'userData': {
                            'sig': escape(text)
                        }
                    }),
                    contentType: 'application/json; charset=utf8'
                });
            }
        };

        globalBus.on('comment.add.$editor.ready', function(e, $el) {
            var type;
            var editorInstance = window.CKEDITOR && window.CKEDITOR.instances[$el.attr('id')];

            if (editorInstance) {
                type = 'ckeditor';
            } else if ($el.richeditorMarkdown('instance')) {
                editorInstance = $el;
                type = 'markdown';
            } else {
                return;
            }

            signatureService.load().then(function(signature) {
                var processedText = processMarkdown(signature);
                if (type === 'ckeditor') {
                    try {
                        if (processedText && editorInstance) {
                            editorInstance.setData('<br/><br/>' + processedText);
                            editorInstance.focus();
                        }
                    } catch (err) {
                    }
                } else {
                    if (editorInstance.richeditorMarkdown('instance').$textarea.length && processedText) {

                        editorInstance.richeditorMarkdown('setText', '\n\n' + processedText);
                        var textarea = editorInstance.richeditorMarkdown('instance').$textarea[0];
                        textarea.focus();
                        if (textarea.setSelectionRange) {
                            textarea.setSelectionRange(0, 0);
                        }
                    }
                }
            });
        });

        function getEditorType() {
            return configurator.getGlobalSettingsService().getGlobalSettings().then(function (data) {
                return data.DefaultRichEditor.toLowerCase();
            });
        }

        function renderSignatureBlock() {
            var template = [
                '<div class="system-view__content--scroll">',
                    '<div class=system-view-header">',
                        '<div class="system-view-header__caption">',
                            '<h1 class="header-h1">',
                                'Your Signature',
                            '</h1>',
                        '</div>',
                    '</div>',
                    '<div style="width: 700px;">',
                        '<div style="margin: 0 0 18px 0">',
                            'You can set your personal signature for comments you add to work items.',
                        '</div>',
                        '<div class="i-role-text-editor">',
                        '</div>',
                    '</div>',
                '</div>'
            ].join('');

            var $container = $(template);
            var $textEditor = $container.find('.i-role-text-editor');

            $.when(signatureService.load(), getEditorType()).then(function(signature, editorType) {
                var editorWidget = EditorTypesToEditorWidget[editorType];
                var processedText = processMarkdown(signature);

                $textEditor[editorWidget]({
                    ckPath: configurator.getCkPath(),
                    ckFinderPath: configurator.getCkFinderPath(),
                    text: processedText,
                    settings: {
                        toolbar: [
                            {name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike']},
                            {name: 'paragraph', items: ['NumberedList', 'BulletedList']},
                            {name: 'links', items: ['Link', 'Unlink']},
                            {name: 'document', items: ['Source']}
                        ],
                        uploaderConfig: {}
                    },
                    saveAction: {
                        text: 'Save'
                    },
                    onSave: function(text) {
                        signatureService.save(text).then(function() {
                            var $saveIndicator = renderSaveIndicator();
                            var $saveButton = $('.i-role-actionsave');
                            $saveButton.parent().append($saveIndicator);

                            resolveWhenTimeout(1000).then(function() {
                                removeSaveIndicator();
                            });
                        });
                    }
                });

                $textEditor[editorWidget]('show');

                if (editorType === EditorType.MARKDOWN) {
                    $textEditor.richeditorMarkdown('setText', processedText);
                    $container.find('.i-role-write').css({'min-height': 0});
                }
            });

            return $container[0];
        }

        Settings.getMenu().addItem({
            id: 'signature',
            text: 'Signature',
            groupId: 'systemSettings',
            insert: function () {
                return getEditorType().then(renderSignatureBlock);
            }
        });
    });
