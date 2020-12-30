var mouseOverChart = true;
var horizontalDragOn = false;
var verticalDragOn = false;
var mouseDownPoint;
var mouseDownX;
var mouseDownY;
var mouseDownXDisplacement = {};
var mouseNewX;
var driftModifierBefore;
var driftChangeTooltip = d3.select("#drift-change-tooltip");

d3.select("body")
    .on("mousemove", function() {
        var mouseNewPoint = d3.mouse(this);
        mouseNewX = mouseNewPoint[0];
        dragTo(mouseNewX);
    });

function dragStart(startX, startY) {
    var pathY = evaluatePath(bgpath, startX);
    if (Math.abs(pathY - startY) < 15 && (BGtoday.scales.x.invert(startX) - lastBG.x) > 90 * 60 * 1000) {
        verticalDragOn = true;
    }
    else verticalDragOn = false;
    mouseDownX = startX;
    mouseDownY = startY;
    mouseDownXDisplacement.x = options.xDisplacement.x;
    driftModifierBefore = driftModifier;
    horizontalDragOn = true;
}

function dragTo(newX, newY) {
    var xDrag = Math.abs(newX - mouseDownX);
    var yDrag = Math.abs(newY - mouseDownY);
    var dy = dy = (BGtoday.scales.y.invert(newY) - BGtoday.scales.y.invert(mouseDownY));
    var dx = (BGtoday.scales.x.invert(newX) - BGtoday.scales.x.invert(mouseDownX)) / 1000 / 60 / 60;
    if (horizontalDragOn && verticalDragOn) {
        if (yDrag > xDrag) { 
            driftChangeTooltip.style("visibility", "visible")
            horizontalDragOn = false;
        } 
        else if (yDrag < xDrag) verticalDragOn = false;
    }
    if (horizontalDragOn) {
        setXDisplacement(mouseDownXDisplacement.x + dx);
    }
    else if (verticalDragOn) {
        dx = (BGtoday.scales.x.invert(mouseDownX) - lastBG.x) / 1000 / 60 / 30;
        da = dy / dx;
        if (da) setDriftModifier(driftModifierBefore + dy / dx);
        driftChangeTooltip.html(`${(2 * (lastDrift + driftModifier)).toFixed(1)}/h`)
        driftChangeTooltip
            .style("right", (BGtoday.width - newX + 60) + "px")
            .style("top", (newY - 30) + "px");

    }
    redraw();
}

function setDriftModifier(value) {
    driftModifier = value;
    localStorage.setItem("futureDrift", 2 * (lastDrift + value));
}

function setXDisplacement(value) {
    options.xDisplacement.x = value;
    localStorage.setItem("xDisplacement", value);
}

function dragEnd() {
    verticalDragOn = false;
    horizontalDragOn = false;
    driftChangeTooltip.style("visibility", "hidden")
}


var drag = d3.drag()
    .on("start", () => { dragStart(d3.event.x, d3.mouse(bgpath.chart.divElement)[1]); })
    .on("drag", () => { dragTo(d3.event.x, d3.mouse(bgpath.chart.divElement)[1]); })
    .on("end", () => { dragEnd(); });

d3.select("body").call(drag);

// Make sure to deactivate mouse drag on mouseup for entire HTML-page
d3.select("html")
    .on("mouseup", function() {
        dragEnd();
    });

d3.selectAll(".popup-header.close-button")
    .on('click', closePopups);

d3.selectAll("#overlay")
    .on('click', closePopups);

function closePopups() {
    d3.select("#overlay").classed("active", false);
    d3.selectAll(".popup").classed("active", false);
}

var start;
var oldDriftModifier;
var oldXDisplacement;
var resetTimer;
const resetDuration = 100;

d3.select("#reset-view")
    .on("mousedown", function() {
        start = Date.now();
        oldDriftModifier = driftModifier;
        oldXDisplacement = options.xDisplacement.x;
        resetTimer = setInterval(animateReset, 5);
        d3.select("#reset-view")
            .transition()
            .duration(300)
            .attrTween("style", packTween);
        function packTween(d, i , a) {
            return t => `transform: ${tween(d, i, a)(t)};`;
        }
        function tween(d, i, a) {
            return d3.interpolateString("rotate(0deg)", "rotate(360deg)");
        }
    });

function animateReset() {
    t = (Date.now() - start) / resetDuration;
    //console.log(t);
    if (t < 1) {
        setDriftModifier((1 - t) * oldDriftModifier);
        setXDisplacement( (1 - t) * oldXDisplacement - t * 0.5 );
    }
    else {
        setDriftModifier(0);
        setXDisplacement(-0.5);
        clearInterval(resetTimer);
    }
    redraw();
}