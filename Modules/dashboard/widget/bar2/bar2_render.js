/*
	 All emon_widgets code is released under the GNU General Public License v3.
	 See COPYRIGHT.txt and LICENSE.txt.

		---------------------------------------------------------------------
		Part of the OpenEnergyMonitor project:
		http://openenergymonitor.org

		Author: Trystan Lea: trystan.lea@googlemail.com
		If you have any questions please get in touch, try the forums here:
		http://openenergymonitor.org/emon/forum
 */

// Convenience function for shoving things into the widget object
// I'm not sure about calling optionKey "optionKey", but I don't want to just use "options" (because that's what this whole function returns), and it's confusing enough as it is.
function addOption(widget, optionKey, optionType, optionName, optionHint, optionData)
{

	widget["options"    ].push(optionKey);
	widget["optionstype"].push(optionType);
	widget["optionsname"].push(optionName);
	widget["optionshint"].push(optionHint);
	widget["optionsdata"].push(optionData);


}
function bar2_widgetlist()
{
	var widgets =
	{
		"bar2":
		{
			"offsetx":-80,"offsety":-80,"width":160,"height":200,
			"menu":"Widgets",
			"options":    [],
			"optionstype":[],
			"optionsname":[],
			"optionshint":[],
			"optionsdata":[]

		}
	};

	var fontoptions = [
					[5, "Arial Black"],
					[4, "Comic Sans MS"],
					[3, "Courier New"],
					[2, "arial"],
					[1, "Georgia"],
					[0, "Impact"]
				];
	
	
	var graduationDropBoxOptions = [
					[0, "Off"],
					[1, "On"]
					];

	addOption(widgets["bar2"], "title",			"value",			_Tr("Title"),			_Tr("Title of bar"),                                                                []);
	addOption(widgets["bar2"], "title_colour",	"colour_picker",	_Tr("Title Colour"),	_Tr("Colour of title"), 					                                        []);
	addOption(widgets["bar2"], "font",      		"dropbox",       	_Tr("Font used"),		_Tr("Font used"),																	fontoptions);
	addOption(widgets["bar2"], "feedid",      	"feedid",        	_Tr("Feed"),			_Tr("Feed value"),                                                                  []);
	addOption(widgets["bar2"], "max",         	"value",         	_Tr("Max value"),       _Tr("Max value to show"),                                                           []);
	addOption(widgets["bar2"], "scale",       	"value",         	_Tr("Scale"),           _Tr("Value is multiplied by scale before display. Defaults to 1"),                  []);
	addOption(widgets["bar2"], "units",       	"value",         	_Tr("Units"),           _Tr("Unit type to show after value. Ex: <br>\"{Reading}{unit-string}\""),           []);
	addOption(widgets["bar2"], "offset",      	"value",         	_Tr("Offset"),          _Tr("Static offset. Subtracted from value before computing position (default 0)"),  []);
	addOption(widgets["bar2"], "colour",      	"colour_picker", 	_Tr("Colour"),          _Tr("Colour to draw bar in"),                                                       []);
	addOption(widgets["bar2"], "graduations", 	"dropbox",       	_Tr("Graduations"),     _Tr("Should the graduations be shown"),  											graduationDropBoxOptions);
	addOption(widgets["bar2"], "gradNumber",  	"value",         	_Tr("Num Graduations"), _Tr("How many graduation lines to draw (only relevant if graduations are on)"),     []);



	return widgets;
}

function bar2_init()
{
	setup_widget_canvas('bar2');
}

function bar2_draw()
{
	$('.bar2').each(function(index)
	{
		var font = $(this).attr("font");
		var title = $(this).attr("title");
		var feedid = $(this).attr("feedid");
		if (associd[feedid] === undefined) { console.log("Review config for feed id of " + $(this).attr("class")); return; }
		var val = curve_value(feedid,dialrate);
		// ONLY UPDATE ON CHANGE
		if ((val * 1).toFixed(2) != (associd[feedid]['value'] * 1).toFixed(2) || redraw == 1)
		{
			var id = "can-"+$(this).attr("id");
			var scale = 1*$(this).attr("scale") || 1;
			draw_bar2(widgetcanvas[id],
								 0,
								 0,
								 $(this).attr("title"),
								 $(this).attr("font"),
								 $(this).width(),
								 $(this).height(),val*scale,
								 $(this).attr("max"),
								 $(this).attr("units"),
								 $(this).attr("colour"),
								 $(this).attr("title_colour"),
								 $(this).attr("offset"),
								 $(this).attr("graduations"),
								 $(this).attr("gradNumber")
								 );
		}
	});
}

function bar2_slowupdate()
{

}

function bar2_fastupdate()
{
	bar2_draw();
}


