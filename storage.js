chrome.storage.local.remove("netflix-wishlist",function(){});

netflixWishlist.storage["addMovie"] = function(movieData, callback) {
	// get the existing stored movies
	chrome.storage.local.get("netflix-wishlist", function(movieList) {
		if (movieList["netflix-wishlist"]) movieList = movieList["netflix-wishlist"];
		// add this movie to it
		movieList["id-"+movieData.id] = movieData;
		// store again
		//chrome.storage.local.set({'netflix-wishlist': {"testKey": {"testKey2": "testValue"}}}, function(result) {
		chrome.storage.local.set({'netflix-wishlist': movieList}, function(result) {
			//console.debug(chrome.runtime.lastError);
			chrome.storage.local.get('netflix-wishlist', function(data) {
				console.debug(data);
			});
			//if (jQuery.isFunction(callback)) callback(result); 
		});
	});
	
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
  
  	if (typeof changes["netflix-wishlist"] !== 'undefined') {
		chrome.tabs.getCurrent(function(tab) {
			console.debug(tab);
			chrome.tabs.sendMessage(tab.id, { 
				"type": netflixWishlist.MESSAGE_TYPE_WISH_LIST_CHANGED, 
				"wishlist": changes["netflix-wishlist"] }, 
				function(response) {})	
		});
		
	}

  	for (key in changes) { 
    	var storageChange = changes[key];
    	console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});

// limit the number of calls to sync storage
netflixWishlist.storage["syncMovies"] = function(movieDataCollection) {

}



// // only sync when netflix tab is closed
// chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
// 	console.debug(removeInfo);

// 	// if this is the netflix tab, move local movies to sync storage

// });