function numericInput(inputSelector, minDigits=1) {
  let $valueInput = $(inputSelector);
  $valueInput.on("input", function() {
    let $valStr = $valueInput.val().replaceAll(".", "").replace(/^0+/, "");
    if (minDigits) {
      let $length = $valStr.length;
      if ($length < minDigits + 1) $valStr = "0".repeat(minDigits + 1 - $length) + $valStr;
      $length = $valStr.length;
      $valStr = $valStr.substring(0, $length - minDigits) + "." + $valStr.substring($length - minDigits, $length);
    }
    $valueInput.val($valStr);
  });
}

function connectMeter(meterDiv, inputID, settings) {
  meterDiv = document.getElementsByClassName(meterDiv)[0];
  let $valueInput = $(inputID);
  numericInput(inputID);

  let meter = null;
  let scales = { "x": null, "y": null};
  let mouseDownX = 0;
  let mouseDownY = 0;
  let xWindowWidth = settings.maxzoom;
  let xWindowWidthStart = settings.maxzoom;
  let xMid = settings.xStart;
  let xMin = xMid - 0.5 * xWindowWidth;
  let xMax = xMid + 0.5 * xWindowWidth;

  // Create meter SVG
  width = meterDiv.clientWidth;
  height = meterDiv.clientHeight;
  meter = d3.select(meterDiv)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Init scales
  scales.x = d3.scaleLinear().range([0, width]);
  scales.y = d3.scaleLinear().range([height, 0]);
  scales.x.domain([xMin, xMax]);
  scales.y.domain([0, 100]);

  let [majorAxis, minorAxis, extraAxis]  = computeXAxes();

  meter.append("g")
    .attr("class", "axisWhite major")
    .attr("transform", `translate(0, ${settings.yPos})`)
    .call(majorAxis);

  meter.append("g")
    .attr("class", "axisWhite minor")
    .attr("transform", `translate(0, ${settings.yPos})`)
    .call(minorAxis);

  meter.append("g")
    .attr("class", "axisWhite extra")
    .attr("transform", `translate(0, ${settings.yPos})`)
    .call(extraAxis);

  let identity = d3.line()
    .x(d => d.x)
    .y(d => d.y);
  
  meter.append("path")
    .datum([{ x: width / 2, y: 0}, { x: width / 2, y: height}])
    .attr("class", "vline")
    .attr("d", identity)
    .attr("stroke", "black")
    .attr("stroke-width", 3);

  updateVal();

  /** Event functions **/
  function dragStart(startX, startY) {
    mouseDownX = startX;
    mouseDownY = startY;
    xWindowWidthStart = xWindowWidth;
  }
  
  function dragTo(newX, newY) {
    if (meter) {
      let dx = scales.x.invert(newX) - scales.x.invert(mouseDownX);
      xMid -= dx;
      xMid = clamp(xMid, settings.xmin, settings.xmax);
      mouseDownX = newX;
      let dy = scales.y.invert(newY) - scales.y.invert(mouseDownY);
      let zoomFactor = Math.pow(2, - dy / 10);
      xWindowWidth = clamp(xWindowWidthStart * zoomFactor, settings.minzoom, settings.maxzoom);
      redrawAxis();
    }
  }

  let drag = d3.drag()
      .on("start", () => { dragStart(d3.event.x, d3.event.y); })
      .on("drag", () => { dragTo(d3.event.x, d3.event.y); });
  
  d3.select(meterDiv).call(drag);
  
  /** Update functions **/
  function redrawAxis() {
    xMin = xMid - 0.5 * xWindowWidth;
    xMax = xMid + 0.5 * xWindowWidth;
    scales.x.domain([xMin, xMax]);
    let [majorAxis, minorAxis, extraAxis] = computeXAxes();
    meter.select("g.axisWhite.major")
      .call(majorAxis);
    meter.select("g.axisWhite.minor")
      .call(minorAxis);
    meter.select("g.axisWhite.extra")
      .call(extraAxis);
    updateVal();
  }

  function clamp(value, lower, upper) {
    if (value < lower) return lower;
    if (value > upper) return upper;
    return value;
  }

  function noTrailingZeros(d) {
    return Number(d.toFixed(1));
  }

  function updateVal() {
    $valueInput.val(xMid.toFixed(1));
  }

  function computeXAxes() {
    // Compute major and minor step sizes
    let major = 5 * Math.pow(10, Math.floor(Math.log10(xWindowWidth / settings.minticks)));
    let minor = 0.2 * major;
    let extra = major;
    if (xWindowWidth / major < settings.minticks) {
      major = minor;
      minor = 0.5 * major;
      extra = 0.1 * major;
    }
    let tickMax = Math.min(xMax, settings.xmax)
    let startTick = Math.max(Math.floor(xMin / major) * major, settings.xmin);
    let majorVals = []
    let tick;
    for (tick = startTick; tick <= tickMax; tick += major ) {
      majorVals.push(tick);
    }
    startTick = Math.max(Math.floor(xMin / minor) * minor, settings.xmin);
    let minorVals = []
    for (tick = startTick; tick <= tickMax; tick += minor ) {
      minorVals.push(tick);
    }
    startTick = Math.max(Math.floor(xMin / extra) * extra, settings.xmin);
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
}