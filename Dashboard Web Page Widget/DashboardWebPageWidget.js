tau.mashups
    .addDependency('jQuery')
    .addDependency('react')
    .addDependency('tau/configurator')
    .addMashup(function($, React, configurator) {
        var D = React.DOM;

        var WebpageWidget = React.createClass({
            displayName: 'tp_webpage_frame_mashup',
            propTypes: {
                url: React.PropTypes.string,
                height: React.PropTypes.string
            },
            render: function() {
                var url = this.props.url;
                if (!url) {
                    return D.span(null, 'Please specify the URL of the web page in the widget settings');
                }

                return D.iframe({
                    src: url,
                    frameBorder: 0,
                    target: '_parent',
                    style: {
                        width: '100%',
                        height: this.props.height + 'px'
                    }
                });
            }
        });

        var WidgetSettings = React.createClass({
            displayName: 'tp_webpage_frame_mashup.settings',
            propTypes: {
                initialUrl: React.PropTypes.string,
                initialHeight: React.PropTypes.number
            },
            getInitialState: function() {
                return {
                    url: this.props.initialUrl,
                    height: this.props.initialHeight
                };
            },

            _onUrlInputChange: function(e) {
                this.setState({ url: e.target.value });
            },

            _onHeightInputChange: function(e) {
                this.setState({ height: e.target.value });
            },

            render: function() {
                return D.ul(
                    { className: 'tau-widget-settings-list tau-widget-settings-list--col' },
                    D.li(
                        { className: 'tau-widget-settings-list__item' },
                        D.label(
                            null,
                            D.span(
                                { className: 'tau-widget-settings-list__title' },
                                'Link to the webpage'
                            ),
                            D.input({
                                className: 'tau-in-text tau-x-large',
                                type: 'url',
                                placeholder: 'e.g. http://example.com',
                                value: this.state.url,
                                onChange: this._onUrlInputChange
                            })
                        )
                    ),
                    D.li(
                        { className: 'tau-widget-settings-list__item' },
                        D.label(
                            null,
                            D.span(
                                { className: 'tau-widget-settings-list__title' },
                                'Widget height in pixels'
                            ),
                            D.input({
                                className: 'tau-in-text tau-x-large',
                                type: 'number',
                                placeholder: 'e.g. 600',
                                value: this.state.height,
                                onChange: this._onHeightInputChange
                            })
                        )
                    )
                );
            }
        });

        var appConfigurator;
        configurator.getGlobalBus().on('configurator.ready', function(evt, configurator) {
            if (!appConfigurator && configurator._id && configurator._id.match(/board/)) {
                appConfigurator = configurator;
                configurator.getDashboardWidgetTemplateRegistry().addWidgetTemplate({
                    id: 'tp_webpage_frame_mashup',
                    name: 'Web page',
                    description: 'Displays any web page',
                    tags: ['Mashups'],
                    defaultSettings: {
                        height: 400
                    },
                    insert: function(placeholder, settings) {
                        var props = {
                            url: settings.url,
                            height: settings.height
                        };

                        React.render(React.createElement(WebpageWidget, props), placeholder);
                    },
                    insertSettings: function(placeholder, settings) {
                        var props = {
                            initialUrl: settings.url,
                            initialHeight: settings.height
                        };

                        var renderedView = React.render(React.createElement(WidgetSettings, props), placeholder);
                        return function getCurrentWidgetSettings() {
                            var state = renderedView.state;
                            return {
                                url: state.url,
                                height: state.height
                            };
                        };
                    }
                });
            }
        });
    });
