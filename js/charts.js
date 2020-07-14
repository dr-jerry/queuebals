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
function createMedium() {
    d3.csv("medium.csv").then(data => scatterplot(data));
    const tickSize = 470
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
	d3.select("svg").selectAll("circle.median")
	    .data(data)
	    .enter()
	    .append("circle")
	    .attr("class", "tweets")
	    .attr("r", 5)
	    .attr("cx", d => xScale(d.day))
	    .attr("cy", d => yScale(d.median))
	    .style("fill", "darkgray")
    }
}
