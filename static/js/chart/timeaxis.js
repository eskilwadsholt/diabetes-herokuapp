
class timeaxis {
    constructor(name, ypos) {
        this.name = name;
        this.ypos = ypos;
    }

    draw() {
        var chart = this.chart;
        var svg = chart.svg;

        svg
            .append("g")
            .attr("class", "x axis " + this.name);

        this.redraw();
    }

    redraw() {
        var chart = this.chart;
        var svg = chart.svg;
        var scales = chart.scales;
        var xAxis = d3.axisBottom(scales.x)
            .ticks(d3.timeHour.every(3))
            .tickFormat(x => formatTimeH(x) + "⁰⁰");

        svg.select(".x.axis." + this.name)
            .attr("transform", "translate(0," + (this.ypos.useScale ? scales.y(this.ypos.y) : this.ypos.y) + ")")
            .call(xAxis);
    }
}

class tickaxis {
    constructor(name, ypos) {
        this.name = name;
        this.ypos = ypos;
    }

    draw() {
        var chart = this.chart;
        var svg = chart.svg;

        svg
            .append("g")
            .attr("class", "x axis " + this.name);

        this.redraw();
    }

    redraw() {
        var chart = this.chart;
        var svg = chart.svg;
        var scales = chart.scales;
        var xAxis = d3.axisTop(scales.x)
            .ticks(d3.timeHour.every(1))
            .tickFormat("");

        svg.select(".x.axis." + this.name)
            .attr("transform", "translate(0," + (this.ypos.useScale ? scales.y(this.ypos.y) : this.ypos.y) + ")")
            .call(xAxis);
    }
}
