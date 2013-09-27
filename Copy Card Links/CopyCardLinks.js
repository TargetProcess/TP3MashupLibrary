tau.mashups
    .addDependency('jQuery')
    .addDependency('tau/service.container')
    .addDependency('Underscore')
    .addMashup(function($, Configurator, _) {
        $('body').append('<div class="hidden-block-for-clipboard"></div>');

        var $clipboard = $('.hidden-block-for-clipboard').css({
            position: 'fixed',
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            zIndex: 100,
            display: 'none',
            opacity: 0
        });

        function createForm() {
            return  $('<textarea class="hidden-block-for-clipboard-area"></textarea>').css({
                width: '1px',
                height: '1px',
                padding: 0
            });
        }


        $(document).on('keydown', function(e) {

            if (!(e.ctrlKey || e.metaKey)) {
                return;
            }
            if ($(e.target).is("input:visible,textarea:visible") || $(e.target).prop('contenteditable') !== 'inherit') {
                return;
            }


            var getSelection = window.getSelection;
            if (getSelection && getSelection() && getSelection().toString()) {
                return;
            }


            var selection = document.selection;
            if (selection && selection.createRange() && selection.text) {
                return;
            }


            var configurator = new Configurator();
            var $cards = $('.i-role-card.tau-selected');
            var urls = _.chain($cards).map(function(card) {
                var id = $(card).data('entityId');
                var url = configurator.getUrlBuilder().getShortViewUrl({id: id});
                return url;
            }).uniq().value();

            if (urls.length !== 0) {
                $clipboard.empty().show();
                createForm()
                    .val(urls.join("\n"))
                    .appendTo($clipboard)
                    .focus()
                    .select();
            }


        });
        $(document).on('keyup', function(e) {
            if ($(e.target).hasClass('hidden-block-for-clipboard-area')) {
                $clipboard.empty().hide();
            }
        });
    });