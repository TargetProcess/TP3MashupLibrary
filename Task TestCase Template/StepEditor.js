/**
 * @jsx React.DOM
 */

tau
    .mashups
    .addDependency('react')
    .addDependency('TaskTestCaseTemplate/StepEditorRow')
    .addModule('TaskTestCaseTemplate/StepEditor', function(React, StepEditorRow) {

        'use strict';

        var cx = React.addons.classSet;

        var StepEditor = React.createClass({displayName: 'StepEditor',

            getDefaultProps: function() {
                return {
                    store: null
                };
            },

            getInitialState: function() {
                return {
                    isDragging: false
                };
            },

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

            sort: function(steps, lastMovedTo) {
                this.props.store.reorderSteps(steps, lastMovedTo);
            },

            render: function() {

                var dragData = {
                    items: this.props.store.items,
                    dragging: this.props.store.lastMovedTo
                };

                var steps = this.props.store.items.map(function(v, k) {
                    return (
                        StepEditorRow({key: k, item: v, data: dragData, store: this.props.store, 
                            sort: this.sort})
                    );
                }.bind(this));

                var header;

                if (steps.length) {

                    var className = cx({
                        'tm-stepeditor__inner': true,
                        'tm-stepeditor__inner-dragging': this.state.isDragging
                    });

                    header = (
                        React.DOM.table(null, 
                            React.DOM.tr({className: "tm-stepeditor__header"}, 
                                React.DOM.th(null, "Step"), 
                                React.DOM.th(null, "Result"), 
                                React.DOM.th({style: {width: 57}})
                            ), 
                            React.DOM.tbody({className: className, 
                                onDragOver: this.handleDragOver, 
                                onDrop: this.handleDrop}, 
                                steps
                            )
                        )
                    );
                }

                return (
                    React.DOM.div({className: "tm-stepeditor"}, 
                        header, 
                        React.DOM.button({className: "tau-btn", onClick: this.handleAddStep}, "Add step")
                    )
                );
            },

            handleAddStep: function() {
                this.props.store.createStep();
            },

            handleDragOver: function() {
                if (!this.state.isDragging) {
                    this.setState({
                        isDragging: true
                    });
                }
            },

            handleDrop: function() {
                this.setState({
                    isDragging: false
                });
            }
        });

        return StepEditor;
    });
