/**
 * @jsx React.DOM
 */

tau
    .mashups
    .addDependency('libs/react/react-ex')
    .addModule('TaskTestCaseTemplate/TemplatesManagerTaskForm', function(React) {

        'use strict';

        var TemplatesManagerTaskForm = React.createClass({

            handleSave: function() {

                var item = this.props.item;
                var val = this.refs.name.getDOMNode().value.trim();
                if (val) {
                    item.Name = val;
                    item.Description = this.refs.description.getDOMNode().innerHTML || '';
                    this.props.store.saveTask(this.props.item);
                }

            },

            handleRemove: function() {
                this.props.store.removeTask(this.props.item);
            },

            render: function() {

                var item = this.props.item;

                return (

                        <div className="view-mode active">
                            <div className="entity-name">
                                <input type="text" ref="name" placeholder="Name"
                                    defaultValue={item.Name} autoFocus={true} />
                            </div>
                            <div className="edit-block">
                                <div className="note">Description</div>
                                <div className="tm-description" ref="description" contentEditable={true}
                                dangerouslySetInnerHTML={{'__html': item.Description}} ></div>

                                <div className="action-buttons">
                                    <button type="button"
                                        className="tau-btn tau-success left" onClick={this.handleSave}>
                                        {item.Id ? 'Save Task' : 'Add Task'}
                                    </button>
                                    <button type="button"
                                        className="tau-btn tau-attention right" onClick={this.handleRemove}>
                                        {item.Id ? 'Delete' : 'Cancel'}
                                    </button>
                                </div>
                            </div>
                        </div>
                );
            }
        });

        return TemplatesManagerTaskForm;
    });
