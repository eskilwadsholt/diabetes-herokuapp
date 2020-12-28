class area {
    constructor(data, name) {
        this.data = data;
        this.name = name;
    }

    draw() {
        var data = this.data,
            chart = this.chart,
            svg = chart.svg;

        this.element = svg.append("path");

        this.element
            .datum(data)
            .attr("class", "area " + this.name);

        this.redraw();
    }

    redraw() {
        var scales = this.chart.scales;
        var line = d3.line()
            .x(function(d) { return scales.x(d.x); })
            .y(function(d) { return scales.y(d.y); })
            .curve(d3.curveCardinal);

        this.element
            .attr("d", line);
    }
}