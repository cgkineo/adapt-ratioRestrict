/*
* adapt-ratioRestrict
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Oliver Foster <oliver.foster@kineo.com>
*/

define(function(require) {

	var Adapt = require('coreJS/adapt');
	var Backbone = require('backbone');


	var ratioRestrict = {
		//apply relevant style for aspect ratio and screen size type
		applyStyles: function() {
			var ss = ratioRestrict.getScreenSize();
			var $html = $("html");

			var aspectRatios = [ "screen", "widescreen", "extrawidescreen" ];
			var screenSizes = [ "small", "medium", "large", "extralarge" ];

			$html.addClass(ss.aspectratio );
			$html.removeClass(_.difference(aspectRatios, [ss.aspectratio]).join(" "));
			
			$html.addClass(ss.devicesize);
			$html.removeClass(_.difference(screenSizes, [ss.devicesize]).join(" "));
			
		},

		//calculate screen ratio and screen size type
		getScreenSize: function() {
			var height = replacementHeight.call($(window));
			var width = replacementWidth.call($(window));

			var ratio = Math.floor(width/height*100)/100;

			var aspectratio = 
				(ratio > (16/9))
					? "extrawidescreen"
					: (ratio > (4/3))
						? "widescreen"
						: "screen";

			var devicesize = (
				(width <= 520 || height <= 520 / ratio) 
					? "small" 
					: (width <= 760 || height <= 760 / ratio) 
						? "medium"
						: (width > 1024 || height > 1024 / ratio ) 
							? "extralarge"  
							: (width > 760 || height > 760 / ratio)
								? "large" 
								: "large"

				);

			return { 
				height:height, 
				width:width, 
				ratio: ratio, 
				aspectratio: aspectratio,
				devicesize:devicesize
			};
		}
	};

	//replace jquery height and width function to restrict window height and width values
	var replacementHeight = function() {
		if (this[0] === window && arguments.length === 0) {
			var h = replacementHeight.orig.call(this);
			var mh = $("html").css("max-height");
			if (mh != "none") {
				mh = parseInt(mh);
				if (h < mh) return h;
				else return mh;
			}
		}
		if (arguments.length > 0) {
			return replacementHeight.orig.apply(this, arguments);
		} else {
			return replacementHeight.orig.call(this);
		}
	};
	replacementHeight.orig = $.fn.height;
	$.fn.height = replacementHeight;

	var replacementWidth = function() {
		if (this[0] === window && arguments.length === 0) {
			var w = replacementWidth.orig.call(this);
			var mw = $("html").css("max-width");
			if (mw != "none") {
				mw = parseInt(mw);
				if (w < mw) return w;
				else return mw;
			}
		}
		if (arguments.length > 0) {
			return replacementWidth.orig.apply(this, arguments);
		} else {
			return replacementWidth.orig.call(this);
		}
	};
	replacementWidth.orig = $.fn.width;
	$.fn.width = replacementWidth;


	//trigger apply styles on window resize
	$(window).on('resize', function() {
		ratioRestrict.applyStyles();
	});

	//initial apply
	ratioRestrict.applyStyles();

	return ratioRestrict;

})