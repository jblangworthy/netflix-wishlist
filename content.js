function querystring(key, url) {
   var re=new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
   var r=[], m;
   var querystring;
   if (!url) url = document.location.search;
   while ((m=re.exec(url)) != null) r.push(m[1]);
   return r;
}


netflixWishList = function() {
	var self;
	return {
		init: function() {
			self = this;
			console.debug(this);
			this.addListeners();
			this.updateNav();
		},
		addListeners: function() {
			// listen for messages from extension, asking for more movie data
			chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
				if (request) {
					switch (request.type) {
						case netflixWishlist.MESSAGE_TYPE_MOVIE_DATA_REQUEST:
							var movieData = request.movieData;
							if (movieData.linkUrl) {
								movieData.id = querystring("movieid", movieData.linkUrl)[0];	
								// find the element that was clicked on
								// get the image url and title
								var coverImg = $("a[href*='"+movieData.linkUrl+"']").siblings("img.boxShotImg")[0];
								movieData.title = $(coverImg).attr("alt");
								movieData.imageUrl = $(coverImg).attr("src");

							}
							sendResponse(movieData);
							break;
						case netflixWishlist.MESSAGE_TYPE_WISH_LIST_CHANGED:
							var wishList = request.wishList;
							break;
					}	
				}
			});

		},
		updateNav: function(count) {
			if (!count) count = 0;
			// add wish list item to nav
			if ($("#nav-wishlist").length == 0) {
				var wishlistNavItem = $("#global-header").children("li.nav-item").last().clone()[0];
				$(wishlistNavItem).attr("id","nav-wishlist")
								  .removeClass("nav-taste")
								  .removeClass("dropdown-trigger");
				$(wishlistNavItem).find("span.right-arrow").remove();
				$(wishlistNavItem).appendTo("#global-header");
			}
			// update wish text 
			$("#nav-wishlist").children(".content").children("a").text("Wish List ("+count+")");

		}
	}
}();

netflixWishList.init();


