tau.mashups
    .addDependency("jQuery")
    .addDependency('tau/configurator')
    .addMashup(function($, configurator) {

        'use strict';

        var gb = configurator.getGlobalBus();
        var appHostAndPath = configurator.getApplicationPath();
        var loggedUser = configurator.getLoggedUser();
        var escape = window.escape;
        var unescape = window.unescape;

        gb.on('comment.add.$editor.ready', function(e, $el) {

            var type;
            var editorInstance;

            if (window.CKEDITOR) {
                editorInstance = window.CKEDITOR.instances[$el.attr('id')];
                if (editorInstance) {
                    type = 'ckeditor';
                } else {
                    return;
                }
            } else if ($el.richeditorMarkdown('instance')) {
                editorInstance = $el;
                type = 'markdown';
            } else {
                return;
            }

            $.ajax({
                type: 'GET',
                url: configurator.getApplicationPath() + '/storage/v1/Signatures/' + loggedUser.id,
                contentType: 'application/json; charset=utf8',
                success: function(data) {
                    var signature = unescape(data.userData.sig);
                    if (type === 'ckeditor') {
                        try {
                            editorInstance = window.CKEDITOR.instances[$el.attr('id')];
                            if (data.userData && editorInstance) {
                                editorInstance.setData('<br/><br/>' + signature);
                                editorInstance.focus();
                            }
                        } catch (err) {}
                    } else {
                        if (editorInstance.richeditorMarkdown('instance').$textarea.length) {

                            editorInstance.richeditorMarkdown('setText', '\n\n' + signature);
                            var textarea = editorInstance.richeditorMarkdown('instance').$textarea[0];
                            textarea.focus();
                            if (textarea.setSelectionRange) {
                                textarea.setSelectionRange(0, 0);
                            }
                        }
                    }
                }
            });
        });

        /* block that renders the personal settings signature form */
        $(document).ready(function() {
            if ($('span.tableTitle').html() !== 'Personal settings') {
                return;
            }

            var trHead = $('<tr><td colspan="2"><b>Your Signature</b></td></tr>');
            trHead.insertBefore($('b:contains("Your Photo")').parents('tr:first'));
            var trBody = $('<tr><td colspan="2"></td></tr>');
            trBody.insertAfter(trHead);
            trBody.find('td:first').html('<textarea id="signature" cols="55" rows="6"></textarea>');
            /* make it a rich text editor */
            require([configurator.getCkPath() + '/new/ckeditor/ckeditor.js'], function() {
                require([configurator.getCkPath() + '/new/ckfinder/ckfinder.js'], function() {
                    window.CKEDITOR.replace('signature', {
                        toolbar: 'Basic',
                        uploaderConfig: {

                        }
                    });
                });
            });
            /* bind to save */
            $('input.button[value="Save changes"]').click(function() {
                $.ajax({
                    type: 'POST',
                    async: false,
                    url: appHostAndPath + '/storage/v1/Signatures/' + loggedUser.id,
                    data: JSON.stringify({
                        'scope': 'Private',
                        'publicData': null,
                        'userData': {
                            'sig': escape($('textarea#signature').val())
                        }
                    }),
                    contentType: 'application/json; charset=utf8'
                });
                return true;
            });
            /* get the existing value (if any) */
            $.ajax({
                type: 'GET',
                url: appHostAndPath + '/storage/v1/Signatures/' + loggedUser.id,
                contentType: 'application/json; charset=utf8',
                success: function(data) {
                    try {
                        if (data.userData) {
                            $('textarea#signature').val(unescape(data.userData.sig) || '');
                            window.CKEDITOR.instances['signature'].setData(unescape(data.userData
                                .sig));
                        }
                    } catch (e) {}
                }
            });
        });
    });
