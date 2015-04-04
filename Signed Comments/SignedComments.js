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

            if (!window.CKEDITOR) {
                return;
            }

            var editorInstance = window.CKEDITOR.instances[$el.attr('id')];

            if (!editorInstance) {
                return;
            }

            $.ajax({
                type: 'GET',
                url: configurator.getApplicationPath() + '/storage/v1/Signatures/' + loggedUser.id,
                contentType: 'application/json; charset=utf8',
                success: function(data) {

                    try {
                        editorInstance = window.CKEDITOR.instances[$el.attr('id')];
                        if (data.userData && editorInstance) {
                            editorInstance.setData('<br/><br/>' + unescape(data.userData.sig));
                            editorInstance.focus();
                        }
                    } catch (err) {}
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
            require([appHostAndPath + '/ckeditor/ckeditor.js'], function() {
                window.CKEDITOR.replace('signature', {
                    toolbar: 'Basic'
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
