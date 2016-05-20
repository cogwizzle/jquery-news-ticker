/**
	Generic news ticker plugin.
	
	Data format example: [{"title":"content":"Test news story"}];

	@since 05/19/2016
	@author Joseph Fehrman
*/
(function($){
	jQuery.fn.newsTicker = function(options){
		// Initializing default settings.
 		var settings = jQuery.extend({
 			speed: 5000,
 			url: "./data.json",
 			data: "",
 			separator: ":-:"
 		}, options);

 		/**
			Function that processes data and sets up the rotator.

			@param data JSON list of news stories.
			@param element Element to transform into a rotator.
			@param settings Settings for the news ticker.
 		*/
 		var processData = function(data, element, settings){

 			// Get the size of the dataset.
            var size = jQuery(data).length;

            // For each item in teh dataset.
            jQuery(data).each(function(index, story){
            	// Set up the seperator if needed.
            	var append = "";
            	if(index + 1 < size){
            		append = settings.separator;
            	}

            	// Add the news story to the rotator.
            	jQuery(element).append(story.title + " : " + story.content + append);
            });

            // Evaluate that the length of the dataset is greater than one and set up Morphtext rotator.
            if(data.length > 1){
            	jQuery(element).Morphext({
    				// The [in] animation type. Refer to Animate.css for a list of available animations.
    				animation: "bounceInRight",
    				// An array of phrases to rotate are created based on this separator. Change it if you wish to separate the phrases differently (e.g. So Simple | Very Doge | Much Wow | Such Cool).
    				separator: settings.separator,
    				// The delay between the changing of each phrase in milliseconds.
	    			speed: settings.speed
				});
        	}

        	// Add info class to the rotator.
			jQuery(element).addClass("alert-info");
        }

        // Get the element to be transformed into a new-ticker.
 		var selectedElement = this;
 		// Evaluate that data is not empty.
        if(settings.data != "" && settings.data != undefined){
        	// Get dataset from settings.
        	var data = jQuery.parseJSON(settings.data);

        	// Set up rotator.
        	processData(data, selectedElement, settings);
        }else{
        	// Evaluate that data is empty.

        	// Send ajax request to the url.
        	jQuery.get(settings.url, function(data){

        		// Set up rotator.
        		processData(data, selectedElement, settings);
        	}, "json").fail(function(){
        		// Ajax request failed and an error is thrown.
            	console.log("An error has occured while attempting to load the news.")
        	});
        }
	}
}(jQuery));