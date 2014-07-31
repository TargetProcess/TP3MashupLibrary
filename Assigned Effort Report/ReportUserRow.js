/**
 * @jsx React.DOM
 */

 tau.mashups
     .addDependency('react')
     .addDependency('AssignedEffortReport/ReportEntityRow')
     .addModule('AssignedEffortReport/ReportUserRow', function(React, ReportEntityRow) {

        'use strict';

        var ReportUserRow = React.createClass({displayName: 'ReportUserRow',

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
                            ReportEntityRow({key: k, store: this.props.store, item: v})
                        );
                    }.bind(this));

                    expanded = (
                        React.DOM.tr({className: "innerData"}, 
                            React.DOM.td({colSpan: "3"}, 
                                React.DOM.table({className: "board-efforts-inner"}, 
                                    React.DOM.tr(null, 
                                        React.DOM.th({style: {width: '33%'}, colSpan: "2"}, "Assignable"), 
                                        React.DOM.th({style: {width: '10%'}}, "State"), 
                                        React.DOM.th({style: {width: '10%'}}, "Role"), 
                                        React.DOM.th(null, "Effort"), 
                                        React.DOM.th(null, "Time Spent"), 
                                        React.DOM.th(null, "Remaining")
                                    ), 
                                    entities, 
                                    React.DOM.tr({style: {borderTop: '1px solid #66666'}}, 
                                        React.DOM.td({colSpan: "4", style: {textAlign: 'right'}}, "Totals:"), 
                                        React.DOM.td(null, item.TotalEffort), 
                                        React.DOM.td(null, item.TotalTimeSpt), 
                                        React.DOM.td(null, item.TotalTimeRem)
                                    )
                                )
                            )
                        )
                    );

                }

                return (
                    React.DOM.tbody(null, 
                        React.DOM.tr({className: "hoverHi"}, 
                            React.DOM.td({className: "more", onClick: this.handleExpand}), 
                            React.DOM.td(null, item.FirstName, " ", item.LastName, 
                                React.DOM.em(null, item.DefaultRole.Name)
                            ), 

                            React.DOM.td({className: "bar", style: barStyle}, 
                                React.DOM.div({className: "innerBar", style: barInnerStyle}, 
                                    item.TotalEffort
                                )
                            )

                        ), 
                        expanded

                    )
                );
            },

            handleExpand: function() {
                this.props.store.expandUser(this.props.item);
            }

        });

        return ReportUserRow;
    });
