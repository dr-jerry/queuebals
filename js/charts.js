var scatterData = [{friends: 5, salary: 22000},
		   {friends: 3, salary: 18000}, {friends: 10, salary: 88000},
		   {friends: 0, salary: 180000}, {friends: 27, salary: 56000},
		   {friends: 8, salary: 74000}];

function createChart() {

    var yExtent = d3.extent(scatterData, d => d.friends);
    var xExtent = d3.extent(scatterData, d => d.salary);
    var xScale = d3.scaleLinear().domain(xExtent).range([0,500]);
    var yScale = d3.scaleLinear().domain(yExtent).range([0,500]);
    var yAxis = d3.axisRight().scale(yScale);
    var xAxis = d3.axisBottom().scale(xScale);
    d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);
    d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
    d3.select("svg").selectAll("circle")
	.data(scatterData).enter().append("circle")
	.attr("r", 5).attr("cx", d => xScale(d.salary))
	.attr("cy", d => yScale(d.friends));
}
function plotBox(d) {
    let width = 10;
    return new iPath().line(width,0).move(-width/2,0).line(0,d.max).dPath(3);
}
function createMedium() {
    d3.csv("medium.csv").then(data => scatterplot(data));
    const tickSize = 470;
    function scatterplot(data) {
	const xScale = d3.scaleLinear().domain([1,8]).range([20,tickSize])
	const yScale = d3.scaleLinear().domain([0,100]).range([tickSize + 10,20])
	const yAxis = d3.axisRight()
	      .scale(yScale)
	      .tickSize(tickSize)
	      .tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
	d3.select("svg").append("g")
	    .attr("transform", `translate(${20},0)`)
	    .attr("id", "yAxisG")
	    .call(yAxis);
	const xAxis = d3.axisBottom()
	      .scale(xScale)
	      .tickSize(-tickSize)
	      .tickValues([1,2,3,4,5,6,7]);
	d3.select("svg").append("g")
	    .attr("transform", `translate(0,${tickSize + 10})`)
	    .attr("id", "xAxisG")
	    .call(xAxis);
	d3.select("svg").selectAll("g.box")
	    .data(data)
	    .enter()
	    .append("g")
	    .attr("class", "box").attr("transform"
				       , d=> "translate(" + xScale(d.day) + ", "
				       + yScale(d.median) + ")")
	    .each(function(d,i) {
		d3.select(this).append("rect").attr("width", 20)
		    .attr("height", yScale(d.q1) - yScale(d.q3))
		    .attr("x", -10).attr("y", d=> yScale(d.q3) - yScale(d.median))
		
	    .style("fill", "darkgray")
	    });
    }
}

function createLines() {
    d3.csv("./data/tweetdata.csv").then(data => lineChart(data));
    function lineChart(data) {
	var tweetLine = d3.line()
	    .x(d => xScale(d.day))
	    .y(d => yScale(d.tweets));

	const blue = "#5eaec5", green = "#92c463", orange = "#fe9a22";

	xScale = d3.scaleLinear().domain([1,10.5]).range([20,480])
	yScale = d3.scaleLinear().domain([0,35]).range([480,20])
	xAxis = d3.axisBottom()
	    .scale(xScale)
	    .tickSize(480)
	    .tickValues([1,2,3,4,5,6,7,8,9,10])
	d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis)
	yAxis = d3.axisRight()
	    .scale(yScale)
	    .ticks(10)
	    .tickSize(480)
	d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis)
	d3.select("svg").selectAll("circle.tweets")
	    .data(data)
	    .enter()
	    .append("circle")
	    .attr("class", "tweets")
	    .attr("r", 5)
	    .attr("cx", d => xScale(d.day))
	    .attr("cy", d => yScale(d.tweets))
	    .style("fill", orange)
	d3.select("svg").selectAll("circle.retweets")
	    .data(data)
	    .enter()
	    .append("circle")
	    .attr("class", "retweets")
	    .attr("r", 5)
	    .attr("cx", d => xScale(d.day))
	    .attr("cy", d => yScale(d.retweets))
	    .style("fill", green)
	d3.select("svg").selectAll("circle.favorites")
	    .data(data)
	    .enter()
	    .append("circle")
	    .attr("class", "favorites")
	    .attr("r", 5)
	    .attr("cx", d => xScale(d.day))
	    .attr("cy", d => yScale(d.favorites))
	    .style("fill", blue)
	const lambdaXScale = d => xScale(d.day)
	const labels = ["tweets", "retweets", "favorites"];
	
	var tweetLine = d3.line()
	    .x(lambdaXScale)
	    .y(d => { console.log(d);
		      return yScale(d.tweets)})
	var retweetLine = d3.line()
	    .x(lambdaXScale)
	    .y(d => yScale(d.retweets))
	var favLine = d3.line()
	    .x(lambdaXScale)
	    .y(d => yScale(d.favorites))
	tweetLine.curve(d3.curveBasis)
	retweetLine.curve(d3.curveStep)
	favLine.curve(d3.curveCardinal)
	d3.select("svg")
	    .append("path")
	    .attr("d", tweetLine(data))
	    .attr("fill", "none")
	    .attr("stroke", orange)
	    .attr("stroke-width", 2)
	d3.select("svg")
	    .append("path")
	    .attr("d", retweetLine(data))
	    .attr("fill", "none")
	    .attr("stroke", green)
	    .attr("stroke-width", 2)
	d3.select("svg")
	    .append("path")
	    .attr("d", favLine(data))
	    .attr("fill", "none")
	    .attr("stroke", blue)
	    .attr("stroke-width", 2)
    }
}
    

function movies() {
    d3.csv("./data/moviedata.csv").then(data => movieChart(data));
    function movieChart(data) {
	var fillScale = d3.scaleOrdinal()
	    .domain(["titanic", "avatar", "akira", "frozen", "deliverance", "avengers"])
	    .range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F", "#5eafc6", "#41a368"])
	var xScale = d3.scaleLinear().domain([ 1, 8 ]).range([ 20, 470 ]);
	var yScale = d3.scaleLinear().domain([0, 55]).range([ 480, 20 ])
	Object.keys(data[0]).forEach(key => {
	    if (key != "day") {
		var movieArea = d3.area()
		    .x(d => xScale(d.day))
		    .y0(d => yScale(simpleStacking(d, key) - d[key]))
		    .y1(d => yScale(simpleStacking(d, key)))
		    .curve(d3.curveBasis)
		d3.select("svg")
		    .append("path")
		    .style("id", key + "Area")
		    .attr("d", movieArea(data))
		    .attr("fill", fillScale(key))
		    .attr("stroke", "black")
		    .attr("stroke-width", 1)
	    }
	})
	function simpleStacking( lineData, lineKey) {
	    var newHeight = 0
	    Object.keys(lineData).every(key => {
		if (key !== "day") {
		    newHeight += parseInt(lineData[key]);
		    if (key === lineKey) {
			return false
		    }
		}
		return true
	    })
	    return newHeight
	}
    }
}
