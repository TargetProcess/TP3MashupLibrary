/**
 * @jsx React.DOM
 */

 tau.mashups
     .addDependency('react')
     .addDependency('AssignedEffortReport/ReportEntityRow')
     .addModule('AssignedEffortReport/ReportUserRow', function(React, ReportEntityRow) {

        'use strict';

        var ReportUserRow = React.createClass({

            render: function() {

                var item = this.props.item;



                var barStyle = {
                    width: item.EffortPercent + '%'
                };

                var barInnerStyle = {
                    width: (item.TotalToDo / item.TotalEffort) * 100 + '%'
                };

                var expanded;
                if (item.isExpanded) {

                    var entities = item.Items.map(function(v, k) {
                        return (
                            <ReportEntityRow key={k} store={this.props.store} item={v} />
                        );
                    }.bind(this));

                    expanded = (
                        <tr className="innerData">
                            <td colSpan="3">
                                <table className="board-efforts-inner">
                                    <tr>
                                        <th style={{width: '33%'}} colSpan="2">Assignable</th>
                                        <th style={{width: '10%'}}>State</th>
                                        <th style={{width: '10%'}}>Role</th>
                                        <th>Effort</th>
                                        <th>Time Spent</th>
                                        <th>Remaining</th>
                                    </tr>
                                    {entities}
                                    <tr style={{borderTop: '1px solid #66666'}}>
                                        <td colSpan="4" style={{textAlign: 'right'}}>Totals:</td>
                                        <td>{item.TotalEffort}</td>
                                        <td>{item.TotalTimeSpt}</td>
                                        <td>{item.TotalTimeRem}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    );

                }

                return (
                    <tbody>
                        <tr className="hoverHi">
                            <td className="more" onClick={this.handleExpand}></td>
                            <td>{item.FirstName} {item.LastName}
                                <em>{item.DefaultRole.Name}</em>
                            </td>

                            <td className="bar" style={barStyle}>
                                <div className="innerBar" style={barInnerStyle}>
                                    {item.TotalEffort}
                                </div>
                            </td>

                        </tr>
                        {expanded}

                    </tbody>
                );
            },

            handleExpand: function() {
                this.props.store.expandUser(this.props.item);
            }

        });

        return ReportUserRow;
    });
