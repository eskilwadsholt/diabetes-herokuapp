class path {
    constructor(data) {
        this.data = data;
    }

    draw() {
        var data = this.data;
        var chart = this.chart;
        var svg = chart.svg;

        this.element = svg.append("path");

        this.element
            .datum(data)
            .attr("class", "line");

        this.redraw();
    }

    redraw() {
        var chart = this.chart;
        var scales = chart.scales;
        var line = d3.line()
            .x(function(d) { return scales.x(d.x); })
            .y(function(d) { return scales.y(d.y + BGpredictionModifier(d.x)); })
            .curve(d3.curveCardinal);

        this.element
            .attr("d", line);
    }
}

class pathShadow {
    constructor(data) {
        this.data = data;
    }

    draw() {
        var data = this.data;
        var chart = this.chart;
        var svg = chart.svg;

        this.element = svg.append("path");

        this.element
            .datum(data)
            .attr("class", "line-shadow");

        this.redraw();
    }

    redraw() {
        var chart = this.chart;
        var scales = chart.scales;
        var line = d3.line()
            .x(function(d) { return scales.x(d.x); })
            .y(function(d) { return scales.y(d.y); })
            .curve(d3.curveCardinal);

        this.element
            .attr("d", line);
    }
}


