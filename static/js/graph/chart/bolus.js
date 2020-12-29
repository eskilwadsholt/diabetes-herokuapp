class bolus {
  constructor(data, name) {
      this.data = data;
      this.name = name;
  }

  draw() {
      var data = this.data;
      var chart = this.chart;
      var scales = chart.scales;
      var svg = chart.svg;

      var tooltip = new bolusInfo();
      chart.add(tooltip);

      svg.selectAll("whatever")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", "bolus-circle " + this.name)
          .attr("r", 14)
          .on("mouseover", function(d) {
            tooltip.show(d);
          })
          .on("mouseout", function(d) {
            tooltip.hide();
          });

      svg.selectAll("bolus")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "bolus " + this.name)
          .style("pointer-events", "none")
          .style("text-anchor", "middle")
          .text((d) => ("-" + (d.bolus * insulinRatio).toFixed(1)));

      this.redraw();
  }

  redraw() {
      var chart = this.chart;
      var scales = chart.scales;

      d3.selectAll(".bolus-circle." + this.name)
          .attr("cx", function(d) { return scales.x(d.time); })
          .attr("cy", function(d) { return (scales.y(-6) + 4); });

      d3.selectAll(".bolus." + this.name)
          .attr("x", function(d) { return scales.x(d.time); })
          .attr("y", function(d) { return scales.y(-6) + 6; });
  }
}

class bolusInfo {
    draw() {
        this.visible = false;
        var chart = this.chart;
        this.element = d3.select(chart.divElement)
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .datum({ time: 0, y: 0});
    }

    show(datum) {
        this.visible = true;
        this.element.datum(datum)
            .style("opacity", 1);
        this.redraw();
    }
    
    redraw() {
        if (this.visible) {

            var chart = this.chart;
            var scales = chart.scales;
            this.element
                .style("left", function(d) { return (scales.x(d.time) + 20) + "px"; })
                .style("top", function(d) {return (scales.y(0)) + "px"; })
                .html(bolusHTML);
        }
    }

    hide() {
        this.visible = false;
        this.element.style("opacity", 0);
    }
}

function bolusHTML(d) {
    var HTML = `
    <div class="tooltip-bolus">
        <div class="tooltip-time">
            ${formatTimeHM(d.time)}
        </div>
        <div class="tooltip-bolus-value">
        ${d.bolus.toFixed(1)}(U)
        </div>
    </div>
    `;
    return  HTML;
}

function formatBolusGroup(group) {
    var result = "";
    group.forEach(e => { result += `${formatTimeHM(parseDate(e.time))} ${e.bolus.toFixed(1)}(U) `; });
    return result;
}