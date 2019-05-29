tau.mashups
    .addDependency('jQuery')
    .addMashup(function($, config) {

        $(document).ready( function(){

            var css = "";
            css += ".markdown-editor.i-role-preview  { padding-left:2em !important}";
            css += ".ui-description__inner, .cke_editable {padding-left:2em !important}";
            css += " h1 {  width:100%;box-shadow:rgba(0, 0, 0, 0.5) -1px -4px 3px -3px;margin-top:1em !important;margin-left:-1em !important;padding-top:1em !important;}";
            css += " h2 { margin-top:1em;color:#333 !important;font-style:normal;text-decoration:underline dotted;margin-left:-0.5em !important; }";
            //css += "pre { background:yellow !important} ";
            //css += ".hljs{display:block;overflow-x:auto;padding:0.5em;background:#F0F0F0}.hljs,.hljs-subst{color:#444}.hljs-comment{color:#888888}.hljs-keyword,.hljs-attribute,.hljs-selector-tag,.hljs-meta-keyword,.hljs-doctag,.hljs-name{font-weight:bold}.hljs-type,.hljs-string,.hljs-number,.hljs-selector-id,.hljs-selector-class,.hljs-quote,.hljs-template-tag,.hljs-deletion{color:#880000}.hljs-title,.hljs-section{color:#880000;font-weight:bold}.hljs-regexp,.hljs-symbol,.hljs-variable,.hljs-template-variable,.hljs-link,.hljs-selector-attr,.hljs-selector-pseudo{color:#BC6060}.hljs-literal{color:#78A960}.hljs-built_in,.hljs-bullet,.hljs-code,.hljs-addition{color:#397300}.hljs-meta{color:#1f7199}.hljs-meta-string{color:#4d99bf}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:bold}";

            var htmlDiv = document.createElement('div');
            htmlDiv.innerHTML = '<p>&nbsp;</p><style>' + css + '</style>';
            document.getElementsByTagName('head')[0].appendChild(htmlDiv.childNodes[1]);

            // console.log('addes rules')
        });
    });