YUI().use('event', 'template-base', 'handlebars', 'panel', 'viewer', 'viewer-net', function(Y) {
	var testId = '72157629427714622',
		handlebars = new Y.Template(Y.Handlebars),
		basePhotoUrl = 'https://www.flickr.com/photos/',
		photoStringFormat = handlebars.compile('http://farm{{farm}}.staticflickr.com/{{server}}/{{id}}_{{this.secret}}.jpg'),
		html = '<h1>Photo Name: {{photo}}</h1> <h2> Owner: {{owner}}</h2>';


	function Photo (photo, ownerId, ownerName) {
		this._title = photo.title;
		this._ownerId = ownerId;
		this._ownerName = ownerName;
		this._photo = photo;
	}

	Y.mix(Photo.prototype, {
		getUrl: function () {
			return photoStringFormat(this._photo);
		},
		getOwnerName: function () {
			return this._ownerName;
		},
		getTitle: function () {
			return this._title;
		}
	});

	// setup our container when dom is ready
	Y.on('domready' , function () {
		var photos = [],
			title = '',
			body,
			panel = new Y.Panel({
			srcNode: '#container',
			width: 1000,
			model: true,
			centered: true,
			buttons: [
				{
					value: 'Next',
					section: Y.WidgetStdMod.FOOTER,
					action : function (e) {
						e.halt();
						body.fire('nextPhoto');
						console.log('next photo');
					}
				},
				{
					value: 'Previous',
					section: Y.WidgetStdMod.FOOTER,
					action : function (e) {
						e.halt();
						body.fire('previousPhoto');
						console.log('previousPhoto');
					}
				}
			] 
		});

		// first make requests to get the photos we will show to the user
		Y.ViewerNet.getImages(testId, {
			success: function (set) {
				var ownerName = set.owner.name,
					ownerId = set.owner.id,
					firstPhoto;
				Y.each(set.photos, function(photo) {
					photos.push(new Photo(photo, ownerId, ownerName));
				});
				firstPhoto = photos[0];
				// NOTE if we are here, there is at least one photo
				title = handlebars.render(html, {photo: firstPhoto.getTitle(), owner: firstPhoto.getOwnerName()});
				panel.setStdModContent(Y.WidgetStdMod.HEADER, title);
				panel.render();
				body = panel.getStdModNode(Y.WidgetStdMod.BODY, true);
				body.addClass('slideshowBody');
				body.plug(Y.ImageWidget.slideshow, {photos: photos});
				
			}, failure: function() {
				Y.one('#container').setHTML('Service is currently not avaliable, please try again later');
				// requsest failed
			}
		});

		
	});
});