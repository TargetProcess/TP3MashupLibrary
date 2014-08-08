/**
 * @jsx React.DOM
 */

tau
    .mashups
    .addDependency('react')
    .addDependency('TaskTestCaseTemplate/StepEditor')
    .addDependency('TaskTestCaseTemplate/stepsStore')
    .addModule('TaskTestCaseTemplate/TemplatesManagerTestCaseForm', function(React, StepEditor, StepsStore) {

        'use strict';

        var TemplatesManagerTestCaseForm = React.createClass({

            getInitialState: function() {
                return {
                    stepsStore: new StepsStore(this.props.item)
                };
            },

            render: function() {

                var item = this.props.item;

                var description = this.props.store.getTestCaseDescription(item);

                return (
                    <div className="view-mode active">
                        <div className="entity-name">
                            <input type="text" ref="name" defaultValue={item.Name}
                                placeholder="Name" autoFocus={true} />
                        </div>

                        <div className="edit-block">
                            <div className="note">Description</div>
                            <div className="tm-description" ref="description" contentEditable={true}
                            dangerouslySetInnerHTML={{'__html': description}} ></div>
                        </div>

                        <div className="edit-block">
                            <StepEditor store={this.state.stepsStore} />

                            <div className="action-buttons">
                                <button type="button" className="tau-btn tau-success left"
                                    onClick={this.handleSave}>
                                    {item.Id ? 'Save Test Case' : 'Add Test Case'}
                                </button>
                                <button type="button" className="tau-btn tau-attention right"
                                    onClick={this.handleRemove}>
                                    {item.Id ? 'Delete' : 'Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            },

            handleSave: function() {

                var item = this.props.item;
                var val = this.refs.name.getDOMNode().value.trim();
                if (val) {
                    item.Name = val;
                    item.Description = this.refs.description.getDOMNode().innerHTML || '';
                    item.steps = this.state.stepsStore.items;
                    this.props.store.saveTestCase(this.props.item);
                }
            },

            handleRemove: function() {
                this.props.store.removeTestCase(this.props.item);
            }
        });


        return TemplatesManagerTestCaseForm;
    });
