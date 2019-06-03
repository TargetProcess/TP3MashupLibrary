tau.mashups
    .addDependency('tp3/mashups/topmenu')
    .addMashup(function(topMenu) {
        'use strict';
        var initTreeTheme = function() {
            var style = document.createElement("style");
            style.setAttribute('id', 'tree-color-style');
            style.appendChild(document.createTextNode(""));
            document.head.appendChild(style);
            var sheet = style.sheet;
            var addCSSRule = function(selector, rules, index) { if (sheet.insertRule) { sheet.insertRule(selector + "{" + rules + "}", index); } else { sheet.addRule(selector, rules, index); }};

            // Modify Opacity
            addCSSRule(".tau-list-caption > .tau-elems-table:not(.tau-elems-table-level-0)"," opacity:0; height:1px; ");
            addCSSRule(".i-role-cardsholder:not(:hover) :not(.tau-list-time) > .tau-list-line > .tau-elems-table .tau-elems-cell:not(.tau-elems-cell--details-trigger):not(.tau-list-name_unit-cell):not(:nth-child(1)):not(:nth-child(2)):not(.tau-list-state_full_length-cell) ","opacity: 0;");
        };

        // Add menu item to toggle the theme
        topMenu.addItem('Tree').onClick(function() {
            var $xt = $(document).find('#tree-color-style');
            if ($xt.length) {
                $xt.remove();
            } else {
                initTreeTheme();
            }
        });

        // comment the following line to prevent auto-apply
        initTreeTheme();
    });