class bgstamp {
    constructor(path, divElement) {
        this.path = path;
        this.divElement = divElement;
    }

    draw() {
        var divElement = this.divElement;
        this.element = d3.select(divElement);
        this.element
            .on("click", () => {
                populateStatsPopup();
                d3.select("#stats-popup").classed("active", true);
            });

        this.redraw();
    }

    redraw() {
        var scales = this.chart.scales;

        var xCursor = !shiftIsDownOverChart ? new Date() : scales.x.invert(mouseNewX);
        var x = scales.x(xCursor);
        var y = evaluatePath(this.path, x);

        this.element
            .html('<div class="mini-header">BG-estimate</div><div class="info" id ="BG-info">' + 
            (scales.y.invert(y)).toFixed(1) + '</div>');
    }
}

function populateStatsPopup() {
    d3.select("#stats-text").html("Average BG");
    d3.select("#stats-value").html(stats["Average BG"]);
    var HTML = "";
    for (const key of Object.keys(stats).filter(k => k + " time" in stats)) {
        HTML += packStat(key);
    }
    var statsBody = document.getElementById("stats-body");
    d3.select(statsBody).html(HTML);
    this.width = statsBody.clientWidth;
    this.height = statsBody.clientWidth;
    var statsHistogram = document.getElementById("stats-histogram");
    d3.select(statsHistogram).html("");
    var svg = d3.select(statsHistogram)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height);

    const leftMargin = 20;
    const bottomMargin = 15;
    const textMargin = 60;
    const xScale = d3.scaleLinear().range([5 + leftMargin, this.width - 10 - textMargin]);
    const yScale = d3.scaleLinear().range([this.height - 10 - bottomMargin, 5]);
    const maxHours = Math.ceil(stats["histogram 1 max"], 0);
    const maxBG = Math.ceil(stats["histogram BG max"], 0) + 1;
    xScale.domain([0, maxHours]);
    yScale.domain([0, maxBG]);

    svg.selectAll("rect")
        .attr("class", "histogram 1")
        .data(stats["histogram 1"])
        .enter()
        .append("rect")
        .attr("x", d => xScale(0))
        .attr("y", d => yScale(d.max))
        .attr("fill", d => (d.min >= 4 && d.max <= 10) ? myGreenLight : "rgb(150, 150, 150)")
        .style("stroke", "rgba(0, 0, 0, 0.3)")
        .attr("stroke-width", "2px")
        .attr("width", d => xScale(d.hours) - xScale(0))
        .attr("height", d => yScale(d.min) - yScale(d.max));

    svg.selectAll("rect")
        .attr("class", "histogram 0.5")
        .data(stats["histogram 1"].concat(stats["histogram 0.5"]))
        .enter()
        .append("rect")
        .attr("x", d => xScale(0))
        .attr("y", d => yScale(d.max))
        .attr("fill", d => (d.min >= 4 && d.max <= 10) ? "rgba(0, 100, 0, 0.4)" : "rgba(0, 0, 255, 0.4)")
        .attr("width", d => xScale(d.hours) - xScale(0))
        .attr("height", d => yScale(d.min) - yScale(d.max));
    
    var xAxis = d3.axisBottom(xScale).ticks(4);
    var yAxis = d3.axisLeft(yScale).ticks(4);

    svg
        .append("g")
        .attr("class", "y axis stats");

    svg
        .append("g")
        .attr("class", "x axis stats");

    svg.select(".y.axis.stats")
        .attr("transform", `translate(${xScale(0)}, 0)`)
        .call(yAxis);

    svg.select(".x.axis.stats")
        .attr("transform", `translate(0, ${yScale(0)})`)
        .call(xAxis);

    svg.selectAll("target ranges")
        .data(stats["target ranges"])
        .enter()
        .append("text")
        .text(d => minutesToHHMM(d.minutes))
        .style("pointer-events", "none")
        .attr("x", xScale(maxHours) + 5)
        .attr("y", d => (yScale(d.min) + yScale(d.max)) / 2);

    svg.selectAll("target ranges as percentage")
        .data(stats["target ranges"])
        .enter()
        .append("text")
        .text(d => d.percentage.toFixed(1) + "%")
        .style("pointer-events", "none")
        .attr("x", xScale(maxHours) + 5)
        .attr("y", d => (yScale(d.min) + yScale(d.max)) / 2 + 14);

    var overlay = d3.select("#overlay");
    overlay
        .attr("class", "active")
        .on('click', closePopups);
}

function packStat(key) {
    return `
        <div class="stat-row">
            <div class="stat-description">
                ${key}
            </div>
            <div class="stat-percentage">
                ${stats[key]}%
            </div>
            <div class="stat-time">
                ${stats[key + " time"]}
            </div>
        </div>
    `;
}
