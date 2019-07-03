/*global tau*/
tau
    .mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tp3/mashups/topmenu')
    .addDependency('tp3/mashups/popup')
    .addDependency('tp3/mashups/context')
    .addDependency('tau/utils/utils.date')
    .addDependency('tau/core/templates-factory')
    .addMashup(function($, _, topmenu, Popup, context, du, templates) {

        'use strict';

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

        var HistoryItem = function(entityType, eventDate, state, entity, user) {
            var project = entity.project;

            this.EntityType = entityType;
            this.EventDate = du.parse(eventDate);
            this.State = state;
            this.EntityName = entity.name;
            this.User = extractFullName(user);
            this.UserId = user.id;
            this.ProjectAbbreviation = (project && project.abbreviation) ? project.abbreviation : '';
            this.Color = (project && project.color) ? project.color : '';
            this.Id = entity.id;
        };

        var htmlTemplate = templates.register({
            name: 'recent.activity.template.main',
            engine: 'jqote2',
            markup: [
                '<div id="ac_filter" style="font-size: 12px;">',
                '<label><input type="checkbox" <%= this.flags.added ? "checked" : "" %> class="ac_event_filter" value="added"> Add </label> ',
                '<label><input type="checkbox" <%= this.flags.comments ? "checked" : "" %> class="ac_event_filter" value="comments"> Comment </label> ',
                '<label><input type="checkbox" <%= this.flags.changes ? "checked" : "" %>  class="ac_event_filter" value="changes"> State Change </label> ',
                '</div>',
                '<div id="ac_main" style="height: 100%; overflow: scroll;"><table style="font-size: 11px !important;">',
                '<%= fn.sub("recent.activity.template.group", this.groups) %>',
                '</table></div>'
            ]
        });

        templates.register({
            name: 'recent.activity.template.group',
            engine: 'jqote2',
            markup: [
                '<tr><td colspan="3"><h2><%= this.eventDate %></h2></td></tr>',
                '<%= fn.sub("recent.activity.template.row", this.items) %>'
            ]
        });

        templates.register({
            name: 'recent.activity.template.row',
            engine: 'jqote2',
            markup: [
                '<tr><td><img width="16" height="16" src="<%= this.path %>/avatar.ashx?size=16&UserId=<%= this.userId %>">',
                ' <b><%= this.date %></b></td><td <%=this.doneStyle %>><%= this.state %></td>',
                '<td><span class="delimiter">—</span> <span style="background:<%= this.color %>;"><%= this.projectAbr %></span>',
                ' <%= this.entityType %> <a href="<%= this.path %>/entity/<%= this.entityId %>"><%! this.entityName %></a>',
                ' by <%! this.user %></td></tr>'
            ]
        });

        var controller = {

            DAYS_AGO: 2,
            dataToLoad: null,

            init: function() {

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
                            this.$el.on('click', '#ac_filter :checkbox', function(e) {
                                this.dataToLoad[e.currentTarget.value] = e.currentTarget.checked;
                                this.execute();
                            }.bind(this));
                            this.execute();
                        }.bind(this));

                        return this;
                    }.bind(this));
            },

            execute: function() {

                return $
                    .when(this.popup.showLoading())
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
                    .when.all(toLoad)
                    .then(function(data) {
                        return _.flatten(data);
                    });
            },

            loadChanges: function(entityTypeName) {

                var entityFields = {};
                entityFields[entityTypeName] = [
                    'id',
                    'name',
                    {'project': ['color', 'abbreviation']}
                ];
                var fields = [
                    'date',
                    'modifier',
                    {'entityState': ['name']},
                    entityFields
                ];

                return $
                    .when(this.doQuery({
                        resource: entityTypeName + 'SimpleHistory',
                        fields: processFields(fields),
                        where: [
                            this.buildProjectCondition(entityTypeName + '.Project'),
                            this.buildDateCondition('Date')
                        ]
                    }))
                    .then(function(items) {
                        return this.processChanges(items, entityTypeName);
                    }.bind(this));
            },

            processChanges: function(items, entityType) {

                return items.map(function(item) {
                    var entity = item[entityType];
                    return new HistoryItem(_.titleize(entityType), item.date, item.entityState.name,
                        entity, item.modifier);
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
                    return new HistoryItem(general.entityType.name, general.createDate, 'Added',
                        general, general.owner);
                });
            },

            loadComments: function() {

                var fields = processFields([
                    'description',
                    'owner',
                    'createDate',
                    {
                        'general': [
                            'id',
                            'name',
                            'entityType',
                            {'project': ['color', 'abbreviation']}
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
                    var entity = comment.general;
                    return new HistoryItem(entity.entityType.name, comment.createDate, 'Comment',
                        entity, comment.owner);
                });
            },

            doQuery: function(options) {

                var where = _.compact(options.where || []);
                if (where.length > 1) {
                    where = where.map(function(cond) {
                        return '(' + cond + ')';
                    });
                }

                var data = {
                    select: '{' + options.fields + '}',
                    where: where.join(' and '),
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
                    return _.lpad(date.getFullYear(), 2, 0) + '-' +
                        _.lpad(date.getMonth() + 1, 2, 0) + '-' +
                        date.getDate();
                };

                var from = format(new Date(new Date() - this.DAYS_AGO * 24 * 3600000));
                var to = format(new Date());

                return _.sprintf('(%s >= DateTime.Parse("%s")) and (%s <= DateTime.Parse("%s"))',
                    dateFieldName, from, dateFieldName, to);
            },

            renderHtml: function(items) {

                items = _
                    .chain(items)
                    .sortBy(function(item) {
                        return item.EventDate;
                    })
                    .reverse()
                    .map(function(item) {
                        var months = [
                            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                        ];
                        var format = function(date) {
                            return (months[date.getMonth()]) + '-' + date.getDate();
                        };

                        var eventDate = item.EventDate;

                        return {
                            eventDate: format(eventDate),
                            path: this.appPath,
                            date: _.lpad(eventDate.getHours(), 2, 0) + ':' + _.lpad(eventDate.getMinutes(), 2, 0),
                            state: item.State,
                            entityType: item.EntityType.toString(),
                            entityId: item.Id,
                            entityName: item.EntityName,
                            projectAbr: item.ProjectAbbreviation,
                            color: item.Color || 'transparent',
                            userId: item.UserId,
                            user: item.User,
                            doneStyle: (item.State === 'Done' || item.State === 'Closed') ?
                                'style="text-decoration: line-through;"' : ''
                        };
                    }, this)
                    .value();

                var groups = _.groupBy(items, function(item) {
                    return item.eventDate;
                });
                groups = _.map(groups, function(items, eventDate) {
                    return {eventDate: eventDate, items: items};
                });

                this.$el.find('#ac_filter,#ac_main').remove();
                htmlTemplate.render({flags: this.dataToLoad, groups: groups}).appendTo(this.$el);
            }
        };

        return controller.init();
    });
