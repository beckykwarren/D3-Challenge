var svgWidth = 600;
var svgHeight = 400;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 40
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3
    .select("body")
    .append("svg")
    .attr("name","main-svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("id","scatter")
    .classed('col-xs-12 col-md-12',true)


var chartGroup = svg.append("g")
    .attr('name','scatter-chart')
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Importing the Data
d3.csv("assets/data/data.csv").then(function(data,error) {
    
    if (error) throw error;
    

    // Formatting the Data
    data.forEach(function(d,i){
        d.poverty = +d.poverty
        d.obesity = +d.obesity
    }); // end Formatting Data

    // Map the data to their own array
    var poverty = data.map(d => d.poverty)
    var obesity = data.map(d => d.obesity)

    // Creating the X & Y Scales
    
    // Creating X1 Axis, Scale & Group
    var xPovertyScale = d3.scaleLinear()
        .domain([d3.min(poverty)-1,d3.max(poverty)+1])
        .range([0,width])

    var bottomAxis = d3.axisBottom(xPovertyScale)
    
    // Add bottomAxis
    chartGroup.append("g")
        .attr("name","bottom-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Creating Y1 Axis, Scale & Group
    var yObesityScale = d3.scaleLinear()
        .domain([d3.min(obesity)-1,d3.max(obesity)+1])
        .range([height,0])

    var leftAxis = d3.axisLeft(yObesityScale)
    
    // Add bottomAxis
    chartGroup.append("g")
        .attr("name","left-axis")
        .call(leftAxis);

    // Create the Circles for Scatter

    var tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 10])
        .html(d => `
        <p>${d.state}</p>
        poverty: ${d.poverty}<br>
        obesity: ${d.obesity}`)

    svg.call(tool_tip)

    var chartCircles = chartGroup.append('g').attr('name','circlesGroup')
    var chartLabels = chartGroup.append('g').attr('name','circlesLabels')
            
    var circleLabels = chartLabels.selectAll('text')
        .data(data).enter().append('text')
        .text(d => d.abbr)
        .attr('x',d => xPovertyScale(d.poverty)-7)
        .attr('y',d => yObesityScale(d.obesity)+3)
        .style("font-size", "10px")
        .style('font-weight','bold')
        .style("text-anchor", "center")
        .style('color', 'black')
        .style('align ', 'center')

    var circlesGroup = chartCircles.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx',d => xPovertyScale(d.poverty))
        .attr('cy',d => yObesityScale(d.obesity))
        .attr('r', 12)
        .attr('fill','black')
        .attr('opacity','.2')
        .on('mouseover',tool_tip.show)
        .on('mouseout',tool_tip.hide)

           // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left-5)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Poverty");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
        .attr("class", "axisText")
        .text("Obesity"); 
    

});

