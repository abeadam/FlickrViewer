// This Module will have static functions to send request to the flickr server
YUI.add('viewer-net', function(Y) {
	var url = 'https://api.flickr.com/services/rest/',
		apiData = 'method=flickr.photosets.getPhotos&api_key=7125f3307c29875363607779003f4e84&format=json&nojsoncallback=1',
		config = {
			method: 'GET',
			xdr: {use: 'native'}
		};
	function getImages(setId, callBack) {
		//success will be called if we get expected json data
		// with status success otherwise failure will be called
		var onSuccess = function (photoset) {
			// stat success
			console.log('request success');
			callBack.success({
				owner: {
					name: photoset.ownername,
					id: photoset.owner
				},
				photos: photoset.photo 
			});
		}, onFailure = function (reason) {
			// stat failure
			console.log('request failed: '+reason);
			callBack.failure();
		}

		apiData +='&photoset_id='+setId;
		
		config.data = apiData;
		config.on = {
			success: function (id, res) {
				var json;
				try {
					json = Y.JSON.parse(res.response);
					if (json.stat === 'ok' && json.photoset) {
						if (!(json.photoset.photo && json.photoset.photo.length)) {
							// can result from empty set
							throw 'no photos returned';
						}
						onSuccess(json.photoset);
					} else {
						onFailure(json.message);
					}
				} catch (e) {
					onFailure(e);
				}
			},
			failure: function (id, res) {
				onFailure('request failed with status: '+res.status);
			}
		}
		Y.io(url, config);
	}

	Y.namespace('ViewerNet').getImages = getImages; 
}, '0.0.0', {requires: ['io','json']});