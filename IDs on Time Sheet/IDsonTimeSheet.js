/*globals tau*/
tau.mashups
    .addDependency('jQuery')
    .addMashup(function($) {

        'use strict';

        $(document).ready(function() {
            var $target = $('#ctl00_mainArea_pnlUpd');

            if (!$target.length) {
                return;
            }

            var apply = function() {

                $target.find('tr.dataRow td:nth-of-type(3) a:first-of-type').each(function(k, v) {
                    var $link = $(v);
                    var id = $link.attr('href').match(/#(?:page=)?(\w+)\/(\d+)/);
                    if (id) {
                        id = id[2];
                        $link.parent().prepend(
                            '<div style="font-size: smaller; float: left; margin-right: 6px;">#' +
                            id +
                            '</div>');
                    }
                });
            };

            if (window.MutationObserver) {

                var observer = new MutationObserver(function() {
                    apply();
                });
                var config = {
                    childList: true
                };
                observer.observe($target[0], config);
            }

            apply();
        });
    });
