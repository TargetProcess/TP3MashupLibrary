/**
 * @jsx React.DOM
 */

tau.mashups
    .addDependency('react')
    .addDependency('AssignedEffortReport/ReportEntityRow')
    .addModule('AssignedEffortReport/ReportUserRow', function(React, ReportEntityRow) {

        'use strict';

        var ReportUserRow = React.createClass({displayName: "ReportUserRow",

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
                            React.createElement(ReportEntityRow, {key: k, store: this.props.store, item: v})
                        );
                    }.bind(this));

                    expanded = (
                        React.createElement("tr", {className: "innerData"}, 
                            React.createElement("td", {colSpan: "3"}, 
                                React.createElement("table", {className: "board-efforts-inner"}, 
                                    React.createElement("tr", null, 
                                        React.createElement("th", {style: {width: '33%'}, colSpan: "2"}, "Assignable"), 
                                        React.createElement("th", {style: {width: '10%'}}, "State"), 
                                        React.createElement("th", {style: {width: '10%'}}, "Role"), 
                                        React.createElement("th", null, "Effort"), 
                                        React.createElement("th", null, "Time Spent"), 
                                        React.createElement("th", null, "Remaining")
                                    ), 
                                    entities, 
                                    React.createElement("tr", {style: {borderTop: '1px solid #66666'}}, 
                                        React.createElement("td", {colSpan: "4", style: {textAlign: 'right'}}, "Totals:"), 
                                        React.createElement("td", null, item.TotalEffort), 
                                        React.createElement("td", null, item.TotalTimeSpt), 
                                        React.createElement("td", null, item.TotalTimeRem)
                                    )
                                )
                            )
                        )
                    );

                }

                return (
                    React.createElement("tbody", null, 
                        React.createElement("tr", {className: "hoverHi"}, 
                            React.createElement("td", {className: "more", onClick: this.handleExpand}), 
                            React.createElement("td", null, item.FirstName, " ", item.LastName, 
                                React.createElement("em", null, item.DefaultRole.Name)
                            ), 

                            React.createElement("td", {className: "bar", style: barStyle}, 
                                React.createElement("div", {className: "innerBar", style: barInnerStyle}, 
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
