/*
This file provides a class for creating a chart and update its elements continuously.
*/

class Chart {
    constructor(divElement, options) {
        this.divElement = divElement;
        Object.keys(options).forEach(key => {
            var value = options[key];
            this[key] = value;
        });
        this.elements = [];
        this.width = divElement.clientWidth;
        this.height = divElement.clientHeight;
        this.svg = d3.select(divElement)
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("background", ("background" in this ? this.background : "None"));
        // Create scales
        this.scales = {}
        var xNow = new Date();
        var xMin = new Date();
        var xMax = new Date();
        this.xDims = this.width / this.hourPixels;
        xMin.setHours(xNow.getHours() - this.xDims / 2);
        xMax.setHours(xNow.getHours() + this.xDims / 2);
        xMin -= this.xDisplacement.x * 60 * 60 * 1000;
        xMax -= this.xDisplacement.x * 60 * 60 * 1000;
        var xScale = d3.scaleTime().range([this.margins.left, this.width - this.margins.right]);
        var yScale = d3.scaleLinear().range([this.height - this.margins.bottom, this.margins.top]);
        xScale.domain([xMin, xMax]);
        yScale.domain([this.yMin, this.yMax]);
        this.scales.x = xScale;
        this.scales.y = yScale;
    }

    clear() {
        this.divElement.innerHTML = '';
    }

    add(element) {
        element.chart = this;
        element.draw();
        this.elements.push(element);
    }

    redraw() {
        this.width = this.divElement.clientWidth;
        this.height = this.divElement.clientHeight;
        // Update scales
        this.scales = {}
        var xNow = new Date();
        var xMin = new Date();
        var xMax = new Date();
        this.xDims = this.width / this.hourPixels;
        xMin.setHours(xNow.getHours() - this.xDims / 2);
        xMax.setHours(xNow.getHours() + this.xDims / 2);
        xMin -= this.xDisplacement.x * 60 * 60 * 1000;
        xMax -= this.xDisplacement.x * 60 * 60 * 1000;
        var xScale = d3.scaleTime().range([this.margins.left, this.width - this.margins.right]);
        var yScale = d3.scaleLinear().range([this.height - this.margins.bottom, this.margins.top]);
        xScale.domain([xMin, xMax]);
        yScale.domain([this.yMin, this.yMax]);
        this.scales.x = xScale;
        this.scales.y = yScale;
        // Update dims
        this.svg
            .attr("width", this.width)
            .attr("height", this.height);
        // Redraw all elements
        this.elements.forEach(e => e.redraw());
    }
}