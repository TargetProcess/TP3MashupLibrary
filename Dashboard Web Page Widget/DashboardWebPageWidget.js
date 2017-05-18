tau.mashups
    .addDependency('jQuery')
    .addDependency('react')
    .addDependency('react-dom')
    .addDependency('tau/configurator')
    .addMashup(function($, React, ReactDOM, configurator) {
        var PropTypes = React.PropTypes;

        var WebpageWidget = React.createClass({
            displayName: 'tp_webpage_frame_mashup',
            propTypes: {
                url: PropTypes.string,
                height: PropTypes.number,
            },
            render: function() {
                var url = this.props.url;

                if (!url) {
                    return React.createElement(
                        'span',
                        null,
                        'Please specify the URL of the web page in the widget settings'
                    );
                }

                return React.createElement('iframe', {
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
                initialUrl: PropTypes.string,
                initialHeight: PropTypes.number
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
                this.setState({ height: parseInt(e.target.value || '0') });
            },
r
            render: function() {
                return React.createElement('ul',
                    { className: 'tau-widget-settings-list tau-widget-settings-list--col' },
                    React.createElement('li',
                        { className: 'tau-widget-settings-list__item' },
                        React.createElement('label',
                            null,
                            React.createElement('span',
                                { className: 'tau-widget-settings-list__title' },
                                'Link to the webpage'
                            ),
                            React.createElement('input', {
                                className: 'tau-in-text tau-x-large',
                                type: 'url',
                                placeholder: 'e.g. http://example.com',
                                value: this.state.url,
                                onChange: this._onUrlInputChange
                            })
                        )
                    ),
                    React.createElement('li',
                        { className: 'tau-widget-settings-list__item' },
                        React.createElement('label',
                            null,
                            React.createElement('span',
                                { className: 'tau-widget-settings-list__title' },
                                'Widget height in pixels'
                            ),
                            React.createElement('input', {
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

                        ReactDOM.render(React.createElement(WebpageWidget, props), placeholder);
                    },
                    insertSettings: function(placeholder, settings) {
                        var props = {
                            initialUrl: settings.url,
                            initialHeight: settings.height
                        };

                        var renderedView = ReactDOM.render(React.createElement(WidgetSettings, props), placeholder);
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
