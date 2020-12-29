class steps {
    constructor(data, color, factor, range) {
        this.data = data;
        this.color = color;
        this.factor = factor;
        this.range = range;
    }

    draw() {
        var data = this.data,
            chart = this.chart,
            svg = chart.svg;
        
        var tooltip = new driftInfo();
        chart.add(tooltip);

        this.front = svg.append("path");

        this.front
            .datum(data)
            .style("stroke", this.color)
            .attr("class", "steps");

        this.redraw();
    }

    redraw() {
        var factor = this.factor;
        var range = this.range;
        var scales = this.chart.scales;
        var line = d3.line()
            .defined(d => !isNaN(ScaleModifyFactor(d, factor, range)))  
            .x(function(d) { return scales.x(d.x); })
            .y(function(d) { return scales.y(ScaleModifyFactor(d, factor, range)); })
            .curve(d3.curveStepAfter);

        this.front
            .attr("d", line);
    }
}

function ScaleModifyFactor(d, factor, range) {
    var y = factor * (d.y + modifyDrift(d.x));
    if ((y > range[0]) && (y < range[1])) return y;
    return NaN;
}

