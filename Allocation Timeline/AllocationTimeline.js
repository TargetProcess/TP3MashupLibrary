tau.mashups
.addDependency('jQuery')
.addDependency('Underscore')
.addDependency('tau/configurator')
.addCSS('style.css')
.addMashup(function($, _, configurator) {

    var SHOW_ZERO_ALLOCATIONS = false;

    var load = function(resource, params) {

        var loadSimple = function(url, params) {
            return $.ajax({
                type: 'get',
                url: url,
                contentType:'application/json; charset=utf-8',
                dataType:'json',
                data: params
            });
        };

        var loadPages = function loadPages(url, params) {

            return loadSimple(url, params)
            .then(function(res) {
                var items = res.Items;
                if (res.Next) {
                    return loadPages(res.Next)
                        .then(function(nextItems) {
                            return items.concat(nextItems);
                        });
                } else {
                    return items;
                }
            });
        };

        return loadPages(configurator.getApplicationPath() + '/api/v1/' + resource, params);
    };

    var today = new Date();

    var Mashup = function() {

        $('a:contains("Load by Person")').after($('<a id="allocation-link" href="#">People/Projects Timeline</a>'));
        $('#allocation-link').click(this.showReport.bind(this));
    };

    Mashup.prototype.showReport = function() {

        return this.load()
        .then(function(data) {
            return this.render(data);
        }.bind(this));
    };

    Mashup.prototype.load = function() {

        return load('users', {
            where: 'IsActive eq \'true\' and DeleteDate is null'
        })
        .then(function(users) {
            return $.when(users, load('projectMembers', {
                where: SHOW_ZERO_ALLOCATIONS ? '' : 'Allocation gt 0'
            }));
        })
        .then(function(users, allocations) {

            var allocationsByUser = _.groupBy(allocations, function(v) {
                return v.User.Id;
            });

            users = users.map(function(user) {

                var allocations = allocationsByUser[user.Id] || [];

                user.ProjectMembers = allocations;
                user.totalAllocation = 0;

                user.avatarUrl = configurator.getApplicationPath() + '/avatar.ashx?size=30&UserId=' + user.Id;

                user.ProjectMembers = _.filter(user.ProjectMembers, function(project) {

                    project.Start = project.MembershipStartDate ?
                        new Date(parseInt(project.MembershipStartDate.substr(6), 10)) :
                        null;
                    project.End = project.MembershipEndDate ?
                        new Date(parseInt(project.MembershipEndDate.substr(6), 10)) :
                        null;

                    return (project.End && project.End.getFullYear() >= today.getFullYear());
                });

                user.ProjectMembers = user.ProjectMembers.map(function(project) {

                    var startMonth = 0; // take first month
                    var startDate = 1;
                    if (project.Start && project.Start.getFullYear() === today.getFullYear()) {
                        startMonth = project.Start.getMonth();
                        startDate = project.Start.getDate();
                    }

                    var endMonth = 11; // take last month
                    var endDate = 31;
                    if (project.End && project.End.getFullYear() === today.getFullYear()) {
                        endMonth = project.End.getMonth();
                        endDate = project.End.getDate();
                    }

                    if (endMonth > 11) {
                        endMonth = 11; // don't jump next year
                        endDate = 31;
                    }

                    var startDay = Math.round(startMonth * 30.5) + startDate;
                    var endDay = Math.round(endMonth * 30.5) + endDate;
                    var lengthInDays = endDay - startDay;
                    lengthInDays = lengthInDays ? lengthInDays : 15;

                    project.lengthByPercents = lengthInDays / 365 * 100;
                    project.startByPercents = startDay / 365 * 100;

                    if (project.startByPercents + project.lengthByPercents > 100) {
                        project.lengthByPercents = 100 - project.startByPercents;
                    }

                    user.totalAllocation += project.Allocation;
                    return project;
                });

                if (user.totalAllocation > 100) {
                    user.totalClassName = 'total-over';
                } else if (!user.totalAllocation) {
                    user.totalClassName = 'total-zero';
                } else if (user.totalAllocation < 100 && user.totalAllocation > 50) {
                    user.totalClassName = 'total-normal';
                }

                return user;
            });

            if (SHOW_ZERO_ALLOCATIONS === false) {
                users = _.filter(users, function(v) {
                    return v.totalAllocation > 0;
                });
            }

            return users;
        });
    };

    Mashup.prototype.render = function(users) {

        var data = {
            users: users
        };
        data.months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        data.current = data.months[today.getMonth()];

        var tmpl = [
            '<span class="tableTitle">People allocations on projects</span>',
            '<br /><br />',
            '<div id="allocation-rep">',
                '<table class="board-timeline" style="width: 100%;">',
                    '<tr>',
                        '<th style="min-width: 210px;">People</th>',
                        '<% this.months.forEach(function(v) { %>',
                            '<th style="width: 8%" class="<%= (this.current === v) ? "current-month": "" %>">',
                                '<%= v %>',
                            '</th>',
                        '<% }.bind(this)); %>',
                    '</tr>',
                    '<% this.users.forEach(function(user){%>',
                        '<tr>',
                            '<td>',
                                '<img class="avatar" src="<%= user.avatarUrl %>" />',
                                '<%= user.FirstName %> <%= user.LastName %>',
                                '<br /><span style="color: #bbb;"><%= user.Role.Name %></span> ',
                                '<span class="total <%= user.totalClassName %>"><%= user.totalAllocation %>%</span>',
                            '</td>',
                            '<td colspan="12" class="board-timeline__line">',
                                '<% user.ProjectMembers.forEach(function(member) { %>',
                                    '<div class="timeline-card" style="',
                                        'margin-left: <%= member.startByPercents %>%; ',
                                        'width: <%= member.lengthByPercents %>% ">',

                                        '<i><%= member.Allocation %>%</i> ',
                                        '<%= member.Project.Name %>',
                                    '</div>',
                                '<% }); %>',
                            '</td>',
                        '</tr>',
                    '<%});%>',
                '</table>',
            '</div>'
        ].join('');

        var $holder = $('td.col-two > div:first');
        var $el = $($.jqote(tmpl, data));

        $holder.html('').append($el);

    };

    return new Mashup();

});
