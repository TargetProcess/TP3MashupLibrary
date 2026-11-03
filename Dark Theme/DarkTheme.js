tau
    .mashups
    .addDependency('jQuery')
    .addDependency('tp3/mashups/topmenu')
    .addMashup(function($, topMenu) {
        'use strict';

        var init = function() {
            var themeCookie = getCookie("TPtheme");
            if (themeCookie !== "Dark") return;

            var style = document.createElement("style");

            $('body').addClass('dark-TPtheme');

            style.setAttribute('id', 'tv-style');
            style.appendChild(document.createTextNode(""));

            document.head.appendChild(style);

            var sheet = style.sheet;
            var addCSSRule = function(selector, rules, index) {
                if (sheet.insertRule) {
                    sheet.insertRule(selector + "{" + rules + "}", index);
                } else {
                    sheet.addRule(selector, rules, index);
                }};

            // Add rules here.
            // Add !important to make sure default rules will be overwritten.
            var gBoardPanelBackgroundDarkerBorder = "#1A1A1D";
            var gBoardPanelBackgroundDarker = "#2D2E33";
            var gBoardPanelBackgroundLighter = "#36383E";
            var gBoardPanelBackgroundLighterHover = "#404249";

            var gBoardCard = "#4a4c51";

            var gFontColorDefaultRevert = "rgba(255,255,255,1)";
            var gFontColorSecondaryRevert = "rgba(255,255,255,0.6)";
            var gFontColorTertiaryRevert = "rgba(255,255,255,0.3)";

            var gBorderColorTertiaryRevert = "rgba(255,255,255,0.15)";

            var gFontColorDefault = "rgba(0,0,0,1)";
            var gFontColorSecondary = "rgba(0,0,0,0.6)";
            var gFontColorTertiary = "rgba(0,0,0,0.3)";


            // INVERTED CARDS and UNITS with working visual encoding, made for board/board list/timeline view (not for inner lists and one-by-one view)
            // Units
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-card-v2.tau-card-v2_final-state', 'opacity: 0.5;');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-entity-full-name,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-unit__value-milestone-flexbox-wrapper__name,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-unit_type_user-info__name,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-unit_type_team_allocation-info__name,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-unit_type_entity-name .tau-board-unit__value,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-unit_type_entity-name-extended .tau-board-unit__value,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-unit_type_entity-name-extended-plus .tau-board-unit__value,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .click-edit__link-text,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-project-abbreviation:not([style])', 'color: ' + gFontColorDefaultRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board .tau-board-body > div:not(.tau-board-composite-view) .tau-card-v2:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-unit,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-unit__value-milestone-flexbox-wrapper__date,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-unit__points--dark,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-unit_type_id a,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-unit_type_entity-icon-id a,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-unit_type_process a,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-unit_type_emoji-tags__others-counter', 'color: ' + gFontColorSecondaryRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-unit__points,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-unit__value-remain', 'color: ' + gFontColorTertiaryRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-unit__points', 'color: ' + gFontColorTertiaryRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-project-abbreviation', 'border-color: ' + gFontColorTertiaryRevert + ';');

            // Cards and list
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-card-v2:not(.tau-selected):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated)', 'background: ' + gBoardCard + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-entity', 'background: ' + gBoardCard + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-entity .tau-elems-cell', 'border-right-color: ' + gFontColorTertiary + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-entity:not(.i-role-encoded) .tau-elems-cell', 'border-right-color: ' + gBoardPanelBackgroundDarker + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-board-list-cell-resizer--inner', 'background-color: ' + gBoardPanelBackgroundDarker + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-sorting__title', 'border-bottom-color: ' + gFontColorTertiaryRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-sorting__title:hover', 'border-bottom-color: transparent; color: ' + gFontColorSecondaryRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-more__inner', 'background: none;');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-more__inner:before, ' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-more__inner:after', 'display: none;');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-caption', 'background-color: '+ gBoardPanelBackgroundDarker + '; color: ' + gFontColorSecondaryRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-caption .tau-cap', 'color: ' + gFontColorDefaultRevert + ' !important;');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-level-0:last-child > .tau-list-level-cardsholder > .tau-list-entity:last-child > .tau-list-line', 'border-bottom-color: ' + gBoardPanelBackgroundDarker + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-entity .tau-list-line', 'border-top-color: ' +  gFontColorTertiary + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-entity:not(.i-role-encoded) .tau-list-line', 'border-top-color: ' + gBoardPanelBackgroundDarker + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-elems-table > .tau-elems-cell > .tau-board-unit', 'color: ' + gFontColorDefaultRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-board-list-view__counter .tau-counter', 'color: ' + gFontColorDefaultRevert + '; border-color: ' + gFontColorTertiaryRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-project-icon--bordered:after, ' +
                       '.dark-TPtheme .tau-board-header .context-filter .tau-project-icon--bordered:after', 'box-shadow: inset 0 0 1px ' + gFontColorSecondaryRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-entity.tau-list-entity_final-state, ' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-entity.tau-list-entity_isInPast', 'background-color: inherit; opacity: 0.5;');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-page-items,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-page-items .tau-count', 'color:' + gFontColorSecondaryRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-page-items .tau-count:hover', 'color:' + gFontColorDefaultRevert + '!important;');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-count.tau-active', 'color:' + gFontColorDefaultRevert + '!important; background-color: ' + gBoardPanelBackgroundLighterHover + '!important');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-paging-info', 'color: '+ gFontColorDefaultRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-list-view .tau-list-entity:hover, .dark-TPtheme .tau-board-list-view .tau-card_focusedit_true', 'opacity: 0.8;');
            addCSSRule('.dark-TPtheme .tau-board-list-view .tau-sortable__placeholder-inner', 'background-color: ' + gBoardPanelBackgroundLighterHover + ' !important;');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-elems-cell_unit-empty-text', 'color: '+ gFontColorSecondaryRevert + ';');

            // Board
            addCSSRule('body.dark-TPtheme', 'background-color: ' + gBoardPanelBackgroundLighter + ';');
            addCSSRule('.dark-TPtheme .tau-page-navigation-button', 'background-color: ' + gFontColorTertiaryRevert + ';');
            addCSSRule('.dark-TPtheme .t3-views-navigator, .dark-TPtheme .t3-group', 'background-color: ' + gBoardPanelBackgroundDarker + ';');
            addCSSRule('.tau-app-body > header, .general-add-button-holder', 'background: #232428 !important; border-bottom: 1px solid ' + gBoardPanelBackgroundDarkerBorder +  '!important;');
            addCSSRule('.i-role-views-menu, .i-role-board-menu', 'border-right: 1px solid ' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-bubble-tooltip .tau-bubble-board__inner', 'background:' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-bubble-tooltip .tau-bubble-board__arrow:after', 'background:' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-board-header .context-filter__body, .tau-board-header .context-filter__revert-control, .tau-board-header .tau-btn, .tau-board-header input, .tau-boardclipboard .tau-btn, .tau-boardclipboard .i-role-action-clear, .refresh-histogram__control .tau-btn', 'background: ' + gBoardCard + ' !important; border-color:' + gBorderColorTertiaryRevert + '!important; color: ' + gFontColorSecondaryRevert +' !important; font-size: 12px !important');
            addCSSRule('.dark-TPtheme .tau-board-header .context-filter__more', 'color: ' + gFontColorSecondaryRevert +' !important;');
            addCSSRule('.tau-board-header .context-filter__body:hover, .tau-board-header .context-filter__revert-control:hover, .tau-board-header .tau-btn:hover, .tau-board-header input:hover, .tau-board-header .tau-checked, .tau-boardclipboard .tau-btn:hover', 'border-color: ' + gFontColorSecondaryRevert + '!important;');
            addCSSRule('.context-filter__projects:first-child:after, .context-filter__teams:first-child:after', 'background: ' + gBorderColorTertiaryRevert + '!important;');
            addCSSRule('.boardsettings-filter__status--off', 'color: ' + gFontColorTertiaryRevert + '!important;');
            addCSSRule('.tau-board, .tau-board-header', 'background:' + gBoardPanelBackgroundLighter + '!important;');
            addCSSRule('.tau-board-header', 'border-bottom-color:' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-board-header .tau-board-name', 'color: ' + gFontColorDefaultRevert + '!important;');
            addCSSRule('.tau-board-name--hovering:after', 'border-bottom-color: ' + gFontColorDefaultRevert + '!important;');
            addCSSRule('.tau-boardclipboard', 'background: ' + gBoardPanelBackgroundLighter + ' !important; border-top-color:' +  gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-boardclipboard-title', 'color:' + gFontColorSecondaryRevert + '!important;');
            addCSSRule('.tau-axiscell__item .i-role-name, .tau-x-header .tau-label, .i-role-timeline-header-cell .tau-label, .tau-timeline-scale .i-role-timeline-header-cell .i-role-cell, .tau-period-label, .tau-boardclipboard-title, .tau-scale-ruler', 'color:' +  gFontColorDefaultRevert + '!important;');
            addCSSRule('.i-role-axis-mark-selector', 'opacity: 0.8 !important;');
            addCSSRule('.tau-axiscell__item .tau-label__text_current', 'color:' + gFontColorSecondaryRevert + '!important;');
            addCSSRule('.tau-cards-count span', 'color:' + gFontColorSecondary + '!important; background: ' + gBoardPanelBackgroundLighter + '!important; box-shadow: none !important; border-color: ' + gFontColorSecondaryRevert + ' !important; color: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule('.tau-pages-navigator__text', 'color: #A1A7B3 !important;');
            addCSSRule('.tau-board-view .tau-label__date', 'color: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule('.tau-board-view .tau-label__date_current .time-left', 'color: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule('.tau-board-view .tau-label__velocity, .tau-board-view .tau-label__effort', 'color: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule('.tau-board-grid-view .tau-label_mark', 'font-weight: normal !important;');
            addCSSRule('.i-role-axis-item .tau-state', 'color: ' + gFontColorSecondaryRevert +  '!important;');
            addCSSRule('.tau-no-data-in-slice h2, .tau-no-data-in-slice .tau-txt', 'font-weight: normal !important; color: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule('.tau-loader-logo', 'background-color: rgba(255,255,255, 0.1) !important;');
            addCSSRule('.tau-cellholder .tau-label:after, .tau-x-header .tau-label:after, .tau-backlog-header .tau-label:after', 'box-shadow: none !important;');
            addCSSRule('.tau-btn-add-milestone', 'box-shadow: 0 0 2px 5px ' + gBoardPanelBackgroundLighter + '!important;');
            addCSSRule('.tau-btn-add-milestone:after', 'background-color: ' + gBoardPanelBackgroundLighter + '!important;');
            addCSSRule('.tau-timeline>.tau-timeline-canvas>.tau-timeline-flow, ._tc-timeline-navigator:before, ._tc-timeline-navigator:after, ._tc-timeline-navigator>.tc-focus-range:before, ._tc-timeline-navigator>.tc-focus-range:after, ._tc-timeline-navigator', 'background: transparent !important;');
            addCSSRule('._tc-timeline-navigator>.tc-histogram:not(.tc-histogram-empty)', 'background: transparent !important; opacity: .5 !important; ');
            addCSSRule('.tau-board-view .tau-cols-header', 'border-bottom-color:' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-board-view .tau-cols-header .tau-cellholder', 'border-left-color:' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-board-view .tau-rows-header .tau-cellholder, .tau-board-view .tau-backlog-body .tau-cellholder, .tau-board-view .tau-timeline .tau-cellholder', 'border-bottom-color:' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-board-timeline-view .tau-timeline-scale .tau-scale-ruler .tau-ruler-segment .tau-notch-label', 'border-left-color:' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-board-timeline-view .tau-timeline-scale .tau-scale-ruler .tau-ruler-segment.tau-is-period-start .tau-notch-label .tau-notch-label__main', 'color:' + gFontColorSecondaryRevert + '!important;');
            addCSSRule('.tau-timeline-gridlines-separator,.tau-board-timeline-view .tau-timeline-scale .tau-scale-ruler .tau-ruler-segment:not(.tau-ruler-segment-part):before', 'border-color: ' + gFontColorTertiaryRevert + '!important;');
            addCSSRule('.tau-timeline-gridlines-header__info', 'color: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule('.tau-timeline-gridlines-header__counter', 'color: ' + gFontColorTertiaryRevert + ' !important;');
            addCSSRule('.tau-timeline-gridlines-separator--weekend', 'background-color: ' + gBoardPanelBackgroundDarker + '!important;');
            addCSSRule('._tc-timeline-navigator:before', 'border-top-color:' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-board-view .tau-grid .tau-cellholder', 'border-color:' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-board-view .tau-rows-header, .tau-board-view .tau-x-header', 'border-color:' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-backlog-timeline-header_timeline_grid_lines, .tau-timeline-gridlines-container', 'background-color: ' + gBoardPanelBackgroundLighter + '!important; border-bottom-color:' + gBoardPanelBackgroundDarker + '!important;');
            addCSSRule('.tau-board-timeline-view .tau-timeline-scale .tau-scale-ruler .tau-ruler-segment', 'color: ' + gFontColorTertiaryRevert +  '!important;');
            addCSSRule('.tau-scale-ruler .tau-timeline-milestone-marker', 'box-shadow: none !important;');
            addCSSRule('.tau-board-grid-view .tau-collapsed .tau-card-v2:nth-child(42) ~ .more-collapsed', 'color: ' + gFontColorSecondaryRevert +  '!important;');
            addCSSRule('.tau-timeline .tau-timeline-flow .tau-cell-planner', 'background-color: rgba(255,255,255,0.05) !important;');
            addCSSRule('.tau-timeline .tau-timeline-flow .tau-cell-planner:before', 'background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 100%) !important;');
            addCSSRule('.tau-timeline .tau-timeline-flow .tau-cell-planner:after', 'background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%) !important;');
            addCSSRule('.dark-TPtheme .tau-timeline .tau-timeline-card .tau-card-planner .tau-card-v2:not(.i-role-encoded):not(.tau-selected)', 'background: rgba(255, 255, 255, 0.05) !important');
            addCSSRule('.dark-TPtheme .tau-timeline > .tau-timeline-canvas > .tau-timeline-flow .tau-timeline-track > .tau-timeline-card > .tau-card-planner .tau-end-date', 'border-color: ' + gFontColorDefaultRevert + ';');
            addCSSRule('.dark-TPtheme .tau-timeline > .tau-timeline-canvas > .tau-timeline-flow .tau-timeline-track > .tau-timeline-card > .tau-card-planner', 'border-color: ' + gFontColorDefaultRevert + ';');
            addCSSRule('.dark-TPtheme .tau-timeline > .tau-timeline-canvas > .tau-timeline-flow .tau-timeline-track > .tau-timeline-card > .tau-card-predictor', 'background-color: rgba(61, 64, 70, 0.6)');
            addCSSRule('.dark-TPtheme .tau-board-grid-view:not(.tau-ui-size-min):not(.tau-ui-size-xl) .tau-show-more-cards-trigger,' +
                '.dark-TPtheme .tau-board-grid-view:not(.tau-ui-size-min):not(.tau-ui-size-xl) .tau-show-more-cards-trigger:before,' +
                '.dark-TPtheme .tau-board-grid-view:not(.tau-ui-size-min):not(.tau-ui-size-xl) .tau-show-more-cards-trigger:after', 'background-color: ' + gBoardCard + ';');
            addCSSRule('.dark-TPtheme .tau-show-more-cards-trigger button', 'color: ' + gFontColorDefaultRevert + ';')
            addCSSRule('.dark-TPtheme .tau-rows-header:not(.tau-cellholder), .dark-TPtheme .tau-cols-header:not(.tau-cellholder)', 'background-color: ' + gBoardPanelBackgroundLighter + '!important;')

            addCSSRule('.tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder .first-column', 'background: linear-gradient(to right, ' + gBoardPanelBackgroundLighter + ',' + gBoardPanelBackgroundLighter + ', rgba(41,44,51,0)) !important;');
            addCSSRule('.tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder .first-row', 'background: linear-gradient(' + gBoardPanelBackgroundLighter + ',' + gBoardPanelBackgroundLighter + ', rgba(41,44,51,0)) !important;');
            addCSSRule('.tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder:after', 'border-color: ' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cols-header, .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-rows-header, .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-x-header', 'background-color: ' + gBoardPanelBackgroundLighter + '!important;');addCSSRule('.tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cols-header, .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-rows-header, .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-x-header', 'background-color: ' + gBoardPanelBackgroundLighter + '!important;');


            // limits + selected lanes
            addCSSRule('.tau-axis-limit_overhead_x.tau-cellholder, .tau-axis-limit_overhead_y.tau-cellholder', 'background: #594747 !important;');
            addCSSRule('.tau-axis-limit_warning_x.tau-cellholder, .tau-axis-limit_warning_y.tau-cellholder', 'background: #595247 !important;');
            addCSSRule('.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-axis-limit_warning_x.tau-cols-header,' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-axis-limit_warning_x.tau-rows-header, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-axis-limit_warning_x .first-row, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-axis-limit_warning_x .first-column, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-axis-limit_warning_y.tau-cols-header, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-axis-limit_warning_y.tau-rows-header, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-axis-limit_warning_y .first-row, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-axis-limit_warning_y .first-column', 'background: #595247 !important;');
            addCSSRule('.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-axis-limit_overhead_x.tau-cols-header,' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-axis-limit_overhead_x.tau-rows-header, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-axis-limit_overhead_x .first-row, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-axis-limit_overhead_x .first-column, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-axis-limit_overhead_y.tau-cols-header,' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-axis-limit_overhead_y.tau-rows-header,' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-axis-limit_overhead_y .first-row, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-axis-limit_overhead_y .first-column', 'background: #594747 !important;');

            // limits + selected lanes (new boards)
            addCSSRule('.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected.tau-axis-limit_warning_x.tau-cols-header,' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected.tau-axis-limit_warning_x.tau-rows-header, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected.tau-axis-limit_warning_x .first-row, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected.tau-axis-limit_warning_x .first-column, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected.tau-axis-limit_warning_y.tau-cols-header, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected.tau-axis-limit_warning_y.tau-rows-header, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected.tau-axis-limit_warning_y .first-row, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected.tau-axis-limit_warning_y .first-column', 'background: #525866 !important;');
            addCSSRule('.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected.tau-axis-limit_overhead_x.tau-cols-header,' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected.tau-axis-limit_overhead_x.tau-rows-header, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected.tau-axis-limit_overhead_x .first-row, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected.tau-axis-limit_overhead_x .first-column, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected.tau-axis-limit_overhead_y.tau-cols-header,' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected.tau-axis-limit_overhead_y.tau-rows-header,' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected.tau-axis-limit_overhead_y .first-row, ' +
                '.dark-TPtheme .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected.tau-axis-limit_overhead_y .first-column', 'background: #525866 !important;');
            addCSSRule('.tau-board-body-wrapper .tau-board-grid-view .tau-cellholder.tau-selected,' +
                '.tau-board-body-wrapper .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected .first-row,' +
                '.tau-board-body-wrapper .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-selected .first-colunm', 'background: #525866 !important;');

            addCSSRule('.tau-board-body-wrapper .tau-board-grid-view .tau-cellholder.tau-cellholder_dndcrossing_true,' +
                '.tau-board-body-wrapper .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-cellholder_dndcrossing_true .first-row,' +
                '.tau-board-body-wrapper .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder.tau-cellholder_dndcrossing_true', 'background: #525866 !important;');

            // Top bar and left menu
            addCSSRule('.apptio-styles.dark-TPtheme .app-header',
                '--FontColorDefault: ' + gFontColorDefaultRevert + ';' +
                '--FontColorGray: ' + gFontColorSecondaryRevert + ';' +
                '--IconsGeneralColor: ' + gFontColorDefaultRevert + ';' +
                '--PlaceholderColorDefault: ' + gFontColorSecondaryRevert + ';' +
                '--BackgroundDefault: ' + gBoardPanelBackgroundDarker + ';' +
                '--ControlBorderColorDefault: ' + gBorderColorTertiaryRevert + ';');
            addCSSRule('.apptio-styles.dark-TPtheme .tau-app-secondary-pane,' +
                '.apptio-styles.dark-TPtheme .system-menu',
                '--FontColorDefault: ' + gFontColorDefaultRevert + ';' +
                '--FontColorGray: ' + gFontColorSecondaryRevert + ';' +
                '--FontColorLightGray: ' + gFontColorTertiaryRevert + ';' +
                '--IconsGeneralColor: ' + gFontColorDefaultRevert + ';' +
                '--LeftMenuIconColor: ' + gFontColorDefaultRevert + ';' +
                '--PlaceholderColorDefault: ' + gFontColorSecondaryRevert + ';' +
                '--BackgroundDefault: #232428;' +
                '--BoardPanelBackgroundDarker: ' + gBoardPanelBackgroundDarker + ';' +
                '--BoardPanelBackgroundLighter: ' + gBoardPanelBackgroundLighter + ';' +
                '--BoardPanelBackgroundLighterHover: ' + gBoardPanelBackgroundLighterHover + ';' +
                '--Second50: ' + gBoardPanelBackgroundDarker + ';' +
                '--Second100: ' + gBoardPanelBackgroundLighterHover + ';' +
                '--HighlightBlockBorderColor: ' + gBoardPanelBackgroundDarkerBorder + ';' +
                '--ControlBorderColorDefault: ' + gBorderColorTertiaryRevert + ';' +
                '--ActionBackgroundHover: ' + gBoardPanelBackgroundLighterHover + ';' +
                '--ActionBackgroundSelected: ' + gBoardPanelBackgroundLighterHover + ';' +
                '--BoxShadowS: 0 8px 16px rgba(0, 0, 0, 0.45);' +
                '--LinkColor: #5585e9;' +
                '--ActionColorAdd: #5585e9;' +
                '--ActionColorAddLightTP: #5585e9;');
            addCSSRule('.apptio-styles.dark-TPtheme .t3-access-icon svg,' +
                '.apptio-styles.dark-TPtheme .t3-access-icon svg path',
                'fill: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule('.apptio-styles.dark-TPtheme .apptio-text-logo path',
                'fill: ' + gFontColorDefaultRevert + ';');
            addCSSRule('.apptio-styles.dark-TPtheme .app-header .tau-search--global .tau-search__left-icon',
                'opacity: 0.7;');

            // Left menu popups
            var gLeftMenuTokens = ['FontColorDefault', 'FontColorGray', 'FontColorLightGray', 'IconsGeneralColor',
                'LeftMenuIconColor', 'PlaceholderColorDefault', 'BackgroundDefault', 'BoardPanelBackgroundDarker',
                'BoardPanelBackgroundLighter', 'BoardPanelBackgroundLighterHover', 'Second50', 'Second100',
                'HighlightBlockBorderColor', 'ControlBorderColorDefault', 'ActionBackgroundHover',
                'ActionBackgroundSelected', 'BoxShadowS', 'LinkColor', 'ActionColorAdd', 'ActionColorAddLightTP'];
            addCSSRule('.apptio-styles.dark-TPtheme', gLeftMenuTokens.map(function(token) {
                return '--LightTheme' + token + ': var(--' + token + ');';
            }).join(''));
            addCSSRule('.apptio-styles.dark-TPtheme .tau-app-secondary-pane .recent-search__container,' +
                '.apptio-styles.dark-TPtheme .tau-app-secondary-pane .t3-add-list,' +
                '.apptio-styles.dark-TPtheme .tau-app-secondary-pane .t3-navigator-bubble',
                gLeftMenuTokens.map(function(token) {
                    return '--' + token + ': var(--LightTheme' + token + ');';
                }).join(''));

            // Top bar search without Apptio styles
            addCSSRule('.dark-TPtheme:not(.apptio-styles) .tau-search--global,' +
                '.dark-TPtheme:not(.apptio-styles) .tau-search--global .tau-search__wrap,' +
                '.dark-TPtheme:not(.apptio-styles) .tau-search--global .tau-search__left-icon,' +
                '.dark-TPtheme:not(.apptio-styles) .tau-search--global .tau-search__input',
                'background: ' + gBoardPanelBackgroundDarker + ' !important; color: ' + gFontColorDefaultRevert + ' !important; border-color: ' + gBorderColorTertiaryRevert + ' !important;');
            addCSSRule('.dark-TPtheme:not(.apptio-styles) .tau-search--global .tau-search__input::placeholder',
                'color: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule('.dark-TPtheme:not(.apptio-styles) .tau-search--global .tau-search__left-icon svg,' +
                '.dark-TPtheme:not(.apptio-styles) .tau-search--global .tau-search__left-icon path',
                'fill: rgba(255, 255, 255, 0.7) !important;');

            // Left menu filter button and Jump to search
            addCSSRule('.dark-TPtheme .tau-app-secondary-pane .filter-menu__button',
                'color: ' + gFontColorDefaultRevert + ' !important;');
            addCSSRule('.dark-TPtheme .tau-app-secondary-pane .filter-menu__button svg,' +
                '.dark-TPtheme .tau-app-secondary-pane .filter-menu__button svg path,' +
                '.dark-TPtheme .tau-app-secondary-pane .tau-btn-filter-menu svg,' +
                '.dark-TPtheme .tau-app-secondary-pane .tau-btn-filter-menu svg path,' +
                '.dark-TPtheme .tau-app-secondary-pane .tau-search--jump .tau-search__left-icon svg,' +
                '.dark-TPtheme .tau-app-secondary-pane .tau-search--jump .tau-search__left-icon path',
                'fill: ' + gFontColorSecondaryRevert + ' !important;');

            // View header icons
            addCSSRule('.dark-TPtheme .tau-board-header',
                '--IconsGeneralColor: rgba(255, 255, 255, 0.7);');
            addCSSRule('.dark-TPtheme .tau-board-header .boardsettings-filter__input,' +
                '.dark-TPtheme .tau-board-header .boardsettings-filter__more,' +
                '.dark-TPtheme .tau-board-header [class*="view-context-ui"]',
                '--IconsGeneralColor: initial;');
            addCSSRule('.apptio-styles.dark-TPtheme .tau-board-header .boardsettings-filter__input,' +
                '.apptio-styles.dark-TPtheme .tau-board-header .boardsettings-filter__more,' +
                '.apptio-styles.dark-TPtheme .tau-board-header [class*="view-context-ui"]',
                '--IconsGeneralColor: #212224;');

            // Quick filter input
            addCSSRule('.dark-TPtheme .tau-board-header [class*="dropdown__control"] input',
                'background: transparent !important; color: inherit !important; font-size: inherit !important;');

            // Quick filters
            addCSSRule('.dark-TPtheme [class*="user-filter-selector__control"]',
                'background: ' + gBoardCard + ' !important; color: ' + gFontColorDefaultRevert + ' !important; border-color: ' + gBorderColorTertiaryRevert + ' !important;');
            addCSSRule('.dark-TPtheme [class*="user-filter-selector"] .dropdown__single-value,' +
                '.dark-TPtheme [class*="user-filter-selector"] .dropdown__multi-value__label,' +
                '.dark-TPtheme [class*="user-filter-selector"] .dropdown__input,' +
                '.dark-TPtheme [class*="user-filter-selector"] .dropdown__input input',
                'color: ' + gFontColorDefaultRevert + ' !important;');
            addCSSRule('.dark-TPtheme [class*="user-filter-selector"] .dropdown__placeholder',
                'color: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule('.dark-TPtheme [class*="user-filter-selector__control"] input::placeholder',
                'color: ' + gFontColorSecondaryRevert + ' !important; opacity: 1;');
            addCSSRule('.dark-TPtheme [class*="user-filter-selector"] .dropdown__multi-value',
                'background: #60626a !important;');
            addCSSRule('.dark-TPtheme [class*="user-filter-selector"] .dropdown__multi-value__remove',
                'opacity: 0.6 !important;');
            addCSSRule('.dark-TPtheme [class*="user-filter-selector"] .dropdown__multi-value__remove:hover',
                'opacity: 1 !important;');
            addCSSRule('.dark-TPtheme [class*="user-filter-selector"] .dropdown__multi-value__remove path',
                'fill: ' + gFontColorDefaultRevert + ' !important;');
            addCSSRule('.dark-TPtheme [class*="user-filter-selector"] .dropdown__indicator-separator',
                'background-color: ' + gBorderColorTertiaryRevert + ' !important;');
            addCSSRule('.dark-TPtheme [class*="user-filter-selector"] .dropdown__indicator',
                'color: ' + gFontColorSecondaryRevert + ' !important;');

            // Dark list scopes
            var gDarkLists = ['.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) ',
                '.dark-TPtheme .flexible-list-view ', '.dark-TPtheme .tau-dashboard-widget '];
            var inDarkLists = function(targets) {
                var selectors = [];
                gDarkLists.forEach(function(context) {
                    targets.forEach(function(target) {
                        selectors.push(context + target);
                    });
                });
                return selectors.join(',');
            };

            // List paging
            addCSSRule(inDarkLists(['.tau-pages-navigator', '.tau-pages-navigator .i-role-cell-paging-link']),
                'color: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule(inDarkLists(['.tau-pages-navigator__icon svg', '.tau-pages-navigator__icon svg path']),
                'fill: ' + gFontColorSecondaryRevert + ' !important;');

            // Board and timeline scrollbars
            addCSSRule('.dark-TPtheme .tau-board-view .tau-grid',
                'scrollbar-color: #60626a ' + gBoardPanelBackgroundLighter + ';');
            addCSSRule('.dark-TPtheme .tau-timeline-canvas',
                'scrollbar-color: #60626a ' + gBoardPanelBackgroundLighter + ';');

            // Left menu filter button, active state
            addCSSRule('.dark-TPtheme .tau-app-secondary-pane .filter-menu__button .tau-btn-filter-menu--active svg,' +
                '.dark-TPtheme .tau-app-secondary-pane .filter-menu__button .tau-btn-filter-menu--active svg path',
                'fill: #2b66e3 !important;');

            // Dashboard quick filters toggle
            addCSSRule('.dark-TPtheme [class*="dashboard-actions__button"]',
                'background: ' + gBoardCard + ' !important; border-color: ' + gBorderColorTertiaryRevert + ' !important;');
            addCSSRule('.dark-TPtheme [class*="dashboard-actions__button"]:hover,' +
                '.dark-TPtheme [class*="dashboard-actions__button"]:active',
                'border-color: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule('.dark-TPtheme [class*="dashboard-actions__button"] svg,' +
                '.dark-TPtheme [class*="dashboard-actions__button"] svg path',
                'fill: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule('.dark-TPtheme .dashboard-actions__button--off',
                'position: relative;');
            addCSSRule('.dark-TPtheme .dashboard-actions__button--off:after',
                "content: ''; position: absolute; left: 50%; top: 50%; width: 20px; height: 2px;" +
                'background: ' + gFontColorDefaultRevert + '; box-shadow: 0 0 0 1.5px ' + gBoardCard + ';' +
                'transform: translate(-50%, -50%) rotate(-45deg); pointer-events: none;');

            // Card state guards
            var gPlainCard = ':not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated)';
            var gSkipLightCards = ':not(.i-role-card.tau-selected *):not(.i-role-card.i-role-encoded *)' +
                ':not(.i-role-card.tau-context-menu-selected *):not(.i-role-card.i-role-permanent-context-menu-action-activated *)';

            // Project badges
            var gDarkCardBadge = '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-project-abbreviation';
            addCSSRule(gDarkCardBadge + '[style*="color:#000000"]' + gSkipLightCards + ',' +
                gDarkCardBadge + '[style*="color: #000000"]' + gSkipLightCards,
                'color: ' + gFontColorDefaultRevert + ' !important;');

            // Card edit pencil and custom unit icons
            var gDarkCards = '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card' + gPlainCard + ' ';
            addCSSRule(gDarkCards + '.tau-board-unit__edit-value__button',
                'color: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule(gDarkCards + '.tau-board-unit__edit-value__button svg,' +
                gDarkCards + '.tau-board-unit__edit-value__button svg path,' +
                gDarkCards + 'svg[class*="CustomUnit"],' +
                gDarkCards + 'svg[class*="CustomUnit"] path,' +
                gDarkCards + '[class*="CustomUnit"] svg,' +
                gDarkCards + '[class*="CustomUnit"] svg path',
                'fill: ' + gFontColorSecondaryRevert + ' !important;');

            // Quick filter dropdown arrow
            addCSSRule('.dark-TPtheme [class*="user-filter-selector"] [class*="dropdown__indicator"] svg,' +
                '.dark-TPtheme [class*="user-filter-selector"] [class*="dropdown__indicator"] svg path',
                'fill: ' + gFontColorSecondaryRevert + ' !important;');

            // Flexible list
            var gMll = '.dark-TPtheme .flexible-list-view .tau-board-body > div:not(.tau-board-composite-view) ';
            addCSSRule(gMll + '.tau-card-v2:not(.tau-selected):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated),' +
                gMll + '.tau-list-entity',
                'background: ' + gBoardCard + ';');
            addCSSRule(gMll + '.tau-list-entity .tau-elems-cell',
                'border-right-color: ' + gFontColorTertiary + ';');
            addCSSRule(gMll + '.tau-list-entity:not(.i-role-encoded) .tau-elems-cell',
                'border-right-color: ' + gBoardPanelBackgroundDarker + ';');
            addCSSRule(gMll + '.tau-list-entity .tau-list-line',
                'border-top-color: ' + gFontColorTertiary + ';');
            addCSSRule(gMll + '.tau-list-entity:not(.i-role-encoded) .tau-list-line',
                'border-top-color: ' + gBoardPanelBackgroundDarker + ';');
            addCSSRule(gMll + '.tau-list-caption',
                'background-color: ' + gBoardPanelBackgroundDarker + '; color: ' + gFontColorSecondaryRevert + ';');
            addCSSRule(gMll + '.tau-list-caption .tau-cap',
                'color: ' + gFontColorDefaultRevert + ' !important;');
            addCSSRule(gMll + '.i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-elems-table > .tau-elems-cell > .tau-board-unit',
                'color: ' + gFontColorDefaultRevert + ';');
            addCSSRule(gMll + '.i-role-card:not(.tau-selected):not(.i-role-encoded):not(.tau-context-menu-selected):not(.i-role-permanent-context-menu-action-activated) .tau-elems-cell_unit-empty-text',
                'color: ' + gFontColorSecondaryRevert + ';');
            addCSSRule(gMll + '.tau-list-entity.tau-list-entity_final-state,' +
                gMll + '.tau-list-entity.tau-list-entity_isInPast',
                'background-color: inherit; opacity: 0.5;');
            addCSSRule(gMll + '.tau-page-items,' +
                gMll + '.tau-page-items .tau-count',
                'color: ' + gFontColorSecondaryRevert + ';');
            addCSSRule(gMll + '.tau-paging-info',
                'color: ' + gFontColorDefaultRevert + ';');
            var gMllCard = gMll + '.i-role-card' + gPlainCard + ' ';
            addCSSRule(gMllCard + '.tau-project-abbreviation[style*="color:#000000"],' +
                gMllCard + '.tau-project-abbreviation[style*="color: #000000"]',
                'color: ' + gFontColorDefaultRevert + ' !important;');
            addCSSRule(gMllCard + '.tau-board-unit__edit-value__button',
                'color: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule(gMllCard + '.tau-board-unit__edit-value__button svg,' +
                gMllCard + '.tau-board-unit__edit-value__button svg path,' +
                gMllCard + 'svg[class*="CustomUnit"],' +
                gMllCard + 'svg[class*="CustomUnit"] path,' +
                gMllCard + '[class*="CustomUnit"] svg,' +
                gMllCard + '[class*="CustomUnit"] svg path',
                'fill: ' + gFontColorSecondaryRevert + ' !important;');

            // Timeline refresh button
            addCSSRule('.dark-TPtheme [class*="refresh-histogram"] svg,' +
                '.dark-TPtheme [class*="refresh-histogram"] svg path',
                'fill: ' + gFontColorSecondaryRevert + ' !important;');

            // Dashboard widgets
            var gWg = '.dark-TPtheme .tau-dashboard-widget ';
            addCSSRule('.dark-TPtheme .tau-dashboard-widget,' +
                gWg + '.tau-dashboard-widget-content,' +
                gWg + '.tau-dashboard-widget-content-wrapper,' +
                gWg + '.tau-list-view-widget-adapter,' +
                gWg + '.tau-board',
                'background-color: ' + gBoardPanelBackgroundDarker + ' !important;');
            addCSSRule(gWg + '.tau-dashboard-widget-header',
                'color: ' + gFontColorDefaultRevert + ' !important;');
            addCSSRule(gWg + '.tau-dashboard-widget-header svg,' +
                gWg + '.tau-dashboard-widget-header svg path',
                'fill: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule(gWg + '.tau-list-entity' + gPlainCard + ',' +
                gWg + '.tau-card-v2' + gPlainCard,
                'background: ' + gBoardCard + ' !important;');
            addCSSRule(gWg + '.tau-list-entity .tau-list-line',
                'border-top-color: ' + gBoardPanelBackgroundDarker + ' !important;');
            addCSSRule(gWg + '.tau-list-entity .tau-elems-cell',
                'border-right-color: ' + gBoardPanelBackgroundDarker + ' !important;');
            addCSSRule(gWg + '.tau-list-caption',
                'background-color: ' + gBoardPanelBackgroundDarker + ' !important; color: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule(gWg + '.tau-list-caption .tau-cap',
                'color: ' + gFontColorDefaultRevert + ' !important;');
            var gWgCard = gWg + '.i-role-card' + gPlainCard + ' ';
            addCSSRule(gWgCard + '.tau-board-unit,' +
                gWgCard + '.tau-elems-cell',
                'color: ' + gFontColorDefaultRevert + ' !important;');
            addCSSRule(gWg + '.tau-page-items,' +
                gWg + '.tau-page-items .tau-count,' +
                gWg + '.tau-paging-info',
                'color: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule(gWgCard + '.tau-project-abbreviation[style*="color:#000000"],' +
                gWgCard + '.tau-project-abbreviation[style*="color: #000000"]',
                'color: ' + gFontColorDefaultRevert + ' !important;');
            addCSSRule(gWgCard + '.tau-board-unit__edit-value__button svg,' +
                gWgCard + '.tau-board-unit__edit-value__button svg path,' +
                gWgCard + 'svg[class*="CustomUnit"],' +
                gWgCard + 'svg[class*="CustomUnit"] path',
                'fill: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule(gWg + '.tau-timeline-canvas',
                'scrollbar-color: #60626a ' + gBoardPanelBackgroundLighter + ' !important;');
            // Roadmap widget
            addCSSRule(gWg + '.timeline-container,' +
                gWg + '.i-role-timeline-container',
                'background-color: ' + gBoardPanelBackgroundLighter + ' !important;');
            // Report widgets
            var gNotInReport = ':not(.tau-custom-report-widget-adapter *)';
            addCSSRule(gWg + '.tau-custom-report-widget-adapter',
                'background-color: var(--LightThemeBackgroundDefault, #fff) !important;');

            // Widget and flexible list text
            var gWidgetAndFlexLists = ['.dark-TPtheme .tau-dashboard-widget ', '.dark-TPtheme .flexible-list-view '];
            var plainCardText = function(targets) {
                var selectors = [];
                gWidgetAndFlexLists.forEach(function(context) {
                    targets.forEach(function(target) {
                        selectors.push(context + target + gSkipLightCards);
                    });
                });
                return selectors.join(',');
            };
            addCSSRule(plainCardText(['.tau-entity-full-name', '.click-edit__link-text',
                '.tau-board-unit_type_entity-name .tau-board-unit__value',
                '.tau-board-unit_type_entity-name-extended .tau-board-unit__value']),
                'color: ' + gFontColorDefaultRevert + ' !important;');
            addCSSRule(plainCardText(['.tau-id', '.tau-board-unit_type_id a', '.tau-counter']),
                'color: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule('.dark-TPtheme .flexible-list-view .tau-board-list-view__counter .tau-counter' + gSkipLightCards,
                'color: ' + gFontColorDefaultRevert + ' !important; border-color: ' + gFontColorTertiaryRevert + ' !important;');
            addCSSRule(plainCardText(['.tau-board-unit__points', '.tau-board-unit__value-remain']),
                'color: ' + gFontColorTertiaryRevert + ' !important;');
            addCSSRule(plainCardText(['.tau-elems-cell_unit-empty-text']),
                'color: ' + gFontColorSecondaryRevert + ' !important;');

            // Flexible list surroundings
            addCSSRule('.dark-TPtheme .flexible-list-view .tau-board-body',
                'background-color: ' + gBoardPanelBackgroundLighter + ' !important;');
            addCSSRule(gMll + '.tau-count.tau-active',
                'color: ' + gFontColorDefaultRevert + ' !important; background-color: ' + gBoardPanelBackgroundLighterHover + ' !important;');
            addCSSRule(gMll + '.tau-page-items .tau-count:hover',
                'color: ' + gFontColorDefaultRevert + ' !important;');
            addCSSRule('.dark-TPtheme .flexible-list-view .empty-list-placeholder__title,' +
                '.dark-TPtheme .flexible-list-view .preview-unavailable-list-placeholder__title',
                'color: ' + gFontColorDefaultRevert + ' !important;');
            addCSSRule('.dark-TPtheme .flexible-list-view .preview-unavailable-list-placeholder__subtitle',
                'color: ' + gFontColorSecondaryRevert + ' !important;');
            addCSSRule('.dark-TPtheme .flexible-list-view .preview-unavailable-list-placeholder path',
                'fill: ' + gFontColorSecondaryRevert + ' !important;');

            // Flexible list header
            addCSSRule('.dark-TPtheme .tau-flexible-list-header',
                'background: ' + gBoardPanelBackgroundLighter + ' !important; border-bottom-color: ' + gBoardPanelBackgroundDarkerBorder + ' !important;' +
                '--IconsGeneralColor: rgba(255, 255, 255, 0.7);');
            addCSSRule('.dark-TPtheme .tau-flexible-list-header .title [class*="field__field"]',
                'background: transparent !important; color: ' + gFontColorDefaultRevert + ' !important;');
            addCSSRule('.dark-TPtheme .tau-flexible-list-header .tau-btn,' +
                '.dark-TPtheme .tau-flexible-list-header .tau-board-header__control',
                'background: ' + gBoardCard + ' !important; border-color: ' + gBorderColorTertiaryRevert + ' !important;' +
                'color: ' + gFontColorSecondaryRevert + ' !important; font-size: 12px !important;');
            addCSSRule('.dark-TPtheme .tau-flexible-list-header .tau-btn:hover,' +
                '.dark-TPtheme .tau-flexible-list-header .tau-board-header__control:hover',
                'border-color: ' + gFontColorSecondaryRevert + ' !important;');

            // Flexible list setup
            addCSSRule('.dark-TPtheme .flexible-list-view .levels-setup-header',
                'background-color: var(--LightThemeBackgroundDefault, #fff) !important;');
            addCSSRule('.dark-TPtheme .flexible-list-view .levels-setup-area .boardsettings-filter__status--off',
                'color: var(--LightThemeFontColorLightGray, rgba(33, 34, 36, 0.4)) !important;');
            addCSSRule('.dark-TPtheme .tau-flexible-list-header .title button:not(.btn-non-edit-mode)',
                'background: ' + gBoardCard + ' !important; border-color: ' + gBorderColorTertiaryRevert + ' !important;');
            addCSSRule('.dark-TPtheme .tau-flexible-list-header .title button:not(.btn-non-edit-mode):hover',
                'border-color: ' + gFontColorSecondaryRevert + ' !important;');

            // Column header dividers
            gWidgetAndFlexLists.forEach(function(context) {
                addCSSRule(context + '.tau-board-list-cell-resizer--inner',
                    'background-color: ' + gBoardPanelBackgroundDarker + ' !important;');
                addCSSRule(context + '.tau-sorting__title',
                    'border-bottom-color: ' + gFontColorTertiaryRevert + ' !important;');
                addCSSRule(context + '.tau-sorting__title:hover',
                    'border-bottom-color: transparent !important; color: ' + gFontColorSecondaryRevert + ' !important;');
            });

            // Level expanders
            addCSSRule(inDarkLists(['.i-role-card-collapser svg' + gSkipLightCards, '.i-role-card-collapser svg path' + gSkipLightCards,
                '.i-role-header-collapser svg' + gSkipLightCards, '.i-role-header-collapser svg path' + gSkipLightCards]),
                'fill: ' + gFontColorSecondaryRevert + ' !important;');

            // Widget loading state
            addCSSRule(gWg + '.tau-dashboard-widget-placeholder:not(.tau-dashboard-widget-placeholder--success)' + gNotInReport + ',' +
                gWg + '.tau-loader' + gNotInReport + ',' +
                gWg + '.i-role-loader-hover' + gNotInReport,
                'background-color: ' + gBoardPanelBackgroundLighter + ' !important;');
            addCSSRule(gWg + '.tau-loader' + gNotInReport + ':after',
                'filter: invert(1);');
            addCSSRule(gWg + '.tau-dashboard-widget-placeholder-text' + gNotInReport,
                'color: ' + gFontColorSecondaryRevert + ' !important;');

            // Dashboard scrollbars
            addCSSRule('.dark-TPtheme .tau-dashboard-flexible-layout',
                'scrollbar-color: #60626a ' + gBoardPanelBackgroundLighter + ';');
            addCSSRule(gWg + '.tau-board-list-view__inner',
                'scrollbar-color: #60626a ' + gBoardPanelBackgroundDarker + ';');
        };

        topMenu.addItem('TV').onClick(function() {
            var $st = $(document).find('#tv-style');
            var d = new Date();
            d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
            var expires = ";expires=" + d.toUTCString();
            // If using https: proto, set secure cookie to protect against stealing via regular http: proto calls.
            var isHttps = window.location.protocol === 'https:';
            // Cookie only be transmitted over secure protocol like https.
            var secure = isHttps ? ';secure' : '';
            // SameSite prevents the browser from sending this cookie along with cross-site requests.
            // The strict value will prevent the cookie from being sent by the browser to the target
            // site in all cross-site browsing context, even when following a regular link.
            var sameSite = ";samesite=strict";

            if ($st.length) {
                document.cookie = "TPtheme=Light" + expires + secure + sameSite;
                $st.remove();
            } else {
                document.cookie = "TPtheme=Dark" + expires + secure + sameSite;
                init();
            }
        });

        function getCookie(cname) {
            var name = cname + "=";
            var themeCookies = document.cookie.split(';').filter(function(cookie) {
                return cookie.indexOf(name) >= 0;
            });

            // No such cookie found.
            if (themeCookies.length === 0) return '';

            // Cookie has format key=value.
            return themeCookies[0].split('=')[1];
        }

        init();
    });
