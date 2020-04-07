// ===========================================================
// SET MARGINS
// ===========================================================
var svgWidth = 600;
var svgHeight = 600;

var margin = {
    top: 100,
    right: 0,
    bottom: 0,
    left: 0
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var innerRadius = 90;
var outerRadius = Math.min(width, height) / 2; // middle of svg area to border

// ===========================================================
// SVG WRAPPER
// ===========================================================

var svg = d3.select('#circular_bar')
    .classed('chart', true)
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)

var chartGroup = svg.append('g')
    .attr('transform', `translate(${(width/2 + margin.left)}, ${(height/2 + margin.top)})`);

// ===========================================================
// INITIAL PARAMETERS
// ===========================================================
var chosenXAxis = "Country";
var chosenYAxis = "Score";

// ===========================================================
// RETRIEVE DATA
// ===========================================================
// url = "http://127.0.0.1:5000//api/v1.0/multiple";

d3.csv('assets/data/2019_world_happy_rankings.csv', function(happyData) {
    console.log(happyData);

    // // Parse data for all sets of data
    // happyData.forEach(function(data) {
    //     data.Country = +data.Country;
    //     data.Score = +data.Score;
    // });

    // =======================================================
    // SCALES
    // =======================================================
    var x = d3.scaleBand()
        .range([0, 2*Math.PI]) // x-axis range from 0 to 2pi
        .align(0)
        // .domain(happyData.map(function(d) {return d.Country;}));
        .domain([d3.min(happyData, d => d[chosenXAxis]) * 0.8,
        d3.max(happyData, d => d[chosenXAxis]) * 1.2
        ]);
    console.log(x);

    var y = d3.scaleRadial()
        .range([innerRadius, outerRadius])
        .domain([0, 10]);
    console.log(y);

    var ybis = d3.scaleRadial()
        .range([innerRadius, 5])
        .domain([0, 10])

    var scalesGroup = chartGroup.append('g')
        .selectAll('path')
        .data(happyData)
        .enter()
        .append('path')
        .attr("fill", "#69b3a2")
        .attr("d", d3.arc()   
            .innerRadius(innerRadius)
            .outerRadius(function(d) { return y(d['Value']); })
            .startAngle(function(d) { return x(d.Country); })
            .endAngle(function(d) { return x(d.Country) + x.bandwidth(); })
            .padAngle(innerRadius));
    console.log(scalesGroup);

    // =======================================================
    // LABELS
    // =======================================================
    var labelsGroup = chartGroup.append('g')
        .selectAll('g')
        .data(happyData)
        .enter()
        .append('g')
        .attr("text-anchor", function(d) { return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((x(d.Country) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['Value'])+10) + ",0)"; })
        .append("text")
        .text(function(d){return(d.Country)})
        .attr("transform", function(d) { return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")
    console.log(labelsGroup);

    var secondSeries = chartGroup.append('g')
        .selectAll('path')
        .data(happyData)
        .enter()
        .append('path')
        .attr('fill', 'red')
        .attr('d', d3.arc()
            .innerRadius(d => {return ybis(0)})
            .outerRadius(d => {return ybis(d['GDP per capita']); })
            .startAngle(d => {return x(d.Country); })
            .endAngle(d => {return x(d.Country) + x.bandwidth(); })
            .padAngle(0.01)
            .padRadius(innerRadius));
});