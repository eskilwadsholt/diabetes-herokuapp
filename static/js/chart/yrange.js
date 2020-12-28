class yrange {
    constructor(options, name) {
        Object.keys(options).forEach(key => {
            var value = options[key];
            this[key] = value;
        });
        this.name = name;
    }

    draw() {
        var chart = this.chart;
        var svg = chart.svg;

        var tooltip = new driftInfo();
        chart.add(tooltip);

        var rect = svg.append("rect")
            .attr("class", this.name);

        rect
            .attr("x", "-5%")
            .attr("width", "110%")
            .attr("fill", this.color)
            .attr("height", chart.scales.y(this.yMin) - chart.scales.y(this.yMax))
            .attr("y", chart.scales.y(this.yMax))
            .on("mousedown", function() {
                var x = d3.mouse(this)[0];
                var time = chart.scales.x.invert(x);
                tooltip.show({ "time": time, "y": 0 });
              })
              .on("mouseout", function() {
                tooltip.hide();
              });

        if (this.border == true) {
            rect
                .attr("stroke", "black")
                .attr("stroke-width", "2px");
        } else {
            rect
                .attr("stroke", "none");
        }
    }

    redraw() {
        var chart = this.chart;
        var svg = chart.svg;
        var rect = svg.select("rect." + this.name);
        rect
            .attr("height", chart.scales.y(this.yMin) - chart.scales.y(this.yMax))
            .attr("y", chart.scales.y(this.yMax));
    }
}


class driftInfo {
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
                .style("left", function(d) { return (scales.x(d.time) - 40) + "px"; })
                .style("top", function() {return (scales.y(0)) + "px"; })
                .html(stepsHTML);
        }
    }

    hide() {
        this.visible = false;
        this.element.style("opacity", 0);
    }
}

//var drifts = parseAndClampDateValCSV(drifts0, -2, 2);

function stepsHTML(data) {
    var index = 0;
    var stepSize = Math.pow(2, Math.ceil(Math.log2(drifts.length)));
    while (stepSize > 0) {
        stepSize = Math.floor(stepSize / 2);
        if (drifts[index].x < data.time) index = Math.min(drifts.length - 1, index + stepSize);
        else index -= stepSize;
    }
    if (drifts[index].x > data.time) index -= 1;
    var HTML = `
    <div class="tooltip-bolus">
        <div class="tooltip-time">
            ${formatTimeHM(drifts[index].x)}-${formatTimeHM(drifts[index + 1].x)}
        </div>
        <div class="tooltip-bolus-value">
        ${(2 * (drifts[index].y + modifyDrift(drifts[index].x))).toFixed(1)}/h
        </div>
    </div>
    `;
    return  HTML;
}