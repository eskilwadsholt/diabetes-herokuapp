
class dots {
    constructor(data) {
        this.data = data;
    }

    draw() {
        var data = this.data;
        var chart = this.chart;
        var scales = chart.scales;
        var svg = chart.svg;

        var tooltip = new Tooltip();
        chart.add(tooltip);

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dots")
            .attr("r", 3)
            .attr("cx", function(d) { return scales.x(d.x); })
            .attr("cy", function(d) { return scales.y(d.y); });
        
        svg.selectAll("tooltipCircle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "tooltipCircle")
            .attr("r", 20)
            .attr("cx", function(d) { return scales.x(d.x); })
            .attr("cy", function(d) { return scales.y(d.y); })
            .on("mouseover", function(d) {
                tooltip.show(d);
            })
            .on("mouseout", function(d) {
                tooltip.hide();
            });
    }

    redraw() {
        var chart = this.chart;
        var scales = chart.scales;
        var svg = chart.svg;

        svg.selectAll(".dots")
            .attr("cx", function(d) { return scales.x(d.x); })
            .attr("cy", function(d) { return scales.y(d.y); });

        svg.selectAll(".tooltipCircle")
            .attr("cx", function(d) { return scales.x(d.x); })
            .attr("cy", function(d) { return scales.y(d.y); });
    }
}

class Tooltip {
    draw() {
        this.visible = false;
        var chart = this.chart;
        this.element = d3.select(chart.divElement)
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .datum({ x: 0, y: 0});
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
                .style("left", function(d) { return (scales.x(d.x) + 5) + "px"; })
                .style("top", function(d) {return (scales.y(d.y)) + "px"; })
                .html(BGreadingHTML);
        }
    }

    hide() {
        this.visible = false;
        this.element.style("opacity", 0);
    }
}

function BGreadingHTML(d) {
    var now = new Date();
    var elapsed = now - d.x;
    var seconds = elapsed / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var timeSinceBG = Math.floor(minutes) % 60;
    if (Math.floor(hours) > 0) {
        timeSinceBG = Math.floor(hours) + ":" + twoDigits(timeSinceBG);
    } else {
        timeSinceBG = timeSinceBG + " minute" + (Math.floor(minutes) == 1 ? "" : "s");
    }
    var HTML = `<div class="tooltip-time-BG">
        <div class="tooltip-time"><div>${formatTimeHM(d.x)}</div></div>
        <div class="tooltip-BG">
            <div class="tooltip-BG-value">
                ${d.y.toFixed(1)}
            </div>
            <div class="mmolL">
                <div class="mmol">mmol</div>
                <div class="L">L</div>
            </div>
        </div>
    </div>
    <div class="tooltip-elapsed">${timeSinceBG} ago</div>`;
    return HTML;
}