function draw_bar2(context,
				x_pos,				// these x and y coords seem unused?
				y_pos,
				title,
				font,
				width,
				height,
				raw_value,
				max_value,
				units_string,
				display_colour,
				title_colour,
				static_offset,
				graduationBool,
				graduationQuant)
{
	if (!context)
		return;

	context.clearRect(0,0,width+10,height+10); // Clear old drawing

	// if (1 * max_value) == false: 3000. Else 1 * max_value
	max_value = 1 * max_value || 3000;
	// if units_string == false: "". Else units_string
	units_string = units_string || "";
	title = title || "";
	font = font || "arial black";

	static_offset = 1*static_offset || 0;
	var display_value = raw_value
	display_value = display_value-static_offset

	var scaled_value = (display_value/max_value);    // Produce a scaled 0-1 value corresponding to min-max
	if (scaled_value < 0)
		scaled_value = 0;

	var size = 0;
	if (width<height)
		size = width/2;
	else
		size = height/2;

	size = size;
	
	
	if (font == 0)
	{
		fontname = "Impact"
		}
	
	
	if (font == 1)
	{
		fontname = "Georgia"
		}
	
	if (font == 2)
	{
		fontname = "arial"
		}
	
	if (font == 3)
	{
		fontname = "Courier New"
		}
		
	if (font == 4)
	{
		fontname = "Comic Sans MS"
		}
		
	if (font == 5)
	{
		fontname = "Arial Black"
		}
	
	if (graduationBool == 1)
	{
		height = height - (size/2)
		width = width - (size)
	}

	var half_width = width/2;
	var half_height = height/2;


	if (!display_value)			// Clamp value so we don't draw negative values.
		display_value = 0;

	context.lineWidth = 1;
	context.strokeStyle = "#000";
	var border_space = 5;
	context.strokeRect(border_space,
					border_space,
					width-(border_space*2),
					height-(border_space*2));


	context.lineWidth = 0;
	if (display_colour.indexOf("#") == -1)			// Fix missing "#" on colour if needed
		display_colour = "#" + display_colour;

	context.fillStyle = display_colour;

	var bar_border_space = 10;
	var bar_top = ((height-bar_border_space) - (scaled_value * (height - (bar_border_space*2))));

	if (bar_top < bar_border_space)		// Clamp value so we don't overshoot the top of the bargraph.
		bar_top = bar_border_space;

	context.fillRect(bar_border_space,
					bar_top,
					width-(bar_border_space*2),
					(height-bar_border_space) - bar_top );

// print title

if (title_colour.indexOf("#") == -1)			// Fix missing "#" on colour if needed
	title_colour = "#" + title_colour;

					
					
	if (graduationBool == 1)
	{

		// context.font = "bold "+(size*0.22)+"px arial";

		// var posStrt = polar_to_cart(size/1.15, 90+spreadAngle, half_width, half_height);
		// var posStop = polar_to_cart(size/1.15, 90-spreadAngle, half_width, half_height);

		// context.save()
		// context.translate(posStrt[0], posStrt[1]);
		// context.rotate(deg_to_radians(-45));
		// context.fillText(""+static_offset+units_string, 0, 0);        // Since we've translated the entire context, the coords we want to draw at are now at [0,0]
		// context.restore();

		// context.save(); // each context.save is only good for one restore, apparently.
		// context.translate(posStop[0], posStop[1]);
		// context.rotate(deg_to_radians(45));
		// context.fillText(""+(static_offset+max_value)+units_string, 0, 0);
		// context.restore();



		if (graduationQuant > 0)
		{

			context.fillStyle = "#000";
			context.textAlign    = "start";
			context.font = ((size*0.15)+"px "+ fontname);

			var step = (height-border_space*2)/(Number(graduationQuant)+1);
			var curY;

			context.fillText((static_offset+max_value)+units_string, width+(size*0.1), 10+size*0.15);
			var divisions = Number(graduationQuant)+1;
			for (var y = 0; y < graduationQuant; y++)
			{
				curY = Number(((y+1)*step).toFixed(0))+0.5;  // Bin down so we're drawing in the middle of the pixel, so the line is exactly 1 px wide
				context.moveTo(border_space, curY);
				context.lineTo(width-border_space, curY);

				var unitOffset = Number(static_offset+((graduationQuant-y)*(max_value/divisions)))
				if (unitOffset < 1000)
					unitOffset = unitOffset.toFixed(1)
				else
					unitOffset = unitOffset.toFixed(0)
				context.fillText(unitOffset+units_string, width+(size*0.1), curY+(size*0.1));
			}
			context.fillText(static_offset+units_string, width+(size*0.1), height-10);

			context.strokeStyle = "#888";
			context.stroke();
		}
	}



	if (raw_value>100)
	{
		raw_value = raw_value.toFixed(0);
	}
	else if (raw_value>10)
	{
		raw_value = raw_value.toFixed(1);
	}
	else
	{
		raw_value = raw_value.toFixed(2);
	}


	if (graduationBool == 1)
	{
		if (raw_value > 1000)		// Add additional offset to make alignment work for HUGE numbers
		half_width += (size*0.20)
		context.fillStyle = "#000";
		context.textAlign    = "center";
		context.font = ((size*0.25)+"px "+ fontname);
		context.fillText(raw_value+units_string, half_width+(size*0.5), height + (size*0.49));
		context.fillStyle = title_colour;
		context.font = ((size*0.2)+"px "+ fontname);
		context.textAlign    = "center";
		context.fillText(title+":", half_width + (size * 0.5), height/100 + (size * 3.3));					
	}
	else
	{
		context.fillStyle = "#000";
		context.textAlign    = "center";
		context.font = ((size*0.5)+"px "+ fontname);
		context.fillText(raw_value+units_string, half_width, height/2 + (size*0.2));
		context.fillStyle = title_colour;
		context.textAlign    = "center";
		context.font = ((size*0.2)+"px "+ fontname);
		context.fillText(title, half_width, height/7 + (size *0.1));
		

	}



	context.fillStyle = "#000";
	var spreadAngle = 32;


}


