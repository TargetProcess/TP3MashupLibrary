tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tp3/mashups/topmenu')
    .addDependency('libs/jquery/jquery.ui.tauBubble')
    .addDependency('tau/core/templates-factory')
    .addDependency('tau/configurator')
    .addDependency('external-survey-mashup/config')
    .addMashup(function ($, _, topmenu, bubble, templates, configurator, config) {
        var htmlTemplateIcon = templates.register({
            name: 'external.survey.menu.item',
            engine: 'jqote2',
            markup: [
                '<div class="tau-main-menu__item i-role-mashup-header-default" id="external.survey.menu.item">',
                '<span class="tau-main-menu__item__icon t3-icon-container">',
                '<span class="tau-emoji-icon tau-emoji-icon--medium" style="background-position:37.5% 40%;" data-emoji=":clap:">',
                '</span>',
                '</span>',
                '</div>'
            ]
        });

        var htmlTemplatePopup = templates.register({
            name: 'external.survey.template.main',
            engine: 'jqote2',
            markup: [
                '<div>',
                '<h3><span><%= this.header %></span></h3>',
                '<p><span><%= this.text %></span></p>',
                '<p><a class="tau-external-link" href=<%= this.link %> target="_blank" id="<%= this.linkId %>"><%= this.linkLabel %></a></p>',
                '</div>'
            ]
        });

        var controller = {
            init: function (configurator, config, topmenu) {
                this._namespace = "external-survey-mashup";
                this._config = config;
                this._restStorage = configurator.getRestStorage();
                this._configurator = configurator;
                this._topmenu = topmenu;
                this._busRegistry = configurator.getBusRegistry();
                this._initDeferred();
            },

            _init: function (firstTime) {
                var user = this._configurator.getLoggedUser();
                this._email = user.email;
                var sysInfo = this._configurator.getSystemInfo();
                this._account = sysInfo.account;

                this._busRegistry.getByName('board.main.menu').done(function (bus) {
                    bus.once('afterRenderAll', function () {
                        this._setupBubble(firstTime);
                    }.bind(this));
                }.bind(this));
            },

            _setupBubble: function (animate) {
                var userVoiceIsHidden = false;
                var linkId = 'external-survey-link';
                var menuItem = this._topmenu.addItem({
                    title: 'Navigation survey',
                    html: htmlTemplateIcon.renderToString()
                });

                var $el = menuItem.$element;
                var $content = htmlTemplatePopup.render({
                    link: this._getLink(),
                    linkLabel: this._config.linkLabel,
                    linkId: linkId,
                    text: this._config.text,
                    header: this._config.header

                });

                var onShow = function () {
                    $('#' + linkId).click(this._saveShownFlag.bind(this));
                }.bind(this);

                var onHide = function () {
                    $('#' + linkId).unbind('click');
                };

                $el.tauBubble({
                    zIndex: 1000,
                    content: $content,
                    showEvent: 'empty',
                    hideEvent: 'empty',
                    onShow: onShow,
                    onHide: onHide,
                    className: "tau-warning-bubble"
                });

                menuItem.onClick(function () {
                    $el.tauBubble('toggle');
                });

                if (animate) {
                    $el.hide();
                    setTimeout(function () {
                        $el.show(1000);
                    }, 1000);
                }

                this._hideUserVoice(animate);
            },

            _hideUserVoice: function (animate) {
                if (this._config.hideUserVoice) {
                    setTimeout(function () {
                        if (animate) {
                            $('#uv-1').hide(1000);
                        }
                        else {
                            $('#uv-1').hide();
                        }
                    }, 1000);
                }
            },

            _saveShownFlag: function () {
                this._restStorage.data(this._namespace, this._config.clientStorageKey, {
                    scope: 'Public',
                    userData: { mashupWasShownAlready: true }
                });
            },

            _initDeferred: function () {
                this._restStorage
                    .select(this._namespace, {
                        $where: { key: this._config.clientStorageKey },
                        $fields: ['userData.mashupWasShownAlready']
                    })
                    .then(function (r) {
                        var firstTime = !r.data[0] || r.data[0].mashupWasShownAlready !== true;
                        if (!firstTime && this._config.doNotShowSecondTime) {
                            return;
                        }
                        this._init(firstTime);
                    }.bind(this));
            },

            _getLink: function () {
                if (!this._config.appendAccountAndEmailToLink) {
                    return;
                }
                return this._config.link
                    .replace('${' + this._config.emailLinkName + '}', this._config.emailLinkName + '=' + this._email)
                    .replace('${' + this._config.accountLinkName + '}', this._config.accountLinkName + '=' + this._account);
            }
        };

        controller.init(configurator, config, topmenu);
    });
