class tempbar {
  constructor(options, data, name) {
      Object.keys(options).forEach(key => {
          var value = options[key];
          this[key] = value;
      });
      this.data = data;
      this.name = name;
  }

  draw() {
      var chart = this.chart;
      var svg = chart.svg;

      svg.selectAll("rect")
          .data(this.data)
          .enter()
          .append("rect")
          .attr("class", this.name)
          .attr("fill", this.fill)
          .attr("stroke", "rgba(255, 255, 255, 0.4")
          .attr("stroke-width", "1.5px");

      svg.selectAll("temps")
          .data(this.data)
          .enter()
          .append("text")
          .attr("class", "temps " + this.name)
          .style("pointer-events", "none")
          .style("text-anchor", "left")
          .text((d) => d.rate.toString());
    
      this.redraw();
  }

  redraw() {
      var chart = this.chart;
      var svg = chart.svg;
      svg.selectAll("rect." + this.name)
          .attr("x", function(d) { return chart.scales.x(d.start); })
          .attr("width", function(d) { return chart.scales.x(d.end) - chart.scales.x(d.start) })
          .attr("height", chart.scales.y(this.yMin) - chart.scales.y(this.yMax))
          .attr("y", chart.scales.y(this.yMax));

      d3.selectAll(".temps." + this.name)
          .attr("x", function(d) {
                const xMin = 4;
                const textWidth = d.rate.toString().length * 7;
                const xMax = chart.width - textWidth;   
                const xStart = chart.scales.x(d.start) + xMin;
                const xEnd = chart.scales.x(d.end) - textWidth;
                var xPos = clamp(xStart, xMin, xMax);
                xPos = clamp(xPos, xStart, xEnd);
                return xPos; 
            })
          .attr("y", chart.scales.y(this.yMin) - 3);
  }
}