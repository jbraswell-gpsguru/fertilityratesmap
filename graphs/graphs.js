//function to create coordinated bar chart
function setChart(year, colorScale){
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 470 - margin.left - margin.right,
	    height = 380 - margin.top - margin.bottom;

	var formatPercent = d3.format("0");

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1, 1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .tickFormat(formatPercent);

	var svg = d3.select("bar").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



	d3.csv("data/US_Export.csv", function(error, data) {

		  var tip = d3.tip()
		   .attr('class', 'd3-tip')
		   .offset([-10, 0])
		   .html(function(d) {
		     return "<strong>Fertility Rate:</strong> <span style='color:red'>" + d[year] + "</span><br><strong>State:</strong> <span style='color:red'>" + d['name'] + "</span>";
		  })
		  svg.call(tip);

		  data.forEach(function(d) {
		    d[year] = +d[year];
		  });

		  x.domain(data.map(function(d) { return d.name; }));
		  y.domain([1, d3.max(data, function(d) { return d[year]; })]);


		  svg.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Fertility Rate");

		  svg.selectAll(".bar")
		      .data(data)
		      .enter().append("rect")
		      .attr("class", "bar")
		      .attr("adm1_code", function(d) { return d.adm1_code; })
		      .attr("x", function(d) { return x(d.name); })
		      .attr("width", x.rangeBand())
		      .attr("y", function(d) { return y(d[year]); })
		      .attr("height", function(d) { return height - y(d[year]); })
		      .style("fill", function(d) {



						  if(d[year]<1.9)
						  {value = 1;}
						  if(d[year]>=1.9&&d[year]<=2.1)
						  {value = 2;}
						  if(d[year]>2.1&&d[year]<=2.3)
						  {value = 3;}
						  if(d[year]>2.3)
						  {value = 4;}
								    
		
			
						  if (value) {
						  //If value exists…
						  return color(value);
						  } else {
						  
						  //If value is undefined…
						  return "rgb(122,198,93)";
						  }
			})
		       .on("mouseover", function(d){
			    highlight(d);
 			    tip.show(d);
			})
			.on("mouseout", function(d){
			    dehighlight(d);
			    tip.hide(d);
			});
		   
			d3.selectAll('.bar').each(
			    function(){
				var elt = d3.select(this);
				elt.classed(elt.attr("adm1_code"), true);
			    }
			) 

		    var sortTimeout = setTimeout(function() {
		      d3.select("input").property("checked", true).each(change);
		    }, 2000);

		    function change() {
			    clearTimeout(sortTimeout);
	  

			    var x0 = x.domain(data.sort(this.checked
				? function(a, b) { return b[year] - a[year]; }
				: function(a, b) { return d3.ascending(a.name, b.name); })
				.map(function(d) { return d.name; }))
				.copy();

			    svg.selectAll(".bar")
				.sort(function(a, b) { return x0(a.name) - x0(b.name); });

			    var transition = svg.transition().duration(750),
				delay = function(d, i) { return i * 50; };

			    transition.selectAll(".bar")
				.delay(delay)
				.attr("x", function(d) { return x0(d.name); });

			    transition.select(".x.axis")
				.call(xAxis)
			      .selectAll("g")
				.delay(delay);
		    }


	 
	});


};


$( document ).ready(function() {
	setChart("TFR_2007", color);

	$("#year").change(function(){
	     $('bar').empty();
	     setChart($('#year').val(), color);
	}); 

});


