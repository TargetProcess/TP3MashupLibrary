/**
 * @jsx React.DOM
 */

tau
    .mashups
    .addDependency('react')
    .addDependency('TaskTestCaseTemplate/StepEditor')
    .addModule('TaskTestCaseTemplate/TemplatesManagerTestCaseForm', function(React, StepEditor) {

        'use strict';

        var TemplatesManagerTestCaseForm = React.createClass({displayName: 'TemplatesManagerTestCaseForm',

            handleSave: function() {

                var item = this.props.item;
                var val = this.refs.name.getDOMNode().value.trim();
                if (val) {
                    item.Name = val;
                    item.Description = this.refs.description.getDOMNode().innerHTML || '';
                    this.props.store.saveTestCase(this.props.item);
                }
            },

            handleRemove: function() {
                this.props.store.removeTestCase(this.props.item);
            },

            render: function() {

                var item = this.props.item;

                var description = this.props.store.getTestCaseDescription(item);

                return (
                    React.DOM.div({className: "view-mode active"}, 
                        React.DOM.div({className: "entity-name"}, 
                            React.DOM.input({type: "text", ref: "name", defaultValue: item.Name, 
                                placeholder: "Name", autoFocus: true})
                        ), 

                        React.DOM.div({className: "edit-block"}, 
                            React.DOM.div({className: "note"}, "Description"), 
                            React.DOM.div({className: "tm-description", ref: "description", contentEditable: true, 
                            dangerouslySetInnerHTML: {'__html': description}})
                        ), 

                        React.DOM.div({className: "edit-block"}, 
                            StepEditor({item: item, store: this.props.store}), 

                            React.DOM.div({className: "action-buttons"}, 
                                React.DOM.button({type: "button", className: "tau-btn tau-success left", 
                                    onClick: this.handleSave}, 
                                    item.Id ? 'Save Test Case' : 'Add Test Case'
                                ), 
                                React.DOM.button({type: "button", className: "tau-btn tau-attention right", 
                                    onClick: this.handleRemove}, 
                                    item.Id ? 'Delete' : 'Cancel'
                                )
                            )
                        )
                    )
                );
            }
        });


        return TemplatesManagerTestCaseForm;
    });
