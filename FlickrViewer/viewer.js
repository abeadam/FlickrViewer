YUI({gallery: 'gallery-2011.04.20-13-04'}).add('viewer', function(Y){
	function ImageWidget(config) {
		ImageWidget.superclass.constructor.apply(this, arguments);
	}
	ImageWidget.NAME = 'image viewer';
	ImageWidget.NS = 'viewer';

	// this function will fill the host with all th required image tags
	function _addImages (images, container, showSlideShow) {
		Y.each(images, function (imageObj) {
			var photo = Y.Node.create('<img></img>');
			photo.setAttribute('src', imageObj.getUrl());
			photo.setAttribute('title', imageObj.getTitle());
			photo.setAttribute('alt', imageObj.getTitle());
			photo.setAttribute('width', 600);
			photo.setAttribute('height', 600);
			// let height be auto 
			container.append(photo);
		});
		this._slideShow = showSlideShow();
	}

	function _nextPhoto () {
		console.log('next photo');
		this._slideShow.next();
	}

	function _previousPhoto () {
		console.log('previousPhoto');
		this._slideShow.previous();
	}

	Y.extend(ImageWidget, Y.Plugin.Base, {
		initializer: function (config) {
			var host = this.get('host'),
			showSlideShow = function () {
					var slideshow;
					slideshow = new Y.Slideshow({ 
						srcNode: host,
						autoplay: false
					});
					slideshow.render();
					slideshow._currentPhoto = 0;
					return slideshow;
				};
			_addImages.call(this, config.photos, host, showSlideShow);
			// lets add listeners
			this.afterHostEvent('nextPhoto', _nextPhoto, this);
			this.afterHostEvent('previousPhoto', _previousPhoto, this);
		},
		destructor : function () {
			// incase we need to remove event listeners.
		}
	});
	Y.namespace('ImageWidget').slideshow = ImageWidget; 

},'0.0.0', {requires: ['gallery-yui-slideshow', 'plugin']});