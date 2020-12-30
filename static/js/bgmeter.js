function CreateBGmeter() {
  var divElement = null;
  var bgmeter = null;
  var scales = { "x": null, "y": null};
  var xMin = -2;
  var xMax = 22;
  var mouseDownX;
  var mouseNewX;
  var xWindowWidth = 24;
  var xDisplacement = -2;
  var xDisplacementStart = 0;

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
      d3.select(".BG-meter")
        .on("mousemove", function() {
            var mouseNewX = d3.mouse(this)[0];
            dragTo(mouseNewX);
        });
      
      function dragStart(startX) {
        mouseDownX = startX;
        xDisplacementStart = xDisplacement;
      }
      
      function dragTo(newX) {
        if (bgmeter) {
          let dx = scales.x.invert(newX) - scales.x.invert(mouseDownX);
          xDisplacement = xDisplacementStart - dx;
          redrawAxis();
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
      
      d3.select(".BG-meter").on("click", function() {
        if (xWindowWidth > 0.6) {
          xWindowWidth *= 0.5;
          var mouseNewX = d3.mouse(this)[0];
          var bgX = scales.x.invert(mouseNewX);
          var dx = xDisplacement - bgX;
          xDisplacement = bgX + 0.5 * dx;
          smoothRedrawAxis();
        }
      });

      d3.select(".zoom-out-bgmeter").on("click", function() {
        var midPoint = 0.5 * (xMin + xMax);
        xWindowWidth *= 2;
        xDisplacement = midPoint - 0.5 * xWindowWidth;
        smoothRedrawAxis();
      });
      
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
