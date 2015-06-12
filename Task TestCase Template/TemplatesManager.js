/**
 * @jsx React.DOM
 */

tau
    .mashups
    .addDependency('libs/react/react-ex')
    .addDependency('TaskTestCaseTemplate/TemplatesManagerRow')
    .addModule('TaskTestCaseTemplate/TemplatesManager', function(React, TemplatesManagerRow) {

        'use strict';

        var TemplatesManager = React.createClass({displayName: "TemplatesManager",

            componentDidMount: function() {

                this.updateHandler = function() {
                    this.forceUpdate();
                }.bind(this);

                this.props.store.on('update', this.updateHandler);
                this.props.store.read();
            },

            componentWillUnmount: function() {
                this.props.store.removeListener('update', this.updateHandler);
            },

            handleCreateTemplate: function() {
                this.props.store.createTemplate();
            },

            render: function() {

                var inner = this.props.store.items.map(function(v){
                    return (
                        React.createElement(TemplatesManagerRow, {key: v.key, item: v, store: this.props.store})
                    );
                }.bind(this));

                return (
                    React.createElement("div", {className: "templates-mashap"}, 
                        React.createElement("div", {className: "tm-add-btn tau-icons-general-before", onClick: this.handleCreateTemplate}, "Add template"), 
                        React.createElement("table", {className: "tm-grid"}, 
                            inner
                        )
                    )
                );
            }
        });

        return TemplatesManager;
    });
