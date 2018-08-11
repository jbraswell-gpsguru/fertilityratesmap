// Define linear scale for output
var color = d3.scale.linear()
	    .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

//function for plotting map
function plotMap(year){
	var width = 450;
	var height = 380;
	// D3 Projection
	var projection = d3.geo.albersUsa()
	  .translate([width/2, height/2])   
	  .scale([600]);
		
	// Define path generator
	var path = d3.geo.path()               
	   .projection(projection);

	var legendText = ["<1.90", "1.90-2.10", "2.11-2.30", "2.30+"];

	//Create SVG element and append map to the SVG
	var svg = d3.select("map")
	    .append("svg")
	    .attr("width", width)
	    .attr("height", height);
		
	// Append DIV for tooltip to SVG
	var div = d3.select("map")
	    .append("div")
	    .attr("class", "tooltip")    
	    .style("opacity", 1);
	// Load in the CSV by state
	d3.csv("data/US_Export.csv", function(data) {

		
		color.domain([4,3,2,1]); // setting the range of the input data

		// Load GeoJSON data and merge with states data
		d3.json("data/us-states.json", function(json) {

			// Loop through each state data value in the .csv file
			for (var i = 0; i < data.length; i++) {
	  
	  			// Grab State Name
	  			var dataState = data[i].name;
	  
	  			
				// Grab TFR
				var tfr = data[i][year];

				//Grab adm1_code
				var adm1_code=data[i].adm1_code;

				  
				// Find the corresponding state inside the GeoJSON
	  			for (var j = 0; j < json.features.length; j++)  {
					    var jsonState = json.features[j].properties.name;
					    if (dataState == jsonState) {
						    
						    // Copy the data value into the JSON
						    if(tfr<1.9)
						    {json.features[j].properties.coder = 1;}
						    if(tfr>=1.9&&tfr<=2.1)
						    {json.features[j].properties.coder = 2;}
						    if(tfr>2.1&&tfr<=2.3)
						    {json.features[j].properties.coder = 3;}
						    if(tfr>2.3)
						    {json.features[j].properties.coder = 4;}
						    

						    json.features[j].properties.tfr = tfr;
						    json.features[j].properties.adm1_code = adm1_code;
						    
						    // Stop looking through the JSON
					    	    break;
					    }
	  			}
			}
	    
			var tip = d3.tip()
			   .attr('class', 'd3-tip')
			   .offset([-10, 0])
			   .html(function(d) {
			     return "<strong>Fertility Rate:</strong> <span style='color:red'>" + d.properties.tfr + "</span><br><strong>State:</strong> <span style='color:red'>" + d.properties.name + "</span>";
			  })
	        	svg.call(tip);
			
			// Bind the data to the SVG and create one path per GeoJSON feature
			svg.selectAll("path")
			  .data(json.features)
			  .enter()
			  .append("path")
			  .attr("d", path)
		          .attr("adm1_code", function(d) { return d.properties.adm1_code; })
			  .style("stroke", "#fff")
			  .style("stroke-width", "1")
			  .style("fill", function(d) {
			  
				  // Get data value
				  var value = d.properties.coder;
			
				  if (value) {
				  //If value exists…
				  return color(value);
				  } else {
				  
				  //If value is undefined…
				  return "rgb(122,198,93)";
				  }
			  })
 			  .on("mouseover", function(d){
			    highlight(d.properties);
			    tip.show(d);
			  })
			  .on("mouseout", function(d){
			    dehighlight(d.properties);
			    tip.hide(d);
			  });
      
			  d3.selectAll('path').each(
			    function(){
				var elt = d3.select(this);
				elt.classed(elt.attr("adm1_code"), true);
			    }
			  ) 
	       
			// Legend
			var legend = d3.select("legend").append("svg")
				  .attr("class", "legend1")
				  .attr("width", 460)
				  .attr("height", 25)
				  .selectAll("g")
				  .data(color.domain().slice().reverse())
				  .enter()
				  .append("g")
				  .attr("transform", function(d, i) { return "translate(" + i%4 * 100 + "," + Math.floor(i/4) * 100 + ")"; })
			    legend.append("rect")
				.attr("width", 18)
				.attr("height", 18)
				.style("fill", color);
			    legend.append("text")
				.data(legendText)
				  .attr("x", 24)
				  .attr("y", 9)
				  .attr("dy", ".35em")
				  .style("font-size", 14)
				  .text(function(d) { return d; });
	  	})

	});

}


$( document ).ready(function() {
        plotMap("TFR_2007");
	$("#year").change(function(){
	     $('map').empty();
	     plotMap($('#year').val());
	}); 
});


