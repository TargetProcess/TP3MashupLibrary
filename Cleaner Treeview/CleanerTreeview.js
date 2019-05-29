tau.mashups
    .addDependency('jQuery')
    .addMashup(function($, config) {

        $(document).ready( function(){

            var css = "";
            css += ".tau-list-caption > .tau-elems-table:not(.tau-elems-table-level-0)  { opacity:0; height:1px; }";
            css += ".i-role-cardsholder:not(:hover) :not(.tau-list-time) > .tau-list-line > .tau-elems-table  .tau-elems-cell:not(.tau-elems-cell--details-trigger):not(:nth-child(1)):not(:nth-child(2)):not(.tau-list-state_full_length-cell) { opacity: 0;}";

            var htmlDiv = document.createElement('div');
            htmlDiv.innerHTML = '<p>&nbsp;</p><style>' + css + '</style>';
            document.getElementsByTagName('head')[0].appendChild(htmlDiv.childNodes[1]);
        });
    });