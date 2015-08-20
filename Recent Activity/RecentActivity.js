/*global tau*/
tau
    .mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tp3/mashups/topmenu')
    .addDependency('tp3/mashups/popup')
    .addDependency('tp3/mashups/context')
    .addDependency('tau/utils/utils.date')
    .addMashup(function($, _, topmenu, Popup, context, du) {

        'use strict';

        var extractDate = function(date) {
            return du.parse(date);
        };

        var extractFullName = function(user) {
            return _.compact([user.firstName, user.lastName]).join(' ').trim() || 'Anonymous';
        };

        var processFields = function(fields, prefix) {

            prefix = prefix || '';
            if (_.isArray(fields)) {
                return _.map(fields, function(field) {
                    return (!_.isObject(fields) ? prefix : '') + processFields(field, prefix);
                }).join(',');
            } else if (_.isObject(fields)) {
                var key = _.keys(fields)[0];
                prefix += key + '.';
                return 'new(' + processFields(fields[key], prefix) + ') as ' + key;
            } else {
                return prefix + fields;
            }
        };

        var Controller = {

            DAYS_AGO: 2,

            init: function() {

                this.acid = '';
                this.projects = [];
                this.appPath = '';

                this.dataToLoad = {
                    changes: true,
                    added: true,
                    comments: true
                };

                this.link = topmenu.addItem({
                    title: 'Activity'
                });

                context.onChange(function(ctx) {
                    this.acid = ctx.acid;
                    this.projects = ctx.selectedProjects;
                }.bind(this));

                return $
                    .when(context.getApplicationPath())
                    .then(function(appPath) {
                        this.appPath = appPath;

                        this.link.onClick(function() {
                            this.popup = new Popup();
                            this.popup.show();
                            this.$el = this.popup.$container;
                            this.execute();
                        }.bind(this));

                        return this;
                    }.bind(this));
            },

            execute: function() {

                return $
                    .when(context.getAcid(), this.popup.showLoading())
                    .then(function(acid) {
                        this.acid = acid;
                    }.bind(this))
                    .then(this.loadData.bind(this))
                    .then(this.renderHtml.bind(this))
                    .then(this.popup.hideLoading.bind(this.popup));
            },

            loadData: function() {

                var toLoad = [
                    this.dataToLoad.changes ? this.loadChanges('userStory') : [],
                    this.dataToLoad.changes ? this.loadChanges('bug') : [],
                    this.dataToLoad.changes ? this.loadChanges('task') : [],
                    this.dataToLoad.added ? this.loadAdded() : [],
                    this.dataToLoad.comments ? this.loadComments() : []
                ];
                return $
                    .when.apply(null, toLoad)
                    .then(function() {
                        return Array.prototype.concat.apply([], _.toArray(arguments));
                    });
            },

            loadChanges: function(entityTypeName) {

                var fields = [
                    'date',
                    'modifier', {
                        'entityState': ['name']
                    }
                ];
                var entityFields = {};
                entityFields[entityTypeName] = [
                    'id',
                    'name', {
                        'project': ['color', 'abbreviation']
                    }
                ];
                fields.push(entityFields);

                return $
                    .when(this.doQuery({
                        resource: entityTypeName + 'History',
                        fields: processFields(fields),
                        where: [this.buildProjectCondition(entityTypeName + '.Project'), this.buildDateCondition('Date')]
                    }))
                    .then(function(items) {
                        return this.processChanges(items, entityTypeName);
                    }.bind(this));
            },

            processChanges: function(items, entityType) {

                return items.map(function(item) {
                    return {
                        EntityType: entityType,
                        EventDate: extractDate(item.date),
                        State: item.entityState.name,
                        EntityName: item[entityType].name,
                        User: extractFullName(item.modifier),
                        UserId: item.modifier.id,
                        ProjectAbbreviation: (item[entityType].project && item[entityType].project.abbreviation) ? item[entityType].project.abbreviation : '',
                        Color: (item[entityType].project && item[entityType].project.color) ? item[entityType].project.color : '',
                        Id: item[entityType].id
                    };
                });
            },

            loadAdded: function() {

                var fields = processFields([
                    'id',
                    'name',
                    'owner',
                    {'entityType': ['name']},
                    'createDate',
                    {'project': ['color', 'abbreviation']}
                ]);

                return $
                    .when(this.doQuery({
                        resource: 'general',
                        fields: fields,
                        where: [this.buildDateCondition('CreateDate'), this.buildProjectCondition('Project')],
                        take: 300
                    }))
                    .then(function(items) {
                        return this.processAdded(items);
                    }.bind(this));
            },

            processAdded: function(items) {

                return items.map(function(general) {
                    return {
                        EntityType: general.entityType.name,
                        EventDate: extractDate(general.createDate),
                        State: 'Added',
                        EntityName: general.name,
                        User: extractFullName(general.owner),
                        UserId: general.owner.id,
                        ProjectAbbreviation: (general.project && general.project.abbreviation) ? general.project.abbreviation : '',
                        Color: (general.project && general.project.color) ? general.project.color : '',
                        Id: general.id
                    };
                });
            },

            loadComments: function() {

                var fields = processFields([
                    'description',
                    'owner',
                    'createDate', {
                        'general': [
                            'id',
                            'name',
                            'entityType', {
                                'project': ['color', 'abbreviation']
                            }
                        ]
                    }
                ]);

                return $
                    .when(this.doQuery({
                        resource: 'comment',
                        fields: fields,
                        where: [this.buildProjectCondition('General.Project'), this.buildDateCondition('CreateDate')]
                    }))
                    .then(function(items) {
                        return this.processComments(items);
                    }.bind(this));
            },

            processComments: function(items) {

                return items.map(function(comment) {

                    return {
                        EntityType: comment.general.entityType.name,
                        EventDate: extractDate(comment.createDate),
                        State: 'Comment',
                        EntityName: comment.general.name,
                        User: extractFullName(comment.owner),
                        UserId: comment.owner.id,
                        ProjectAbbreviation: (comment.general.project && comment.general.project.abbreviation) ? comment.general.project.abbreviation : '',
                        Color: (comment.general.project && comment.general.project.color) ? comment.general.project.color : '',
                        Id: comment.general.id
                    };
                });
            },

            doQuery: function(options) {

                var where = _.compact(options.where || []);
                if (where.length > 1) {
                    where = where.map(function(cond) {
                        return '(' + cond + ')';
                    });
                }

                where = where.join(' and ');
                var data = {
                    select: '{' + options.fields + '}',
                    where: where,
                    take: options.take || 100,
                    format: 'json'
                };

                return $.ajax({
                    url: this.appPath + '/api/v2/' + options.resource,
                    data: data
                }).then(function(res) {
                    return res.items || [];
                }, function() {
                    return [];
                });
            },

            buildProjectCondition: function(projectFieldName) {

                projectFieldName = projectFieldName || 'Project';
                var ids = _.map(this.projects, function(v) {
                    return v.id;
                });

                var cond = '';

                var isAll = _.contains(ids, 'Any');
                if (isAll) {
                    return cond;
                }

                var isNone = _.contains(ids, 'None');
                ids = _.without(ids, 'None');
                if (ids.length) {
                    cond += _.sprintf('%s.Id in [%s]', projectFieldName, ids.join(','));
                }

                if (isNone) {
                    cond += cond ? ' or ' : '';
                    cond += _.sprintf('%s.Id == null', projectFieldName);
                }

                return cond;
            },

            buildDateCondition: function(dateFieldName) {

                var format = function(date) {
                    return _.lpad(date.getFullYear(), 2, 0) + '-' + _.lpad(date.getMonth() + 1, 2, 0) + '-' + date.getDate();
                };

                var from = format(new Date(new Date() - this.DAYS_AGO * 24 * 3600000));
                var to = format(new Date());

                return _.sprintf('(%s >= DateTime.Parse("%s")) and (%s <= DateTime.Parse("%s"))', dateFieldName, from, dateFieldName, to);
            },

            renderHtml: function(items) {

                items = _.sortBy(items, function(item) {
                    return item.EventDate;
                });

                items.reverse();

                var format = function(date) {
                    var months = [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec'
                    ];

                    return (months[date.getMonth()]) + '-' + date.getDate();
                };

                var grouped = _.groupBy(items, function(item) {
                    return format(item.EventDate);
                });

                this.$el.find('#ac_filter').remove();
                this.$el.find('#ac_main').remove();

                var html = $.jqote('<div id="ac_filter" style="font-size: 12px">' +
                    '<label><input type="checkbox" <%= this.added ? "checked" : "" %> class="ac_event_filter" value="added"> Add </label> ' +
                    '<label><input type="checkbox" <%= this.comments ? "checked" : "" %> class="ac_event_filter" value="comments"> Comment </label> ' +
                    '<label><input type="checkbox" <%= this.changes ? "checked" : "" %>  class="ac_event_filter" value="changes"> State Change </label> ' +
                    '</div>', this.dataToLoad);

                html += '<div id="ac_main" style="height: 100%; overflow: scroll"><table style="font-size: 11px !important">';

                var tmpl = ['<tr><td><img width="16" height="16" src="<%= this.path %>/avatar.ashx?size=16&UserId=<%= this.userId %>">',
                    ' <b><%= this.date %></b></td><td <%= this.doneStyle %>><%= this.state %></td>',
                    '<td><span class="delimeter">—</span> <span style="background:<%= this.color %>"><%= this.projectAbr %></span>',
                    ' <%= this.entityType %> <a href="<%= this.path %>/entity/<%= this.entityId %>"><%! this.entityName %></a>',
                    ' by <%! this.user %></td></tr>'
                ].join('');

                _.forEach(grouped, function(val, key) {
                    html += '<tr><td colspan="3"><h2>' + key + '</h2></td></tr>';
                    _.forEach(val, function(item) {

                        html += $.jqote(
                            tmpl, {
                                path: this.appPath,
                                date: _.lpad(item.EventDate.getHours(), 2, 0) + ':' + _.lpad(item.EventDate.getMinutes(), 2, 0),
                                state: item.State,
                                entityType: item.EntityType.toString(),
                                entityId: item.Id,
                                entityName: item.EntityName,
                                projectAbr: item.ProjectAbbreviation,
                                color: item.Color,
                                userId: item.UserId,
                                user: item.User,
                                doneStyle: (item.State === 'Done' || item.State === 'Closed') ? 'style="text-decoration: line-through;"' : ''
                            });
                    }.bind(this));
                }.bind(this));

                html += '</table></div>';

                this.$el.append(html);

                this.$el.find('#ac_filter').on('click', ':checkbox', function(e) {
                    this.dataToLoad[e.currentTarget.value] = e.currentTarget.checked;
                    this.execute();
                }.bind(this));
            }
        };

        return Controller.init();
    });
