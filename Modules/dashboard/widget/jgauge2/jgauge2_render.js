/*
   All emon_widgets code is released under the GNU General Public License v3.
   See COPYRIGHT.txt and LICENSE.txt.

    ---------------------------------------------------------------------
    Part of the OpenEnergyMonitor project:
    http://openenergymonitor.org

    Author: Trystan Lea: trystan.lea@googlemail.com
    If you have any questions please get in touch, try the forums here:
    http://openenergymonitor.org/emon/forum
	
	Addition of 2nd needle to allow for max value visualization - done by Andreas Messerli - firefox7518@gmail.com
	Fully configurable via normal widget settings
 */

// Global variables
var img = null,
  needle = null,
  needle2 = null;


function jgauge2_widgetlist()
{
  var widgets = {
    "jgauge2":
    {
      "offsetx":-80,"offsety":-80,"width":160,"height":160,
      "menu":"Widgets",
      "options":["feedid", "feedid2", "scale", "max", "units"],
      "optionstype":["feedid","feedid","value","value","value"],
      "optionsname":[_Tr("Feed 1"),_Tr("Feed 2"),_Tr("Scale"),_Tr("Max value"),_Tr("Units")],
      "optionshint":[_Tr("Feed 1"),_Tr("Feed 2 (Min/Max for example)"),_Tr("Scale applied to value"),_Tr("Max value to show"),_Tr("Units to show")]

    }
  }
  return widgets;
}

function jgauge2_init()
{
  setup_widget_canvas('jgauge2');

  // Load the jgauge2 image
  img_jgauge2 = new Image();
  img_jgauge2.src = path+'Modules/dashboard/widget/jgauge2/jgauge2.png';
  
  // Load the needle image
  needle_jgauge2 = new Image();
  needle_jgauge2.src = path+'Modules/dashboard/widget/jgauge2/needle2.png';
  
  needle2_jgauge2 = new Image();
  needle2_jgauge2.src = path+'Modules/dashboard/widget/jgauge2/needle3.png';



}

function jgauge2_draw() {

//jgauge2base()
	
$('.jgauge2').each(function(index)
	{
	var id = "can-"+$(this).attr("id");
	var scale = 1*$(this).attr("scale") || 1;
	draw_jgauge2base(widgetcanvas[id],0,0,$(this).width(),$(this).height());	
	});


	//jgauge2_Get2()
	{
		$('.jgauge2').each(function(index)
		{
		var feedid2 = $(this).attr("feedid2");
		if (associd[feedid2] === undefined) { console.log("Review config for feed id of " + $(this).attr("class")); return; }
		var val2 = curve_value(feedid2, dialrate);
		// ONLY UPDATE ON CHANGE
		if ((val2 * 1).toFixed(2) != (associd[feedid2]['value'] * 1).toFixed(2) || redraw == 1);
		var id = "can-"+$(this).attr("id");
		var scale = 1*$(this).attr("scale") || 1;
		draw_jgauge22(widgetcanvas[id],0,0,$(this).width(),$(this).height(),val2*scale,$(this).attr("max"));
		});
	}
	
	//jgauge2_Get1()
	{
		$('.jgauge2').each(function(index)
		{
		var feedid = $(this).attr("feedid");
		if (associd[feedid] === undefined) { console.log("Review config for feed id of " + $(this).attr("class")); return; }
		var val = curve_value(feedid, dialrate);
		// ONLY UPDATE ON CHANGE
		if ((val * 1).toFixed(2) != (associd[feedid]['value'] * 1).toFixed(2) || redraw == 1);
		var id = "can-"+$(this).attr("id");
		var scale = 1*$(this).attr("scale") || 1;
		draw_jgauge2(widgetcanvas[id],0,0,$(this).width(),$(this).height(),val*scale,$(this).attr("max"),$(this).attr("units"));
		});
	}
	

}

function jgauge2_slowupdate()
{

}

function jgauge2_fastupdate()
{
  jgauge2_draw();
}

