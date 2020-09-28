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
      .scaleBand()
      .domain(data.map(d => d.Country))
      .range([margin.left, width - margin.right])
      .paddingInner(paddingInner);
  
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.Rank)])
      .range([height - margin.bottom, margin.top]);
  
    // reference for d3.axis: https://github.com/d3/d3-axis
    const xAxis = d3.axisBottom(xScale).ticks(data.length);
  
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
      .attr("y", d => yScale(d.Rank))
      .attr("x", d => xScale(d.Country))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - margin.bottom - yScale(d.Rank))
      .attr("fill", "#69b3a2")
      
  
    // append text
    const text = svg
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("class", "label")
      // this allows us to position the text in the center of the bar
      .attr("x", d => xScale(d.Country) + (xScale.bandwidth() / 2))
      .attr("y", d => yScale(d.Rank))
      .text(d => d.Rank)
      .attr("dy", "1.25em");
  
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

      
      
  }); 