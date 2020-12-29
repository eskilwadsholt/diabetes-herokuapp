class yaxis {
    constructor(name, xpos) {
        this.name = name;
        this.xpos = xpos;
    }

    draw() {
        var chart = this.chart;
        var svg = chart.svg;

        svg
            .append("g")
            .attr("class", "y axis " + this.name);

        this.redraw();
    }

    redraw() {
        var chart = this.chart;
        var svg = chart.svg;
        var scales = chart.scales;
        var yAxis = d3.axisRight(scales.y)
            .ticks(Math.ceil((chart.yMax - chart.yMin) / 10));

        svg.select(".y.axis." + this.name)
            .attr("transform", `translate(${this.xpos.useScale ? scales.x(this.xpos.x) : this.xpos.x}, 0)`)
            .call(yAxis);
    }
}