function CreateBGmeter() {
  var divElement = null;
  var bgmeter = null;
  var scales = { "x": null, "y": null};
  var xMin = -1;
  var xMax = 14;
  var mouseDownX = 0;
  var mouseNewX = 0;
  var mouseDownY = 0;
  var mouseNewY = 0;
  var xWindowWidth = 15;
  var xWindowWidthStart = 15;
  var xDisplacement = -1;
  var xDisplacementStart = -1;

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

    let xAxis = d3.axisTop(scales.x )
      .ticks(3)
      .tickSize(10)
      .tickPadding(5)
      .tickFormat(d => noTrailingZeros(d));

    bgmeter.append("g")
      .attr("class", "axisWhite")
      .attr("transform", `translate(0, ${height / 2})`)
      .call(xAxis);

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
            var mousePoint = d3.mouse(divElement);
            var mouseNewX = mousePoint[0];
            var mouseNewY = mousePoint[1];
            dragTo(mouseNewX, mouseNewY);
        });
      
      function dragStart(startX, startY) {
        mouseDownX = startX;
        mouseDownY = startY;
        xDisplacementStart = xDisplacement;
        xWindowWidthStart = xWindowWidth;
      }
      
      function dragTo(newX, newY) {
        if (bgmeter) {
          let dx = scales.x.invert(newX) - scales.x.invert(mouseDownX);
          xDisplacement -= dx;
          let xMid = xDisplacement + 0.5 * xWindowWidth;
          let dy = scales.y.invert(newY) - scales.y.invert(mouseDownY);
          let zoomFactor = Math.pow(2, - dy / 20);
          xWindowWidth = xWindowWidthStart * zoomFactor;
          if (xWindowWidth < 1.5) xWindowWidth = 1.5;
          else if (xWindowWidth > 25) xWindowWidth = 25;
          xDisplacement = xMid - 0.5 * xWindowWidth;
          redrawAxis();
          mouseDownX = newX;
        }
      }
      
      
      function redrawAxis() {
        xMin = xDisplacement;
        xMax = xDisplacement + xWindowWidth;
        scales.x.domain([xMin, xMax]);
        let xAxis = d3.axisTop(scales.x)
          .ticks(3)
          .tickSize(10)
          .tickPadding(5)
          .tickFormat(d => noTrailingZeros(d));
        bgmeter.select("g.axisWhite")
          .attr("transform", `translate(0, ${height / 2})`)
          .call(xAxis);
        updateBGInputVal();
      }
      
      var drag = d3.drag()
          .on("start", () => { dragStart(d3.event.x, d3.mouse(divElement)[1]); })
          .on("drag", () => { dragTo(d3.event.x, d3.mouse(divElement)[1]); });
      
      d3.select(".BG-meter").call(drag);
      
      function smoothRedrawAxis() {
        xMin = xDisplacement;
        xMax = xDisplacement + xWindowWidth;
        scales.x.domain([xMin, xMax]);
        let xAxis = d3.axisTop(scales.x)
          .ticks(3)
          .tickSize(10)
          .tickPadding(5)
          .tickFormat(d => noTrailingZeros(d));
        bgmeter.select("g.axisWhite")
          .attr("transform", `translate(0, ${height / 2})`)
          .transition()
          .call(xAxis);
          updateBGInputVal();
      }
      
      function updateBGInputVal() {
        $(".BG-input").text((xMin + 0.5 * xWindowWidth).toFixed(1));
      }
      
      function noTrailingZeros(d) {
        return Number(d.toFixed(1));
      }
}
