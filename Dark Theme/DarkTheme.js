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
            addCSSRule('.tau-btn-active-highlight', 'box-shadow: 0px 0px 5px 0px #FFE6B3; border-color: #FFF2B2 !important; color: #FFF2B2 !important;');
            addCSSRule('.tau-app-body > header, .tau-btn-add-bg', 'background: #14161a !important;');
            addCSSRule('.i-role-views-menu, .i-role-board-menu', 'border-right: 1px solid #1A1A1D !important;');
            addCSSRule('.tau-context-filter', 'background: #292c33 !important; box-shadow: none !important; padding: 2px 4px !important; margin-top: -1px !important; font-size: 12px !important; font-weight: 400 !important;');
            addCSSRule('.tau-board, .tau-board-header', 'background: #292c33 !important;');
            addCSSRule('.tau-board-header .tau-board-name', 'color: #fff !important; font-weight: 400 !important; letter-spacing: .2px !important;');
            addCSSRule('.tau-board-header .tau-btn, .tau-board-header input, .tau-board-header .boardsettings-filter__status--off, .tau-inline-group-nestedboardstoolbar .tau-btn, .tau-selection-counter', 'background: transparent !important; border-radius: 2px !important; border-color: #5c5f66 !important; font-weight: normal !important; text-shadow: none !important; color: #a1a7b3 !important; font-size: 12px !important');
            addCSSRule('.tau-board-header .tau-btn:hover, .tau-board-header input:hover, .tau-board-header .tau-checked', 'border-color: #fff !important; z-index: 10 !important;');
            addCSSRule('.tau-board-header .tau-boardsettings__filtertools', 'background: #292c33 !important; box-shadow: 0px 0px 4px #292c33 !important;');
            addCSSRule('.board-settings__header .board-settings-tabs', 'margin-left: 0px; !important;');
            addCSSRule('.ui-slider', 'height: 1px !important; border: none !important; background: #b4b9c3 !important;');
            addCSSRule('.ui-slider-handle', 'margin-top: -5px !important; background: #fff !important; border: 3px solid #292c33 !important; box-shadow: none !important; border-radius: 10px !important;');
            addCSSRule('.tau-board .tau-board-body-wrapper', 'border-top: none !important;');
            addCSSRule('.tau-axiscell__item .i-role-name, .tau-x-header .tau-label, .i-role-timeline-header-cell .tau-label, .tau-timeline-scale .i-role-timeline-header-cell .i-role-cell, .tau-period-label, .tau-boardclipboard-title, .tau-scale-ruler', 'color: #fff !important; text-shadow: none !important;');
            addCSSRule('.tau-axiscell__item .tau-label__text_current', 'color: rgba(255,255,255,0.7) !important; text-shadow: none !important;');
            addCSSRule('.tau-boardclipboard .i-role-action-clear', 'background: transparent !important; border-color: #555960 !important;');
            addCSSRule('.tau-boardclipboard', 'background: #3d424d !important; border: none !important;');
            addCSSRule('.tau-boardclipboard-title', 'font-weight: 400 !important; opacity: .9 !important;');
            addCSSRule('.i-role-axis-mark-selector', 'background: #989CA6 !important; border: none !important;');
            addCSSRule('.tau-cards-count span', 'color: rgba(0,0,0,0.7) !important; background: #ffffff !important; box-shadow: none !important;');
            addCSSRule('.tau-board-view .tau-grid .tau-cellholder , .tau-board-view .tau-cols-header .tau-cellholder, .tau-board-view .tau-cols-header, .tau-board-view .tau-rows-header, .tau-x-header, .tau-board-view .tau-rows-header .tau-cellholder, .tau-board-view .tau-backlog-body .tau-cellholder, .tau-board-view .tau-timeline .tau-cellholder, .tau-board-view .tau-backlog', 'border-color: #595C63 !important;');
            addCSSRule('.tau-board-grid-view .tau-cellholder.tau-selected, .tau-cellholder_dndcrossing_true', 'background: #3D424D !important;');
            addCSSRule('.tau-board-view .tau-cols-header>ul,.tau-board-grid-view .tau-grid>table', 'border-right: none !important;');
            addCSSRule('.t3-views-navigator, .tau-app-main-pane', 'background: #292c33 !important;');
            addCSSRule('.tau-app>.tau-app-body>.tau-app-main-pane', 'border-left: 2px solid #14161A !important;');
            addCSSRule('.tau-timeline>.tau-timeline-canvas>.tau-timeline-flow, ._tc-timeline-navigator:before, ._tc-timeline-navigator:after, ._tc-timeline-navigator>.tc-focus-range:before, ._tc-timeline-navigator>.tc-focus-range:after, ._tc-timeline-navigator', 'background: transparent !important;');
            addCSSRule('.tau-timeline .tau-timeline-card .tau-card-planner .tau-card-v2', 'background: rgba(255,255,255,0.7) !important;');
            addCSSRule('.t3-views-navigator>.t3-search', 'border: 1px solid #555960 !important;');
            addCSSRule('.t3-views-navigator .t3-group', 'background: #292c33 !important;');
            addCSSRule('.tau-sp-collapsed .t3-search, .tp3-active', 'border-color: transparent !important;');
            addCSSRule('.tau-sp-collapsed .t3-views-navigator>.t3-search', 'border-color: transparent !important;');
            addCSSRule('.tau-grid .tau-quick-add, .tau-timeline-grid .tau-quick-add, .tau-cols-header, .tau-rows-header, .tau-quick-add', 'background: transparent !important;');
            addCSSRule('.tau-grid .tau-quick-add button, .tau-timeline-grid .tau-quick-add button, .tau-cols-header .tau-quick-add button', 'background: #8fBf4d !important; border: none !important; box-shadow: none !important;');
            addCSSRule('.tau-feedback-btn', 'display: none !important;');
            addCSSRule('.tau-axis-limit_overhead_x.tau-cellholder, .tau-axis-limit_overhead_y.tau-cellholder', 'background: #594747 !important;');
            addCSSRule('.tau-axis-limit_warning_x.tau-cellholder, .tau-axis-limit_warning_y.tau-cellholder', 'background: #595247 !important;');
            addCSSRule('.t3-views-navigator .t3-view.t3-active .t3-header', 'background:#3d424d; !important;');
            addCSSRule('._tc-timeline-navigator>.tc-histogram:not(.tc-histogram-empty)', 'background: transparent !important; opacity: .5 !important; ');
            addCSSRule('.tau-board-grid-view .tau-cellholder.tau-selected.tau-selected_x.tau-selected_y', 'background: #525866 !important;');
            addCSSRule('.tau-selection-counter', 'background: transparent !important;');
            addCSSRule('.tau-selection-counter.tau-selected', 'background: #FFF2B2 !important;');
            addCSSRule('.tau-no-data-in-slice h2, .tau-no-data-in-slice .tau-txt', 'font-weight: 400 !important; color: #fff !important; text-shadow: none !important;');
            addCSSRule('.tau-card-v2_isInPast .tau-name, .tau-selected .tau-name, .tau-card-v2_type_build .tau-name', 'color: #000 !important;');
            addCSSRule('.i-role-timeline-planner-card-holder .tau-name', 'color: #ffffff !important;');
            addCSSRule('.tau-page-items, .tau-page-items .tau-count', 'color: #A1A7B3 !important;');
            addCSSRule('.tau-page-items .tau-count:hover', 'color: #fff !important;');
            addCSSRule('.tau-page-items .tau-count.tau-active', 'color: #fff !important; background: #989CA6 !important');
            addCSSRule('.tau-pages-navigator__text', 'color: #A1A7B3 !important;');
            addCSSRule('.tau-board-view .tau-label__date', 'color: #A1A7B3 !important; opacity: 1 !important');
            addCSSRule('.tau-board-view .tau-label__date_current .time-left', 'color: rgba(161,167,179,0.5) !important;');
            addCSSRule('.tau-board-view .tau-label__velocity, .tau-board-view .tau-label__effort', 'color: #A1A7B3 !important;');
            addCSSRule('.tau-paging-info', 'color: #fff !important; font-weight: 400 !important');
            addCSSRule('.boardsettings-filter__contener:after', 'background: #292c33 !important; box-shadow: none !important;');
            addCSSRule('.tau-cellholder .tau-label:after, .tau-x-header .tau-label:after, .tau-backlog-header .tau-label:after', 'box-shadow: none !important;');
            addCSSRule('.i-role-axis-item .tau-state', 'color: #A1A7B3 !important;');
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
    