tau.mashups
    .addDependency('jQuery')
    .addMashup(function ($) {
        var url = 'http://localhost';
		$('ul.user-sub').prepend('<li style="padding-top: 0px"><a href="'+url+'/restui/board.aspx" style="border: 1px solid #7daa43; background: #7daa43; background: -webkit-gradient(linear, left top, left bottom, from(#a0c74b), to(#7daa43)); background: -webkit-linear-gradient(top, #a0c74b, #7daa43); background: -moz-linear-gradient(top, #a0c74b, #7daa43); background: -ms-linear-gradient(top, #a0c74b, #7daa43); background: -o-linear-gradient(top, #a0c74b, #7daa43); background-image: -ms-linear-gradient(top, #a0c74b 0%, #7daa43 100%); padding: 1px 10px; -webkit-border-radius: 12px; -moz-border-radius: 12px; border-radius: 12px; -webkit-box-shadow: rgba(255,255,255,0.4) 0 0px 0, inset rgba(255,255,255,0.4) 0 1px 0; -moz-box-shadow: rgba(255,255,255,0.4) 0 0px 0, inset rgba(255,255,255,0.4) 0 1px 0; box-shadow: rgba(255,255,255,0.4) 0 0px 0, inset rgba(255,255,255,0.4) 0 1px 0; text-shadow: #649b30 0 1px 0; color: #ffffff; font-size: 12px; font-family: opensans; text-decoration: none; vertical-align: middle;font-weight: 600;">Switch to Targetprocess<sup style="font-size: 8px;">3</sup></a></li>');
});