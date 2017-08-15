var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var margin = {top: 20, right: 30, bottom: 40, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
		.orient("bottom")
		.ticks(20);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
  	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chart.append("text")
			.attr("x", (width / 2))             
			.attr("y", 0 + (margin.top))
			.attr("class","chart-title")
			.attr("text-anchor", "middle")  
			.text("Gross Domestic Product (1950-2015)");

var caption = d3.select(".chart-wrapper").append("div")
			.attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 10) + ")")
			.attr("class","caption")
			.attr("text-anchor", "middle")

var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
		
var parseTime = d3.time.format("%Y-%m-%d");

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(error, data) {
	xDomain = d3.extent(data.data, function(element) {
		return parseTime.parse(element[0]);
	});
    x.domain(xDomain);
		y.domain([0, d3.max(data.data, function(d) { return d[1]; })]);

    chart.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);

    chart.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.style("font-size", "14px")
					.text("US Gross Domestic Product");

		caption.text(data.description)

		bars = chart.selectAll("g.bars")
									.data(data.data)
									.enter()
									.append("g")
									.attr("class", "bars");

		bars.attr("transform", function(d) {
						date = parseTime.parse(d[0]);
						moveY = y(d[1])
						return 'translate('+x(date)+','+ moveY +')';
					})
				.attr("y","0");
		
		bars.append("rect")
				.attr("class", "bar")
				.attr("width", 3.5)
				.attr("height", function(d) { return height - y(d[1]); });

		bars.on("mouseenter", function(d, i) {
				bar = d3.select(this);
				bar.select("rect")
						.style("opacity","0.6");
				
				div.transition()		
						.duration(200)		
						.style("opacity", .9);		
				div.html("<strong>$" + d[1] + " Billions</strong><br/>"  + parseTime.parse(d[0]).getFullYear() + " - " + monthNames[parseTime.parse(d[0]).getMonth()])	
						.style("left", (d3.event.pageX) + "px")		
						.style("top", (d3.event.pageY - 28) + "px");	
		});

		bars.on("mouseleave", function(d, i) {
				bar = d3.select(this);
				bar.select("rect")
						.style("opacity","1");

				div.transition()		
						.duration(500)		
						.style("opacity", 0);
		});
});