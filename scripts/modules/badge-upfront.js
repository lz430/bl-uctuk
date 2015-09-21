define([], function() {
	var upfront = document.createElement('SCRIPT');

	upfront.type = "text/javascript";
	upfront.async = true;
	upfront.src = document.location.protocol + "//upfront.thefind.com/scripts/main/utils-init-ajaxlib/upfront-badgeinit.js";
	upfront.text = "thefind.upfront.init('tf_upfront_badge', '91d5e3b80878f0a925f4458b27225438')";
	document.getElementsByTagName('HEAD')[0].appendChild(upfront);
});