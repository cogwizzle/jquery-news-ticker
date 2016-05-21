/**
	Generic news ticker plugin.
	
	Data format example: [{"title":"Test", "content":"Test news story", "type" : "info"}];

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
 			separator: ":-:",
            animationIn: "bounceInRight",
            animationOut: "bounceOutLeft"
 		}, options);

        /**
            Create the story divs for the rotator.

            @param data List of news stories.
            @param element Root element of the rotator.
        */
        var createRotatorStories = function(data, element){
            // For each item in the dataset.
            jQuery(data).each(function(index, story){

                // Set up the type of article.
                var type = "";
                if(story.type != undefined){
                    type = story.type;
                }

                // Create the article div element.
                var storyDiv = "<div class=\"animated alert\" type=\"" + type + "\">" + story.title + " : " + story.content + "</div>";
                // Add the news story to the rotator.
                jQuery(element).append(storyDiv);
            });

            // Return a list of created elements.
            return jQuery(element).children("div");
        }

        /**
            Initialize the rotator.

            @param stories Article elements in rotator.
            @param animationIn Entry animation.
            @param animationOut Exit animation.
        */
        var setupRotator = function(stories, animationIn, animationOut){
            jQuery(stories).hide();
            var story = stories[0];
            jQuery(story).addClass(retrieveBsClass(story));
            jQuery(story).show();
            jQuery(story).addClass(animationIn);
        };

        /**
            Infinite rotation loop.

            @param element Root element of the rotator.
            @param stories Article elements in rotator.
            @param storyIndex Current index in rotator loop.
            @param speed Speed of rotator transition.
            @param animationIn Entry animation.
            @param animationOut Exit animation.
        */
        var loopRotator = function(element, stories, storyIndex, speed, animationIn, animationOut){
            setTimeout(function(){
                clearClass(element);
                exitAnimate(element, animationIn, animationOut);
                setTimeout(function(){
                     jQuery(element).children(":visible").hide();
                    var story = stories[storyIndex];
                    jQuery(story).removeClass(animationOut);
                    jQuery(element).addClass(retrieveBsClass(story));
                    jQuery(story).show();
                    jQuery(story).addClass(animationIn);
                    storyIndex++;
                    if(storyIndex >= stories.length){
                        storyIndex = 0;
                    }
                    loopRotator(element, stories, storyIndex, speed, animationIn, animationOut);
                }, 400);
            }, speed);
        }

        /**
            Clear all of the bootstrap classes off of the main element.

            @param element Root element of the rotator.
        */
        var clearClass = function(element){
            jQuery(element).removeClass("alert-success");
            jQuery(element).removeClass("alert-info");
            jQuery(element).removeClass("alert-warning");
            jQuery(element).removeClass("alert-danger");
        };

        /**
            Call the exit animation for the visible elements.

            @param element Root element of the rotator.
            @param animationIn Entry animation.
            @param animationOut Exit animation.
        */
        var exitAnimate = function(element, animationIn, animationOut){
            jQuery(jQuery(element).children(":visible")).removeClass(animationIn);
            jQuery(jQuery(element).children(":visible")).addClass(animationOut);
        }

        /**
            Get the bootstrap class for alerts.
            
            @param story Article element that is active.
        */
        var retrieveBsClass = function(story){
            var type = jQuery(story).attr("type");
            switch(type){
                case "success":
                    return "alert-success";
                    break;
                case "info":
                    return "alert-info";
                    break;
                case "warning":
                    return "alert-warning";
                    break;
                case "danger":
                    return "alert-danger";
                    break;
                default:
                    return "alert-none";
            }
        };



        // Get the element to be transformed into a new-ticker.
 		var selectedElement = this;
 		// Evaluate that data is not empty.
        if(settings.data != "" && settings.data != undefined){
            // Get dataset from settings.
            var data = jQuery.parseJSON(settings.data);
            // Set up rotator.
            var storySpans = createRotatorStories(data, selectedElement);
            setupRotator(storySpans, settings.animationIn, settings.animationOut);
            if(storySpans.length > 1){
                loopRotator(selectedElement, storySpans, 1, settings.speed, settings.animationIn, settings.animationOut);
            }
        }else{
        	// Evaluate that data is empty.

        	// Send ajax request to the url.
        	jQuery.get(settings.url, function(data){
        		// Set up rotator.
        		var storySpans = createRotatorStories(data, selectedElement);
                setupRotator(storySpans, settings.animationIn, settings.animationOut);
                if(storySpans.length > 1){
                    loopRotator(selectedElement, storySpans, 1, settings.speed, settings.animationIn, settings.animationOut);
                }
        	}, "json").fail(function(){
        		// Ajax request failed and an error is thrown.
            	console.log("An error has occured while attempting to load the news.")
        	});
        }
	}
}(jQuery));
