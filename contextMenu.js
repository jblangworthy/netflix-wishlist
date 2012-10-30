// listeners
netflixWishlist.contextMenus["onClickHandler"] = function(info, tab) {
	var movieData = { 
		id: "",
		imageUrl: "",
		linkUrl: info.linkUrl,
		title: ""
	}; 
	// we have the url, need more 
	chrome.tabs.sendMessage(tab.id, { 
		"type": netflixWishlist.MESSAGE_TYPE_MOVIE_DATA_REQUEST, 
		"movieData": movieData }, 
		function(response) {
		// callback
		if (response) {
			// store movie here
			netflixWishlist.storage.addMovie(response, function(storeResponse) {
				//console.debug(storeResponse);
				chrome.storage.local.get(response.id,function(data) {
					console.debug(data);
				})
			});

		}
	})
}

// create menu item
chrome.contextMenus.create({
	"documentUrlPatterns":  ["*://movies.netflix.com/*"],
	"title": "Add to Wishlist",
	"contexts": ["link"],
	"onclick": netflixWishlist.contextMenus.onClickHandler,
	"targetUrlPatterns": ["*://*/WiPlayer?movieid*"]
});
