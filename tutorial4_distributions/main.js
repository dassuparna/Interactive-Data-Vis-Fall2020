/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 5;

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let xScale;
let yScale;
let mouseover;
let mouseleave;
let tooltip;

//const formatMillions = (num) => d3.format(".2s")(num).replace(/G/, 'M')

/**
 * APPLICATION STATE
 * */
let state = {
  data: [],
  selectedParty: "All",
};


/**
 * LOAD DATA
 * */
d3.csv("../data/populationbycountry.csv", d3.autoType).then(raw_data => {
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  // SCALES
  xScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.Migrants))
    .range([margin.left, width - margin.right]);


    
  yScale = d3
    .scaleLog()
    .domain(d3.extent(state.data, d => d.Population)) 
    .range([height-margin.bottom,margin.top])
    //.domain([1440297825, 98069])
   // ---------------------- Tooltip -------------------

 tooltip = d3.select("#d3-container")
.append("div")
.style("opacity", 0)
.style('text-align', 'left')
.style("background-color", "white")
 .style("border", "solid")
 .style("border-width", "1px")
 .style("border-radius", "5px")
 .style("padding", "10px")
 .attr("class", "tooltip")


  mouseover=function(d){
    //console.log(d)
tooltip
  .style("opacity", 0.6)
  .style('border', '1px solid #000')
  .style('background', '#fff')
  .style('padding', '6px')
  .html( "<span style ='color: black;'> Country:" + d["Country "] + " <br>Migrants: " + d.Migrants+ " <br>Population: " + d.Population + '</span>')
  .style("left", (d3.mouse(this)[0] + 90) + "px")
  .style("top", (d3.mouse(this)[1]+90) + "px")
}

 mouseleave = (d) =>{
tooltip
  .transition()
  .style("opacity", 0)
  .duration(100)
}
//--end of tooltip-----------------------------------------------------------------
  // AXES
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  //yAxis = d3.axisLeft(yScale).tickFormat(formatMillions);
  //formatValue = d3.format(".2s");

  // UI ELEMENT SETUP
  // add dropdown (HTML selection) for interaction
  // HTML select reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
  const selectElement = d3.select("#dropdown").on("change", function() {
    console.log("new country is", this.value);
    // `this` === the selectElement
    // this.value holds the dropdown value a user just selected
    state.selectedParty = this.value;
    draw(); // re-draw the graph based on this new selection
  });

  // add in dropdown options from the unique values in the data
  selectElement
    .selectAll("option")
    .data(["All","Africa","Asia","Europe","North America","South America","Oceania" ]) // unique data values-- (hint: to do this programmatically take a look `Sets`)
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    


  // add the xAxis
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Migrants");

  // add the yAxis
  svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("y", "50%")
    .attr("dx", "-3em")
    .attr("writing-mode", "vertical-rl")
    .text("Population");

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  // filter the data for the selectedParty
  let filteredData = state.data;
  // if there is a selectedParty, filter the data before mapping it to our elements
  if (state.selectedParty !== "All") {
    filteredData = state.data.filter(d => d.Continent === state.selectedParty);
  }
  //yScale.range()
  const dot = svg
    .selectAll(".dot")
    .data(filteredData, d => d.Continent) // use `d.name` as the `key` to match between HTML and data elements
    .join(
      enter =>
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        enter
          .append("circle")
          .attr("class", "dot") // Note: this is important so we can identify it in future updates
          .attr("stroke", "lightgrey")
          .attr("opacity", 0.5)
          .attr("fill", d => {
            if (d.Continent === "Africa") return "#821D38";
            else if (d.Continent === "Asia") return "burgandy";
            else if (d.Continent === "Europe") return "#00FF00";
            else if (d.Continent === "North America") return "#0000FF";
            else if (d.Continent === "South America") return "red";
            else if (d.Continent === "Oceania") return "#FF00FF";
            else return "white";
          })
          .attr("r", radius)
          .attr("cy", d => yScale(yScale.domain()[0]))
          .attr("cx", d => xScale(d.Migrants)) // initial value - to be transitioned
          .on("mouseenter", mouseover)
          .call(enter =>
            enter
              .transition() // initialize transition
              //.delay(d => 500 * d.price) // delay on each element
              .duration(500) // duration 500m
              .attr("cy", d => yScale(d.Population))
          ),
      update =>
        update.call(update =>
          // update selections -- all data elements that match with a `.dot` element
          update
            .transition()
            .duration(250)
            .attr("stroke", "black")
            .transition()
            .duration(250)
            .attr("stroke", "lightgrey")
        ),
      exit =>
        exit.call(exit =>
          // exit selections -- all the `.dot` element that no longer match to HTML elements
          exit
            .transition()
           // .delay(d => 50 * d.price)
            .duration(500)
            .attr("cx", width)
            .remove()
        )
    );
}