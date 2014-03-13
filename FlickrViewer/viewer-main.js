YUI().use('event', 'template-base', 'handlebars', 'panel', 'viewer', 'viewer-net', function(Y) {
	var testId = '72157629427714622',
		handlebars = new Y.Template(Y.Handlebars),
		basePhotoUrl = 'https://www.flickr.com/photos/',
		photoStringFormat = handlebars.compile('http://farm{{farm}}.staticflickr.com/{{server}}/{{id}}_{{this.secret}}.jpg'),
		html = '<h1>Photo Name: {{photo}}</h1> <h2> Owner: {{owner}}</h2>',
		idReg = /^\d+$/;


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

	// this function is going to create initial load view
	function createInitialView ( onSendId ) {
				// setup the first page to ask the user for the id of the flickr set tha they would like to see
		var body = document.createElement('div'),
			input = document.createElement('input'),
			getSetButton = document.createElement('button'),
			getDefaultButton = document.createElement('button');
			defaultLabel = document.createElement('label'),
			getFlickr = function (id) {
				onSendId(id);
			};
		body.classList.add('initialLoad');
		input.setAttribute('type','text');
		getSetButton.innerHTML = 'Get Flickr Set';
		getDefaultButton.innerHTML = 'Get Default Flickr Set';
		defaultLabel.innerHTML = 'Flickr Set Search: ';
		body.appendChild(defaultLabel);
		body.appendChild(input);
		body.appendChild(getSetButton);
		body.appendChild(getDefaultButton);

		getDefaultButton.addEventListener('click', function() {
			getFlickr(testId);
		});
		getSetButton.addEventListener('click', function() {
			var id = input.value;
			if (idReg.test(id)) {
				getFlickr(id);
			} else {
				// if the user didn't enter anything or entered wrong thing show the default
				getFlickr(testId);
			}
		});


		return body;
	}

	// setup our container when dom is ready
	Y.on('domready' , function () {
		var photos = [],
			title = '',
			body,
			loadFlickrViewer,
			panel,
			srcNode = Y.one('#container');
	
		loadFlickrViewer = function (id) {
		// first make requests to get the photos we will show to the user
			Y.ViewerNet.getImages(id, {
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
					body = panel.getStdModNode(Y.WidgetStdMod.BODY, true);
					// remove the old body
					body.setHTML();
					body.addClass('slideshowBody');
					body.on('updateTitle', function (photoInfo) {
						console.log('Updating Title');
						panel.setStdModContent(Y.WidgetStdMod.HEADER, handlebars.render(html, photoInfo))
					});

					//add navigation buttons
					panel.addButton ({
						value: 'Previous',
						action : 'onPrevious'
					}, [selection = Y.WidgetStdMod.FOOTER]);

					panel.addButton({
						value: 'Next',
						action : 'onNext'
					}, [selection = Y.WidgetStdMod.FOOTER]);
	
					body.plug(Y.ImageWidget.slideshow, {photos: photos});
					
				}, failure: function() {
					Y.one('#container').setHTML('Service is currently not avaliable, please try again later');
					// requsest failed
				}
			});
		}

		panel = new Y.Panel({
			srcNode: srcNode,
			width: 1000,
			model: true,
			centered: false,
			bodyContent:  createInitialView(loadFlickrViewer),
			align: {node: srcNode,  points:[Y.WidgetPositionAlign.TC, Y.WidgetPositionAlign.TC]}
		});
		panel.onNext = function (e){
			e.halt();
			body.fire('nextPhoto');
		};
		panel.onPrevious = function (e){
			e.halt();
			body.fire('previousPhoto');
		};
		panel.render();

	});
});