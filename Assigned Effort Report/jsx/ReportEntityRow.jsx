
/**
 * @jsx React.DOM
 */

 tau.mashups
     .addDependency('react')
     .addDependency('tau/configurator')
     .addModule('AssignedEffortReport/ReportEntityRow', function(React, configurator) {

        'use strict';

        var ReportEntityRow = React.createClass({

            render: function() {

                var item = this.props.item;
                var path = configurator.getApplicationPath();
                return (
                    <tr>
                        <td>
                            <img src={path + '/img/' + item.EntityType + '.gif'} />
                        </td>
                        <td>{item.Name}</td>
                        <td>{item.EntityState}</td>
                        <td>{item.Role}</td>
                        <td>{item.Effort}</td>
                        <td>{item.TimeSpent}</td>
                        <td>{item.TimeRemain}</td>
                    </tr>

                );
            }

        });

        return ReportEntityRow;
    });

