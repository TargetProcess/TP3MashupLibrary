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

            var gFontColorDefault = "rgba(0,0,0,1)";
            var gFontColorSecondary = "rgba(0,0,0,0.6)";
            var gFontColorTertiary = "rgba(0,0,0,0.3)";


            // INVERTED CARDS and UNITS with working visual encoding, made for board/board list/timeline view (not for inner lists and one-by-one view)
            // Units
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-card-v2.tau-card-v2_final-state', 'opacity: 0.5;');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-entity-full-name,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-board-unit__value-milestone-flexbox-wrapper__name,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-board-unit_type_user-info__name,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-board-unit_type_team_allocation-info__name,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-board-unit_type_entity-name .tau-board-unit__value,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-board-unit_type_entity-name-extended .tau-board-unit__value,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-board-unit_type_entity-name-extended-plus .tau-board-unit__value,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .click-edit__link-text,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-project-abbreviation', 'color: ' + gFontColorDefaultRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board .tau-board-body > div:not(.tau-board-composite-view) .tau-card-v2:not(.tau-selected):not(.i-role-encoded) .tau-board-unit,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-board-unit__value-milestone-flexbox-wrapper__date,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-board-unit__points--dark,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-board-unit_type_id a,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-board-unit_type_entity-icon-id a,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-board-unit_type_process a,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-board-unit_type_emoji-tags__others-counter', 'color: ' + gFontColorSecondaryRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-board-unit__points,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-board-unit__value-remain', 'color: ' + gFontColorTertiaryRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-board-unit__points', 'color: ' + gFontColorTertiaryRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-project-abbreviation', 'border-color: ' + gFontColorTertiaryRevert + ';');

            // Cards and list
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-card-v2:not(.tau-selected)', 'background: ' + gBoardCard + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-entity', 'background: ' + gBoardCard + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-entity .tau-elems-cell', 'border-right-color: ' + gFontColorTertiary + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-entity:not(.i-role-encoded) .tau-elems-cell', 'border-right-color: ' + gBoardPanelBackgroundDarker + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-board-list-cell-resizer--inner', 'background-color: ' + gBoardPanelBackgroundDarker + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-sorting__title', 'border-bottom-color: ' + gFontColorTertiaryRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-more__inner', 'background: none;');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-more__inner:before, ' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-more__inner:after', 'display: none;');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-caption', 'background-color: #636469; color: ' + gFontColorSecondaryRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-level-0:last-child > .tau-list-level-cardsholder > .tau-list-entity:last-child > .tau-list-line', 'border-bottom-color: ' + gBoardPanelBackgroundDarker + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-entity .tau-list-line', 'border-top-color: ' +  gFontColorTertiary + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-entity:not(.i-role-encoded) .tau-list-line', 'border-top-color: ' + gBoardPanelBackgroundDarker + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-elems-table > .tau-elems-cell > .tau-board-unit', 'color: ' + gFontColorDefaultRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .i-role-card:not(.tau-selected):not(.i-role-encoded) .tau-board-list-view__counter .tau-counter', 'color: ' + gFontColorDefaultRevert + '; border-color: ' + gFontColorTertiaryRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-entity.tau-list-entity_final-state, ' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-list-entity.tau-list-entity_isInPast', 'background-color: inherit; opacity: 0.5;');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-page-items,' +
                '.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-page-items .tau-count', 'color:' + gFontColorSecondaryRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-page-items .tau-count:hover', 'color:' + gFontColorDefaultRevert + '!important;');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-count.tau-active', 'color:' + gFontColorDefaultRevert + '!important; background-color: ' + gBoardPanelBackgroundLighterHover + '!important');
            addCSSRule('.dark-TPtheme .tau-board-body-wrapper > .tau-board-body > div:not(.tau-board-composite-view) .tau-paging-info', 'color: '+ gFontColorDefaultRevert + ';');
            addCSSRule('.dark-TPtheme .tau-board-list-view .tau-list-entity:hover, .dark-TPtheme .tau-board-list-view .tau-card_focusedit_true', 'opacity: 0.8;');

            // Board
            addCSSRule('.tau-app-body > header, .general-add-button-holder', 'background:' + gBoardPanelBackgroundDarker + '!important; border-bottom: 1px solid ' + gBoardPanelBackgroundDarkerBorder +  '!important;');
            addCSSRule('.i-role-views-menu, .i-role-board-menu', 'border-right: 1px solid ' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-bubble-tooltip .tau-bubble-board__inner', 'background:' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-bubble-tooltip .tau-bubble-board__arrow:after', 'background:' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-board-header .context-filter__body, .tau-board-header .context-filter__revert-control, .tau-board-header .tau-btn, .tau-board-header input, .tau-boardclipboard .tau-btn, .tau-boardclipboard .i-role-action-clear, .refresh-histogram__control .tau-btn', 'background: transparent !important; border-color:' + gFontColorSecondaryRevert+ '!important; color: ' + gFontColorSecondaryRevert +' !important; font-size: 12px !important');
            addCSSRule('.context-filter__body:hover ', 'border-color:' + gFontColorDefaultRevert + '!important;');
            addCSSRule('.context-filter__projects:first-child:after, .context-filter__teams:first-child:after', 'background: ' + gFontColorSecondaryRevert + '!important;');
            addCSSRule('.boardsettings-filter__status--off', 'color: ' + gFontColorTertiaryRevert + '!important;');
            addCSSRule('.tau-board, .tau-board-header', 'background:' + gBoardPanelBackgroundLighter + '!important;');
            addCSSRule('.tau-board-header', 'border-bottom-color:' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-board-header .tau-board-name', 'color: ' + gFontColorDefaultRevert + '!important;');
            addCSSRule('.tau-board-name--hovering:after', 'border-bottom-color: ' + gFontColorDefaultRevert + '!important;');
            addCSSRule('.tau-board-header .tau-btn:hover, .tau-board-header input:hover, .tau-board-header .tau-checked, .tau-boardclipboard .tau-btn:hover', 'border-color: ' + gFontColorDefaultRevert + '!important;');
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
            addCSSRule('.tau-board .tau-customReport-body-wrapper', 'background:' + gBoardPanelBackgroundLighter + '!important; color:' + gFontColorSecondaryRevert + '!important;');
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
            addCSSRule('.dark-TPtheme .tau-timeline .tau-timeline-card .tau-card-planner .tau-card-v2', 'background: rgba(255, 255, 255, 0.05) !important');
            addCSSRule('.dark-TPtheme .tau-timeline > .tau-timeline-canvas > .tau-timeline-flow .tau-timeline-track > .tau-timeline-card > .tau-card-planner .tau-end-date', 'border-color: ' + gFontColorDefaultRevert + ';');
            addCSSRule('.dark-TPtheme .tau-timeline > .tau-timeline-canvas > .tau-timeline-flow .tau-timeline-track > .tau-timeline-card > .tau-card-planner', 'border-color: ' + gFontColorDefaultRevert + ';');
            addCSSRule('.dark-TPtheme .tau-timeline > .tau-timeline-canvas > .tau-timeline-flow .tau-timeline-track > .tau-timeline-card > .tau-card-predictor', 'background-color: #3d4046;');
            addCSSRule('.dark-TPtheme .tau-board-grid-view:not(.tau-ui-size-min):not(.tau-ui-size-xl) .tau-show-more-cards-trigger,' +
                '.dark-TPtheme .tau-board-grid-view:not(.tau-ui-size-min):not(.tau-ui-size-xl) .tau-show-more-cards-trigger:before,' +
                '.dark-TPtheme .tau-board-grid-view:not(.tau-ui-size-min):not(.tau-ui-size-xl) .tau-show-more-cards-trigger:after', 'background-color: ' + gBoardCard + ';');
            addCSSRule('.dark-TPtheme .tau-show-more-cards-trigger button', 'color: ' + gFontColorDefaultRevert + ';')
            addCSSRule('.tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder .first-column', 'background: linear-gradient(to right, ' + gBoardPanelBackgroundLighter + ',' + gBoardPanelBackgroundLighter + ', rgba(41,44,51,0)) !important;');
            addCSSRule('.tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder .first-row', 'background: linear-gradient(' + gBoardPanelBackgroundLighter + ',' + gBoardPanelBackgroundLighter + ', rgba(41,44,51,0)) !important;');
            addCSSRule('.tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cellholder:after', 'border-color: ' + gBoardPanelBackgroundDarkerBorder + '!important;');
            addCSSRule('.tau-board-body-single-level-grid .tau-board-single-level-grid .tau-cols-header, .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-rows-header, .tau-board-body-single-level-grid .tau-board-single-level-grid .tau-x-header', 'background-color: ' + gBoardPanelBackgroundLighter + '!important;');

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
