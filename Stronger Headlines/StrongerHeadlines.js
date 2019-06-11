tau.mashups
    .addMashup(function() {
        'use strict';
        var initHeadlineTheme = function() {
            var style = document.createElement("style");
            style.setAttribute('id', 'headline-style');
            style.appendChild(document.createTextNode(""));
            document.head.appendChild(style);
            var sheet = style.sheet;
            var addCSSRule = function(selector, rules, index) { if (sheet.insertRule) { sheet.insertRule(selector + "{" + rules + "}", index); } else { sheet.addRule(selector, rules, index); }};
            
            // Modify Headlines
            addCSSRule(".markdown-editor.i-role-preview"            ,"padding-left:2em !important");
            addCSSRule(".ui-description__inner , .cke_editable"     ,"padding-left:2em !important");
            addCSSRule(".tau-page-entity h1"                        ,"width:100%;box-shadow:rgba(0, 0, 0, 0.5) -1px -4px 3px -3px;margin-top:1em !important;margin-left:-1em !important;padding-top:1em !important;");
            addCSSRule(".tau-page-entity h2"                        ,"margin-top:1em;color:#333 !important;font-style:normal;text-decoration:underline dotted;margin-left:-0.5em !important; ");
        };
     
        // comment the following line to prevent auto-apply
        initHeadlineTheme();
    });
