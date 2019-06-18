tau.mashups
    .addDependency('tp3/mashups/topmenu')
    .addMashup(function(topMenu) {
        'use strict';
        var initColorfulTheme = function() {
            var style = document.createElement("style");
            style.setAttribute('id', 'tree-color-style');
            style.appendChild(document.createTextNode(""));
            document.head.appendChild(style);
            var sheet = style.sheet;
            var addCSSRule = function(selector, rules, index) { if (sheet.insertRule) { sheet.insertRule(selector + "{" + rules + "}", index); } else { sheet.addRule(selector, rules, index); }};

            // Add color to the title of cards and lists
            addCSSRule('.tau-list-epic .tau-entity-full-name, .tau-card-v2_type_epic .tau-entity-full-name','color: #00BEA0 !important;  ');
            addCSSRule('.tau-list-bug .tau-entity-full-name, .tau-card-v2_type_bug .tau-entity-full-name','color: #E65C5C !important; ');
            addCSSRule('.tau-list-task .tau-entity-full-name, .tau-card-v2_type_task .tau-entity-full-name','color: #66C !important; ');
            addCSSRule('.tau-list-userstory .tau-entity-full-name, .tau-card-v2_type_userstory .tau-entity-full-name','color: #2E8AE5 !important;  ');
            addCSSRule('.tau-list-feature .tau-entity-full-name, .tau-card-v2_type_feature .tau-entity-full-name','color: #33991F !important;  ');
            addCSSRule('.tau-list-request .tau-entity-full-name, .tau-card-v2_type_request .tau-entity-full-name','color: #d69e38 !important;  ');
            // Colorize user names
            addCSSRule('.tau-board-unit_type_assigned_users_names','color: #589ccc !important;');

            // Add decorator around user names, and make "current" name bold
            addCSSRule('.tau-board-unit_type_assigned_users_names b','background: #f6f7f9; border: 1px solid #e7e8eb; border-radius: 2px; padding: 1px 4px;');
            addCSSRule('.tau-board-unit_type_assigned_users_names span','background: #f6f7f9; border: 1px solid #e7e8eb; border-radius: 2px; padding: 1px 4px; color: #666668;');

            // Colorize State values
            addCSSRule('.tau-board-unit_type_state .tau-board-unit__value','color: #63a40d !important;');

            // Make past and complete items dull
            //addCSSRule('.tau-board-list-view .tau-list-entity.tau-list-entity_final-state, .tau-board-list-view .tau-list-entity.tau-list-entity_isInPast','background-color: #DAE0E8 !important;');

            // Additional cards
            addCSSRule('.tau-board-unit_type_user-info__name','color: #656C78 !important;');
            addCSSRule('.tau-card-v2_type_user','border-left: 5px solid #8e98a8;');

            // Add decorator around card
            addCSSRule('.tau-board-unit_type_list span.tau-board-unit_type_list__item__content__text','background: #f6f7f9; border: 1px solid #e7e8eb; border-radius: 2px; padding: 0px 6px !important; color: #8e98a8;');
        };


        // Add menu item to toggle the theme
        topMenu.addItem('Colorful').onClick(function() {
            var $xt = $(document).find('#tree-color-style');
            if ($xt.length) {
                $xt.remove();
            } else {
                initColorfulTheme();
            }
        });

        // comment the following line to prevent auto-apply
        initColorfulTheme();
    });
