class meals {
    constructor(data, name) {
        this.data = data;
        this.name = name;
    }

    draw() {
        var data = this.data;
        var chart = this.chart;
        var svg = chart.svg;

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "meal-circle " + this.name)
            .attr("r", 14)
            .on("click", function(d) {
                var popup = d3.select("#meal-popup");
                document.getElementById("meal-popup").scrollTop = 0;
                populateMealTable(popup, d);
                popup
                    .classed("active", true);
                var overlay = d3.select("#overlay");
                overlay
                    .attr("class", "active")
                    .on('click', closePopups);
            });

        svg.selectAll("carbs")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "carbs " + this.name)
            .style("pointer-events", "none")
            .style("text-anchor", "middle")
            .text((d) => ("+" + (d.carbs * carbRatio).toFixed(1)));
        
        this.redraw();
    }

    redraw() {
        var chart = this.chart;
        var scales = chart.scales;

        d3.selectAll(".meal-circle." + this.name)
            .attr("cx", function(d) { return scales.x(d.time); })
            .attr("cy", function(d) { return scales.y(4) - 8; });

        d3.selectAll(".carbs." + this.name)
            .attr("x", function(d) { return scales.x(d.time); })
            .attr("y", function(d) { return scales.y(4) - 2; });
    }
}

function populateMealTable(popup, d) {
    popup.select("#carbs-value")
        .html(mealCarbs(d));

    var HTML = "";
    d.group.forEach((m) => {
        HTML += `<div>${createMealCarbList(m)}</div>`;
    });

    d3.select("#meal-body")
        .html(HTML);
}