function draw_jgauge2base(ctx,x,y,width,height)
{
  
  var offset = 45;
  var size = 0;
  if (width>height) {
    size = height;
  } else {
    size = width;
  }
  if (size>170) size=170;
  if (size<120) size=120;
   
  ctx.clearRect(0,0,width,height);

  // Draw the jgauge2 onto the canvas
  ctx.drawImage(img_jgauge2, 0, 0, size, size);
  }

function draw_jgauge2(ctx,x,y,width,height,value,max,units)
{
 
  if (!max) max = 1000;
  if (!value) value = 0;
  if (!units) units = " ";
  var offset = 45;
  var position = ((value*270)/max);
    if (position > 270) {
    position = 270;

  }


  var size = 0;
  if (width>height) {
    size = height;
  } else {
    size = width;
  }
  if (size>170) size=170;
  if (size<120) size=120;
  
  
  decimalPlaces = 0;
  if (max <= 1.2)  decimalPlaces = 2;
  else if (max <= 12)  decimalPlaces = 1;
     
  //ticks labels
  max = max/6;
  ctx.font = "8pt Arial";
  ctx.fillStyle = "rgb(34,198,252)";
  ctx.fillText(0, 28*(size/100), 70*(size/100)); // first tick
  ctx.fillText(Number((max*1).toFixed(decimalPlaces)), 20*(size/100), 52*(size/100)); // second tick
  ctx.fillText(Number((max*2).toFixed(decimalPlaces)), 25*(size/100), 33*(size/100)); // third tick
  ctx.fillText(Number((max*3).toFixed(decimalPlaces)), 45*(size/100), 22*(size/100)); // 4th tick
  ctx.fillText(Number((max*4).toFixed(decimalPlaces)), 65*(size/100), 33*(size/100)); // 5th tick
  ctx.fillStyle = "rgb(245,144,0)";
  ctx.fillText(Number((max*5).toFixed(decimalPlaces)), 75*(size/100), 52*(size/100)); // 6th tick
  ctx.fillStyle = "rgb(255,0,0)";
  ctx.fillText(Number((max*6).toFixed(decimalPlaces)), 65*(size/100), 70*(size/100)); // 7th tick
  
  // main label
  ctx.font = "14pt Calibri,Geneva,Arial";
  ctx.strokeStyle = "rgb(255,255,255)";
  ctx.fillStyle = "rgb(255,255,255)";
  value = Number(value.toFixed(decimalPlaces));
  len = value.toString().length;
  if (len < 2) {
    ctx.fillText(value+units, 43*(size/100), 85*(size/100));
  }
  else if ((len<3) && (len>2)) {
    ctx.fillText(value+units, 40*(size/100), 85*(size/100));
  }
  else {
    ctx.fillText(value+units, 37*(size/100), 85*(size/100));
	
  }	 
	 
   
  // Save the current drawing state
  ctx.save();

  // move to the middle of the image
  ctx.translate((size/2), (size/2));

  // Rotate around this point
  ctx.rotate((position + offset) * (Math.PI / 180));

  // Draw the image back and up
  ctx.drawImage(needle_jgauge2, -(size/2), -(size/2), size, size);
  
  // Restore the previous drawing state
  ctx.restore(); 
  }
  
  function draw_jgauge22(ctx,x,y,width,height,value,max,units)
{
 
  if (!max) max = 1000;
  if (!value) value = 0;
  if (!units) units = " ";
  var offset = 45;
  var position = ((value*270)/max);
    if (position > 270) {
    position = 270;
  }
 
  var size = 0;
  if (width>height) {
    size = height;
  } else {
    size = width;
  }
  if (size>170) size=170;
  if (size<120) size=120;
   
	 
  // Save the current drawing state
  ctx.save();

  // move to the middle of the image
  ctx.translate((size/2), (size/2));

  // Rotate around this point
  ctx.rotate((position + offset) * (Math.PI / 180));

  // Draw the image back and up
  ctx.drawImage(needle2_jgauge2, -(size/2), -(size/2), size, size);
  
  // Restore the previous drawing state
  ctx.restore(); 
  }
