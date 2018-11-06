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
                    '<svg width="16" height="16" style="display: block;" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">',
                        '<path d="M3 8C3 5.23859 5.23853 3 8 3C8.44629 3 8.87744 3.05823 9.28711 3.16699C9.8208 3.30865 10.3684 2.99084 10.5103 2.45703C10.6519 1.92322 10.334 1.37561 9.80029 1.23395C9.22485 1.08112 8.62109 1 8 1C4.13403 1 1 4.13403 1 8C1 11.866 4.13403 15 8 15C11.866 15 15 11.866 15 8C15 6.85474 14.7241 5.77094 14.2344 4.81421C14.2192 4.78467 14.2029 4.75616 14.1853 4.72882L14.707 4.20709C15.0977 3.81659 15.0977 3.18341 14.707 2.79291C14.3167 2.40234 13.6833 2.40234 13.293 2.79291L7.5 8.58582L5.70703 6.79291C5.31665 6.40234 4.68335 6.40234 4.29297 6.79291C3.90234 7.18341 3.90234 7.81659 4.29297 8.20709L6.79297 10.7071C7.18335 11.0977 7.81665 11.0977 8.20703 10.7071L12.6797 6.2345C12.8867 6.78259 13 7.37726 13 8C13 10.7614 10.7615 13 8 13C5.23853 13 3 10.7614 3 8Z" fill="#60A554"/>',
                    '</svg>',
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
