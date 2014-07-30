tau
    .mashups
    .addDependency('tp3/mashups/topmenu')
    .addMashup(function(topMenu) {

        'use strict';

        var init = function() {

            var style = document.createElement("style");
            style.setAttribute('id', 'tv-style');
            style.appendChild(document.createTextNode(""));

            document.head.appendChild(style);

            var sheet = style.sheet;

            var addCSSRule = function(selector, rules, index) {
                if (sheet.insertRule) {
                    sheet.insertRule(selector + "{" + rules + "}", index);
                } else {
                    sheet.addRule(selector, rules, index);
                }
            };

            // add rules here
            // add !important to make sure default rules will be overwritten
            // addCSSRule('.i-role-card .tau-name', 'color: yellow !important;');
            addCSSRule('.tau-btn-active-highlight', 'box-shadow: 0px 0px 5px 0px #FFE6B3; border-color: #FFF2B2 !important; color: #FFF2B2 !important;');
            addCSSRule('.tau-app-body > header, .tau-btn-add-bg', 'background: #14161a !important;');
            addCSSRule('.tau-context-filter', 'background: #292c33 !important; box-shadow: none !important; padding: 2px 4px !important; margin-top: -1px !important; font-size: 12px !important; font-weight: 400 !important;');
            addCSSRule('.tau-quick-add', 'background: #8fBf4d !important; box-shadow: none !important; border: none !important; padding: 2px !important;');
            addCSSRule('.tau-quick-add span', 'font-size: 13px !important; text-shadow: 0px 1px 0px rgba(0,0,0,0.20) !important;');
            addCSSRule('.tau-quick-add span::before', 'display: none !important;');
            addCSSRule('.tau-board', 'background: #292c33 !important;');
            addCSSRule('.tau-board-header .tau-board-name', 'color: #fff !important; font-weight: 400 !important; letter-spacing: .2px !important;');
            addCSSRule('.tau-board-header .tau-btn, .tau-board-header input, .tau-inline-group-nestedboardstoolbar .tau-btn, .tau-selection-counter', 'background: transparent !important; border-radius: 2px !important; border-color: #5c5f66 !important; font-weight: normal !important; text-shadow: none !important; color: #a1a7b3 !important; font-size: 12px !important; height: 26px !important; line-height: 18px !important;');
            addCSSRule('.tau-board-header .tau-btn:hover, .tau-board-header input:hover, .tau-board-header .tau-checked', 'border-color: #fff !important; z-index: 10 !important;');
            addCSSRule('.tau-board-header .tau-boardsettings__filtertools', 'background: #292c33 !important; box-shadow: 0px 0px 4px #292c33 !important;');
            addCSSRule('.ui-slider', 'height: 1px !important; border: none !important; background: #b4b9c3 !important;');
            addCSSRule('.ui-slider-handle', 'margin-top: -5px !important; background: #fff !important; border: 3px solid #292c33 !important; box-shadow: none !important; border-radius: 10px !important;');
            addCSSRule('.tau-board .tau-board-body-wrapper', 'border-top: none !important;');
            addCSSRule('.tau-axiscell__item .i-role-name, .tau-x-header .tau-label, .i-role-timeline-header-cell .tau-label, .tau-timeline-scale .i-role-timeline-header-cell .i-role-cell, .tau-period-label, .tau-boardclipboard-title, .tau-scale-ruler', 'color: #fff !important; text-shadow: none !important;');
            addCSSRule('.tau-boardclipboard-title', 'font-weight: 400 !important; font-size: 12px !important; opacity: .9 !important;');
            addCSSRule('.i-role-axis-mark-selector', 'background: #989CA6 !important; border: none !important;');
            addCSSRule('.tau-cards-count span', 'background: #292c33 !important; border: none !important;');
            addCSSRule('.tau-board-view .tau-grid .tau-cellholder , .tau-board-view .tau-cols-header .tau-cellholder, .tau-board-view .tau-cols-header, .tau-board-view .tau-rows-header, .tau-x-header, .tau-board-view .tau-rows-header .tau-cellholder, .tau-board-view .tau-backlog-body .tau-cellholder, .tau-board-view .tau-timeline .tau-cellholder, .tau-board-view .tau-backlog', 'border-color: #595C63 !important;');
            addCSSRule('.tau-board-grid-view .tau-cellholder.tau-selected, .tau-cellholder_dndcrossing_true', 'background: #3D424D !important;');
            addCSSRule('.tau-board-view .tau-cols-header>ul,.tau-board-grid-view .tau-grid>table', 'border-right: none !important;');
            addCSSRule('.tau-boardclipboard', 'background: #3d424d !important; border: none !important; padding-bottom: 34px !important; bottom: 0px !important;');
            addCSSRule('.t3-views-navigator, .tau-app-main-pane', 'background: #292c33 !important;');
            addCSSRule('.tau-app>.tau-app-body>.tau-app-main-pane', 'border-left: 2px solid #14161A !important;');
            addCSSRule('.tau-timeline>.tau-timeline-canvas>.tau-timeline-flow, ._tc-timeline-navigator:before, ._tc-timeline-navigator:after, ._tc-timeline-navigator>.tc-focus-range:before, ._tc-timeline-navigator>.tc-focus-range:after, ._tc-timeline-navigator', 'background: transparent !important;');
            addCSSRule('.t3-views-navigator>.t3-search', 'border: 1px solid #555960 !important;');
            addCSSRule('.tau-sp-collapsed .t3-search, .tp3-active', 'border-color: transparent !important;');
            addCSSRule('.tau-sp-collapsed .t3-views-navigator>.t3-search', 'border-color: transparent !important;');
            addCSSRule('.tau-grid .tau-quick-add, .tau-timeline-grid .tau-quick-add, .tau-cols-header .tau-quick-add', 'background: transparent !important;');
            addCSSRule('.tau-grid .tau-quick-add button, .tau-timeline-grid .tau-quick-add button, .tau-cols-header .tau-quick-add button', 'background: #8fBf4d !important; border: none !important; box-shadow: none !important;');
            addCSSRule('.tau-feedback-btn', 'display: none !important;');
            addCSSRule('.tau-axis-limit_overhead_x.tau-cellholder, .tau-axis-limit_overhead_y.tau-cellholder', 'background: #594747 !important;');
            addCSSRule('.tau-axis-limit_warning_x.tau-cellholder, .tau-axis-limit_warning_y.tau-cellholder', 'background: #595247 !important;');
            addCSSRule('.tau-board>.tau-board-header>.tau-btn', 'margin-top: 14px !important;');
            addCSSRule('.t3-views-navigator .t3-view.t3-active .t3-header', 'background:#3d424d; !important;');
            addCSSRule('._tc-timeline-navigator>.tc-histogram:not(.tc-histogram-empty)', 'background: transparent !important; opacity: .5 !important; ');
            addCSSRule('.tau-board-grid-view .tau-cellholder.tau-selected.tau-selected_x.tau-selected_y', 'background: #525866 !important;');
            addCSSRule('.tau-selection-counter', 'background: transparent !important;');
            addCSSRule('.tau-selection-counter.tau-selected', 'background: #FFF2B2 !important;'); 
            addCSSRule('.tau-boardclipboard .i-role-action-clear', 'height: 26px !important; border-radius: 2px !important; background: transparent !important; border-color: #555960 !important;');
            addCSSRule('.tau-boardclipboard .i-role-action-clear::before', 'top: 9px !important;');
            addCSSRule('.tau-no-data-in-slice h2, .tau-no-data-in-slice .tau-txt', 'font-weight: 400 !important; color: #fff !important; text-shadow: none !important;');
            addCSSRule('.tau-card-v2_isInPast .tau-name, .tau-selected .tau-name, .tau-card-v2_type_build .tau-name', 'color: #000 !important;');
            addCSSRule('.i-role-timeline-planner-card-holder .tau-name', 'color: #ffffff !important;');
            addCSSRule('.tau-btn.tau-close:before', 'background-position: -909px -107px !important;');
            addCSSRule('.tau-page-items, .tau-page-items .tau-count', 'color: #A1A7B3 !important;');
            addCSSRule('.tau-page-items .tau-count:hover', 'color: #fff !important;');
            addCSSRule('.tau-page-items .tau-count.tau-active', 'color: #fff !important; background: #989CA6 !important');
            addCSSRule('.tau-board-view .tau-label__date', 'color: #A1A7B3 !important; opacity: 1 !important');
            addCSSRule('.tau-board-view .tau-label__velocity, .tau-board-view .tau-label__effort', 'color: #A1A7B3 !important;');
            addCSSRule('.tau-paging-info', 'color: #fff !important; font-weight: 400 !important');
            
        };
        topMenu.addItem('TV').onClick(function() {
            var $st = $(document).find('#tv-style');
            if ($st.length) {
                $st.remove();
            } else {
                init();
            }
        });

    });
