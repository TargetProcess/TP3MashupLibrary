/*globals tau*/
tau.mashups
    .addDependency('jQuery')
    .addMashup(function($) {

        'use strict';

        $(document).ready(function() {

            $('div#ctl00_mainArea_pnlUpd > table:first').find('tr.dataRow').each(function() {
                var id = $(this).find('td:eq(2) > a:first').attr('href').match(/#(\w+)\/(\d+)/);
                if (id) {
                    id = id[2];
                    $(this).find('td:eq(2)').prepend(
                        '<div style="font-size: smaller; float: left; margin-right: 6px;">#' +
                            id +
                        '</div>');
                }
            });
        });
    });
