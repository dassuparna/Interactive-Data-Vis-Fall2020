// data load
// reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
d3.csv("../data/Happiness.csv", d3.autoType).then(data => {
    console.log(data);
  
    /** CONSTANTS */
    // constants help us reference the same values throughout our code
    const width = window.innerWidth * 0.5,
      height = window.innerHeight / 3,
      paddingInner = 0.2,
      margin = { top: 20, bottom: 40, left: 40, right: 40 };
  
    /** SCALES */
    // reference for d3.scales: https://github.com/d3/d3-scale
    const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.Rank)])
    .range([margin.left, width]);
  
    const yScale = d3
    .scaleBand()
      .domain(data.map(d => d.Country))
      .range([0,height])
      .paddingInner(paddingInner);

      
  
    // reference for d3.axis: https://github.com/d3/d3-axis
    const yAxis = d3.axisLeft(yScale).ticks(data.length);
  
    /** MAIN CODE */
    const svg = d3
      .select("#d3-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    // append rects
    const rect = svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("y", d => yScale(d.Country))
      .attr("x",xScale(0))
      .attr("height", yScale.bandwidth())
      .attr("width", d =>  xScale(d.Rank))
      //.attr("transform", `translate(200, ${height - margin.bottom, margin.top})`)
      .attr("fill", "#69b3a2")
      
  
    // append text
    const text = svg
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("class", "label")
      // this allows us to position the text in the center of the bar
      .attr("x",0, d => xScale(d.Rank))
      .attr("y", d => yScale(d.Country)+(yScale.bandwidth()+15))
      .text(d => d.Rank)
      .attr("dx", "220");
  
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${margin.left})`)
      .call(yAxis)
      .style("text-anchor",left)
      .text(d.Country)
      
      
});