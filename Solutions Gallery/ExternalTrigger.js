define("ViewGallery/ExternalTrigger",function(require,exports,module){

/**
 * @jsx React.DOM
 */

var React = require('react');
var cx = React.addons.classSet;

var ExternalTrigger = React.createClass({displayName: 'ExternalTrigger',

    componentDidMount: function() {

        this.listener = function() {
            this.forceUpdate();
        }.bind(this);

        this.props.store.on('change', this.listener);
    },

    componentWillUnmount: function() {
        this.props.store.removeListener('change', this.listener);
    },

    render: function() {

        var isActive = this.props.store.isActive;
        var className = cx({
            't3-view t3-grid vg-externaltrigger': true,
            'vg-externaltrigger-disabled': !isActive
        });

        return (
            React.DOM.div({className: className}, 
                React.DOM.div({className: "t3-header", onClick: this.handleClick}, 
                    React.DOM.i({className: "vg-icon vg-icon-gallery"}), 
                    React.DOM.div({className: "t3-name vg-externaltrigger__name"}, 
                        this.props.children || 'Browse Solutions Gallery'
                    )
                )
            )
        );
    },

    handleClick: function() {
        this.props.store.activate();
    }
});

module.exports = ExternalTrigger;

return module.exports;

});
