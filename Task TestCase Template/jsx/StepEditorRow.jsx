/**
 * @jsx React.DOM
 */

tau
    .mashups
    .addDependency('react')
    .addModule('TaskTestCaseTemplate/StepEditorRow', function(React) {

        'use strict';

        var cx = React.addons.classSet;

        var Sortable = {

            update: function(to, from) {
                var data = this.props.data.items;
                data.splice(to, 0, data.splice(from, 1)[0]);
                this.props.sort(data, to);
            },

            sortEnd: function() {
                this.props.sort(this.props.data.items, undefined);
            },

            sortStart: function(e) {
                this.dragged = e.currentTarget.dataset ?
                    e.currentTarget.dataset.id :
                    e.currentTarget.getAttribute('data-id');
                e.dataTransfer.effectAllowed = 'move';
                try {
                    e.dataTransfer.setData('text/html', null);
                } catch (ex) {
                    e.dataTransfer.setData('text', '');
                }
            },

            move: function(over, append) {
                var to = Number(over.dataset.id);
                var from = this.props.data.dragging || Number(this.dragged);
                if (append) {
                    to++;
                }
                if (from < to) {
                    to--;
                }
                this.update(to, from);
            },

            dragOver: function(e) {
                e.preventDefault();
                var over = e.currentTarget;
                var relY = e.clientY - over.getBoundingClientRect().top;
                var height = over.offsetHeight / 2;
                var relX = e.clientY - over.getBoundingClientRect().left;
                var placement = this.placement ? this.placement(relX, relY, over) : relY > height;
                this.move(over, placement);
            },

            isDragging: function() {
                return this.props.data.dragging === this.props.key;
            }
        };

        var StepEditorRow = React.createClass({

            mixins: [Sortable],

            componentDidUpdate: function() {

                if (this.refs.description) {
                    this.refs.description.getDOMNode().focus();
                }
            },

            render: function() {

                var className = cx({
                    'tm-stepeditor__row': true,
                    'tm-stepeditor__row-dragging': this.isDragging()
                });

                var tr = (
                    <tr className={className}
                        data-id={this.props.key}
                        draggable={this.props.item.isEditing ? null : true}
                        onDragEnd={this.sortEnd}
                        onDragOver={this.dragOver}
                        onDragStart={this.sortStart}>

                        <td  onClick={this.handleEdit}>
                            <div className="tm-description" ref="description"
                                contentEditable={this.props.item.isEditing || null}
                                dangerouslySetInnerHTML={{'__html': this.props.item.Description}}
                                onBlur={this.handleSubmit}>
                            </div>
                        </td>
                        <td  onClick={this.handleEdit}>
                            <div className="tm-description" ref="result"
                                contentEditable={this.props.item.isEditing || null}
                                dangerouslySetInnerHTML={{'__html': this.props.item.Result}}
                                onBlur={this.handleSubmit}>
                            </div>
                        </td>
                        <td style={{width: 57}}>
                            <button type="button" className="tau-btn tau-attention tau-btn-small"
                                onClick={this.handleRemove}>
                                Delete
                            </button>
                        </td>
                    </tr>
                );

                return tr;

            },

            handleEdit: function() {
                this.props.store.editStep(this.props.item);
            },

            handleRemove: function(e) {
                e.stopPropagation();
                this.props.store.removeStep(this.props.item);
            },

            handleSubmit: function(e) {

                if (e.relatedTarget &&
                    (e.relatedTarget === this.refs.description.getDOMNode() ||
                        e.relatedTarget === this.refs.result.getDOMNode())
                ) {
                    return;
                }

                e.preventDefault();

                this.props.item.Description = this.refs.description.getDOMNode().innerHTML;
                this.props.item.Result = this.refs.result.getDOMNode().innerHTML;
                this.props.store.saveStep(this.props.item);
            }

        });

        return StepEditorRow;
    });
