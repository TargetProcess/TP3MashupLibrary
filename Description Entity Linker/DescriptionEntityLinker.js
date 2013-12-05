tau.mashups
.addDependency(	'tp/userStory/view')
.addDependency('tp/task/view')
.addDependency('tp/request/view')
.addDependency('tp/bug/view')
.addDependency("jQuery")
.addMashup(function(storyView, taskView, requestView, bugView, $, config) {

	function renderTagLinks() {
		setTimeout(function() {
			var capture = /#(\d+)/.exec($("div.ui-description__inner:not('.linkz0red')").html());
			$("div.ui-description__inner").addClass('linkz0red');
			if (capture != null) {
				var id = capture[1];
				$.getJSON(
					'/api/v1/Generals/{0}?include=[EntityType]&format=json'.f(id), 
					function(resp){
						$("div.ui-description__inner").html(
							$("div.ui-description__inner").html().replace(
								/#(\d+)/,
								"<a href='#{0}/{1}'>#$1</a>".f(resp.EntityType.Name.toLowerCase(), resp.Id)
								)
							);
					});
			}
		},1000);
	}

	$(document).ready(renderTagLinks);

	storyView.onRender(renderTagLinks);
	taskView.onRender(renderTagLinks);
	requestView.onRender(renderTagLinks);
	bugView.onRender(renderTagLinks);
}
);

/* my new favorite proto function */
String.prototype.f = function() {
	var s = this, i = arguments.length;
	while (i--)
		s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
	return s;
};