/*
   All emon_widgets code is released under the GNU General Public License v3.
   See COPYRIGHT.txt and LICENSE.txt.

    ---------------------------------------------------------------------
    Part of the OpenEnergyMonitor project:
    http://openenergymonitor.org

    Author: Trystan Lea: trystan.lea@googlemail.com
    If you have any questions please get in touch, try the forums here:
    http://openenergymonitor.org/emon/forum
	
	Windrose Widget to visualize wind or flow direction
 */

// Global variables
var img = null,
  needle = null;
  
function windrose_widgetlist()
{
  var widgets = {
    "windrose":
    {
      "offsetx":-80,"offsety":-80,"width":200,"height":200,
      "menu":"Widgets",
      "options":["feedid"],
      "optionstype":["feedid"],
      "optionsname":[_Tr("Feed")],
      "optionshint":[_Tr("Feed")]

    }
  }
  return widgets;
}

function windrose_init()
{
  setup_widget_canvas('windrose');

  // Load the windrose image
  background2 = new Image();
  background2.src = path+'Modules/dashboard/widget/windrose/Compass_rose.png';
  
  // Load the needle image
  direction2 = new Image();
  direction2.src = path+'Modules/dashboard/widget/windrose/needle3.png';
  
}

function windrose_draw() {

//windrosebase()
	
$('.windrose').each(function(index)
	{
	var id = "can-"+$(this).attr("id");
	var scale = 1*$(this).attr("scale") || 1;
	draw_windrosebase(widgetcanvas[id],0,0,$(this).width(),$(this).height());	
	});


	//windrose_Get1()
	{
		$('.windrose').each(function(index)
		{
		var feedid = $(this).attr("feedid");
		if (associd[feedid] === undefined) { console.log("Review config for feed id of " + $(this).attr("class")); return; }
		var val = curve_value(feedid, dialrate);
		// ONLY UPDATE ON CHANGE
		if ((val * 1).toFixed(2) != (associd[feedid]['value'] * 1).toFixed(2) || redraw == 1);
		var id = "can-"+$(this).attr("id");
		var scale = 1*$(this).attr("scale") || 1;
		draw_windrose(widgetcanvas[id],0,0,$(this).width(),$(this).height(),val*scale,$(this).attr("max"),$(this).attr("units"));
		});
	}
	

}

function windrose_slowupdate()
{

}

function windrose_fastupdate()
{
  windrose_draw();
}

function draw_windrosebase(ctx,x,y,width,height)
{
  
  var offset = 45;
  var size = 0;
  if (width>height) {
    size = height;
  } else {
    size = width;
  }
  if (size>300) size=290;
  if (size<120) size=120;
   
  ctx.clearRect(0,0,width,height);

  // Draw the windrose onto the canvas
  ctx.drawImage(background2, 0, 0, size, size);
  }

function draw_windrose(ctx,x,y,width,height,value,max,units)
{
 
  if (!max) max = 360;
  if (!value) value = 0;
  if (!units) units = " ";
  var offset = 180;
  var position = ((value*360)/max);
    if (position > 360) {
    position = 360;

  }

  var size = 0;
  if (width>height) {
    size = height;
  } else {
    size = width;
  }
  if (size>300) size=290;
  if (size<120) size=120;
 
  
  // Save the current drawing state
  ctx.save();

  // move to the middle of the image
  ctx.translate((size/2), (size/2));

  // Rotate around this point
  ctx.rotate((position + offset) * (Math.PI / 180));

  // Draw the image back and up
  ctx.drawImage(direction2, -(size/2), -(size/2), size, size);
  
  // Restore the previous drawing state
  ctx.restore(); 
  }