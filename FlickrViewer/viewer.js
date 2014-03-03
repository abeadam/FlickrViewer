YUI({gallery: 'gallery-2011.04.20-13-04'}).add('viewer', function(Y){
	function ImageWidget(config) {
		ImageWidget.superclass.constructor.apply(this, config);
	}
	ImageWidget.NAME = 'image viewer';

	Y.extend(ImageWidget, Y.Plugin.Base, {
		initializer: function (config) {
			var host = this.get('host');

		}
	});
	Y.namespace('ImageWidget').slideshow = ImageWidget; 

},'0.0.0', {requires: ['gallery-yui-slideshow', 'plugin']});