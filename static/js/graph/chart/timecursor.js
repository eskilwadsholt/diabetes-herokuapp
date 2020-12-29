class timecursor {
    constructor(lastBG) {
        this.lastBG = lastBG;
    }

    draw() {
        var chart = this.chart;
        var svg = chart.svg;
        this.verticalLine = svg.append("path");
        this.redraw();
    }

    redraw() {
        var scales = this.chart.scales;
        var now = new Date();

        var xCursor = !shiftIsDownOverChart ? now : scales.x.invert(mouseNewX);

        var currentTimeLine = d3.line()
            .x(function(d) { return scales.x(d.x); })
            .y(function(d) { return scales.y(d.y); });

        this.verticalLine
            .datum([{ x: xCursor, y: -5}, { x: xCursor, y: 18}])
            .attr("class", "vline upper")
            .attr("d", currentTimeLine);
    }
}

function twoDigits(x) {
    var leadingZero = "0" + x;
    return leadingZero.substring(leadingZero.length - 2);
}
