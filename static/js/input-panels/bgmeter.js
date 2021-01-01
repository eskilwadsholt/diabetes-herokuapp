const BGlims = {
  xmin: 0,
  xmax: 30,
  minticks: 1.6,
  minzoom: 3,
  maxzoom: 30
};

function CreateBGmeter() {
  let divElement = null;
  let bgmeter = null;
  let scales = { "x": null, "y": null};
  let mouseDownX = 0;
  let mouseDownY = 0;
  let xWindowWidth = BGlims.maxzoom;
  let xWindowWidthStart = BGlims.maxzoom;
  let xMid = 10;
  let xMin = xMid - 0.5 * xWindowWidth;
  let xMax = xMid + 0.5 * xWindowWidth;

  divElement = document.getElementsByClassName("BG-meter")[0];
  width = divElement.clientWidth;
  height = divElement.clientHeight;
  bgmeter = d3.select(divElement)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  scales.x = d3.scaleLinear().range([0, width]);
  scales.y = d3.scaleLinear().range([height, 0]);
  scales.x.domain([xMin, xMax]);
  scales.y.domain([0, 100]);

  let [majorAxis, minorAxis, extraAxis]  = computeXAxes();

  bgmeter.append("g")
    .attr("class", "axisWhite major")
    .attr("transform", `translate(0, ${height / 4})`)
    .call(majorAxis);

  bgmeter.append("g")
    .attr("class", "axisWhite minor")
    .attr("transform", `translate(0, ${height / 4})`)
    .call(minorAxis);

  bgmeter.append("g")
    .attr("class", "axisWhite extra")
    .attr("transform", `translate(0, ${height / 4})`)
    .call(extraAxis);

  let identity = d3.line()
    .x(d => d.x)
    .y(d => d.y);
  
  bgmeter.append("path")
    .datum([{ x: width / 2, y: 0}, { x: width / 2, y: height - 40}])
    .attr("class", "vline")
    .attr("d", identity)
    .attr("stroke", "black")
    .attr("stroke-width", 3);

    updateBGInputVal();

  d3.select(".BG-meter")
    .on("mousemove", function() {
        let mousePoint = d3.mouse(divElement);
        let mouseNewX = mousePoint[0];
        let mouseNewY = mousePoint[1];
        dragTo(mouseNewX, mouseNewY);
    });
  
  function dragStart(startX, startY) {
    mouseDownX = startX;
    mouseDownY = startY;
    xWindowWidthStart = xWindowWidth;
  }
  
  function dragTo(newX, newY) {
    if (bgmeter) {
      let dx = scales.x.invert(newX) - scales.x.invert(mouseDownX);
      xMid -= dx;
      xMid = clamp(xMid, BGlims.xmin, BGlims.xmax);
      let dy = scales.y.invert(newY) - scales.y.invert(mouseDownY);
      let zoomFactor = Math.pow(2, - dy / 10);
      xWindowWidth = clamp(xWindowWidthStart * zoomFactor, BGlims.minzoom, BGlims.maxzoom);
      redrawAxis();
      mouseDownX = newX;
    }
  }
  
  
  function redrawAxis() {
    xMin = xMid - 0.5 * xWindowWidth;
    xMax = xMid + 0.5 * xWindowWidth;
    scales.x.domain([xMin, xMax]);
    let [majorAxis, minorAxis, extraAxis] = computeXAxes();
    bgmeter.select("g.axisWhite.major")
      .call(majorAxis);
    bgmeter.select("g.axisWhite.minor")
      .call(minorAxis);
    bgmeter.select("g.axisWhite.extra")
      .call(extraAxis);
    updateBGInputVal();
  }
  
  let drag = d3.drag()
      .on("start", () => { dragStart(d3.event.x, d3.mouse(divElement)[1]); })
      .on("drag", () => { dragTo(d3.event.x, d3.mouse(divElement)[1]); });
  
  d3.select(".BG-meter").call(drag);

  function computeXAxes() {
    // Compute major and minor step sizes
    let major = 5 * Math.pow(10, Math.floor(Math.log10(xWindowWidth / BGlims.minticks)));
    let minor = 0.2 * major;
    let extra = major;
    if (xWindowWidth / major < BGlims.minticks) {
      major = minor;
      minor = 0.5 * major;
      extra = 0.1 * major;
    }
    let tickMax = Math.min(xMax, BGlims.xmax)
    let startTick = Math.max(Math.floor(xMin / major) * major, BGlims.xmin);
    let majorVals = []
    let tick;
    for (tick = startTick; tick <= tickMax; tick += major ) {
      majorVals.push(tick);
    }
    startTick = Math.max(Math.floor(xMin / minor) * minor, BGlims.xmin);
    let minorVals = []
    for (tick = startTick; tick <= tickMax; tick += minor ) {
      minorVals.push(tick);
    }
    startTick = Math.max(Math.floor(xMin / extra) * extra, BGlims.xmin);
    let extraVals = []
    for (tick = startTick; tick <= tickMax; tick += extra ) {
      extraVals.push(tick);
    }
    const majorAxis = d3.axisTop(scales.x)
      .tickValues(majorVals)
      .tickSize(15)
      .tickPadding(5)
      .tickFormat(d => noTrailingZeros(d));
    const minorAxis = d3.axisTop(scales.x)
      .tickValues(minorVals)
      .tickSize(12)
      .tickFormat("");
    const extraAxis = d3.axisTop(scales.x)
      .tickValues(extraVals)
      .tickSize(6)
      .tickFormat("");
    return [majorAxis, minorAxis, extraAxis];
  }
  
  function updateBGInputVal() {
    $(".BG-input").text((xMin + 0.5 * xWindowWidth).toFixed(1));
  }
  
  function noTrailingZeros(d) {
    return Number(d.toFixed(1));
  }
}

function clamp(value, lower, upper) {
  if (value < lower) return lower;
  if (value > upper) return upper;
  return value;
}