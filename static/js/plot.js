const myGreen = "rgb(143, 188, 143)";
const myGreenDark = "rgb(129, 169, 129)";
const myWhiteShade = "rgba(255, 255, 255, 0.15)";
const myGreenLight = "rgb(157, 207, 157)";
const myBlueShade = "rgba(173, 216, 230, 0.8)";
const myGrayShade = "rgba(100, 100, 100, 0.8)";

// Load data before creating graphs
var BGrows = parseDateValCSV(BGrows0);
var lastBG = BGrows[BGrows.length - 1];
var drifts = parseDateValCSV(drifts0);
var lastDrift = drifts[drifts.length - 1].y;
var futureDrift = Number(localStorage.getItem("futureDrift"));
if (isNaN(futureDrift)) driftModifier = 0;
else driftModifier = futureDrift / 2 - lastDrift;


var chartMargins = {top: 30, right: 20, bottom: 20, left: 40}

// Create upper chart with todays data
var options = {
    background: "rgba(255, 255, 255, 0.5)",
    xDisplacement: { x: -0.5 },
    yMin: -5,
    yMax: 15
};
var xDisplacement = Number(localStorage.getItem("xDisplacement"));
if (isNaN(xDisplacement)) options.xDisplacement.x = -0.5;
else options.xDisplacement.x = xDisplacement;

options.margins = {
    left:   -1,
    right:  0,
    top:    0,
    bottom: 0
};

// Create BG-graph
var chartDiv = document.getElementById("BG-today");
options.hourPixels = chartDiv.clientHeight * 0.5;
var BGtoday = new Chart(chartDiv, options);

// Create basal-graph
chartDiv = document.getElementById("basal-today");
options.background = "rgba(255, 255, 255, 0.15)";
options.yMax = 1;
options.yMin = -1;
options.margins = {
    left:   -1,
    right:  0,
    top:    10,
    bottom: 10
};
var basalToday = new Chart(chartDiv, options);

// Add temporary basal rates
temps = parseTempCSV(temps0);
var barOptions = { yMin: 0.2, yMax: 3, fill: myGrayShade };
var tempbarToday = new tempbar(barOptions, temps, "temps-today");
basalToday.add(tempbarToday);

// Create food-insulin-graph
chartDiv = document.getElementById("food-insulin-today");
options.background = "rgba(255, 255, 255, 0.25)";
options.yMax = 4.5;
options.yMin = -5.5;
options.margins = {
    left:   -1,
    right:  0,
    top:    10,
    bottom: 10
};
var foodInsulinToday = new Chart(chartDiv, options);

// Add chart elements for BG-chart for today
BGtoday.add(new yrange({ yMin: 4, yMax: 10, color: myGreenDark }, "BG-range"));
BGtoday.add(new yrange({ yMin: 5, yMax: 9, color: myGreenLight }, "BG-center-range"));
BGtoday.add(new yrange({ yMin: -2, yMax: 0, color: myGreenLight }, "drift-range"));
BGtoday.add(new steps(drifts, "black", 2, [-4, 4]));
BGtoday.add(new steps(drifts, "rgba(255,0,0, 0.5)", 1, [-4, 4]));

BGtoday.add(new timecursor(lastBG));
bgEstimates = parseDateValCSV(BGestimates0);
BGtoday.add(new pathShadow(bgEstimates.filter(e => e.x > lastBG.x)));
var bgpath = new path(bgEstimates);
BGtoday.add(bgpath);
BGtoday.add(new dots(parseDateValCSV(BGrows0)));
BGtoday.add(new yaxis("secondary", { useScale: false, x: options.margins.left }));

// Add chart elements for food-insulin-chart for today
foodInsulinToday.add(new area(parseDateValCSV(carbRates0), "carbs"));
// scale bolus rates
foodInsulinToday.add(new area(parseAndScaleDateValCSV(bolusRates0, 2), "bolus"));
foodInsulinToday.add(new timeaxis("secondary", { useScale: true, y: 0 }));
foodInsulinToday.add(new tickaxis("secondary-ticks", { useScale: true, y: 0 }));
foodInsulinToday.add(new meals(parseDateValJSON(meals0), "today"));
foodInsulinToday.add(new bolus(parseDateValJSON(bolus0), "today"));

// Create lower chart with yesterdays data
var options2 = {
    background: "rgba(255, 255, 255, 0.5)",
    xDisplacement: { x: options.xDisplacement.x + 24 },
    yMin: -5,
    yMax: 15
};
options2.margins = {
    left:   -1,
    right:  0,
    top:    0,
    bottom: 0
};

// Create BG-graph
var chartDiv2 = document.getElementById("BG-yesterday");
options2.hourPixels = options.hourPixels;
var BGyesterday = new Chart(chartDiv2, options2);

// Add chart elements for BG-chart for yesterday
BGyesterday.add(new yrange({ yMin: 4, yMax: 10, color: myGreenDark }, "BG-range"));
BGyesterday.add(new yrange({ yMin: 5, yMax: 9, color: myGreenLight }, "BG-center-range"));
BGyesterday.add(new yrange({ yMin: -2, yMax: 0, color: myGreenLight }, "drift-range"));
BGyesterday.add(new steps(drifts, "black", 2, [-4, 4]));
BGyesterday.add(new steps(drifts, "rgba(255,0,0, 0.5)", 1, [-4, 4]));

var bgpath2 = new path(parseDateValCSV(BGestimates0));
BGyesterday.add(bgpath2);
BGyesterday.add(new dots(parseDateValCSV(BGrows0)));
BGyesterday.add(new yaxis("secondary", { useScale: false, x: options2.margins.left }));

// Create basal-graph for yesterday
chartDiv = document.getElementById("basal-yesterday");
options2.background = "rgba(255, 255, 255, 0.15)";
options2.yMax = 1;
options2.yMin = -1;
options2.margins = {
    left:   -1,
    right:  0,
    top:    10,
    bottom: 10
};
var basalYesterday = new Chart(chartDiv, options2);

// Add temporary basal rates
basalYesterday.add(new tempbar(barOptions, temps, "temps-yesterday"));

// Create food-insulin-graph for yesterday
chartDiv = document.getElementById("food-insulin-yesterday");
options2.background = "rgba(255, 255, 255, 0.25)";
options2.yMax = 4.5;
options2.yMin = -5.5;
options2.margins = {
    left:   -1,
    right:  0,
    top:    10,
    bottom: 10
};
var foodInsulinYesterday = new Chart(chartDiv, options2);

// Add chart elements for food-insulin-chart for yesterday
foodInsulinYesterday.add(new area(parseDateValCSV(carbRates0), "carbs"));
foodInsulinYesterday.add(new area(parseAndScaleDateValCSV(bolusRates0, 2), "bolus"));
foodInsulinYesterday.add(new timeaxis("secondary", { useScale: true, y: 0 }));
foodInsulinYesterday.add(new tickaxis("secondary-ticks", { useScale: true, y: 0 }));
foodInsulinYesterday.add(new meals(parseDateValJSON(meals0), "yesterday"));
foodInsulinYesterday.add(new bolus(parseDateValJSON(bolus0), "yesterday"));

// Automatically redraw when window is resized
d3.select(window).on('resize', () => this.redraw() );

//d3.select("#viewportDims").html(getViewport());

function redraw() {
    //d3.select("#viewportDims").html(getViewport());
    BGtoday.redraw();
    basalToday.redraw();
    foodInsulinToday.redraw();
    if (chartDiv2.offsetParent != null) {
        options2.xDisplacement.x = options.xDisplacement.x + 24;
        BGyesterday.redraw();
        basalYesterday.redraw();
        foodInsulinYesterday.redraw();
    }
}


function getViewport() {

var viewPortWidth;
var viewPortHeight;

// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
if (typeof window.innerWidth != 'undefined') {
    viewPortWidth = window.innerWidth,
    viewPortHeight = window.innerHeight
}

// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
else if (typeof document.documentElement != 'undefined'
&& typeof document.documentElement.clientWidth !=
'undefined' && document.documentElement.clientWidth != 0) {
    viewPortWidth = document.documentElement.clientWidth,
    viewPortHeight = document.documentElement.clientHeight
}

// older versions of IE
else {
    viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
    viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
}
return viewPortWidth + " &#215; "  + viewPortHeight;
};

function BGpredictionModifier(x) {
    return Math.max(x - lastBG.x, 0) / 1000 / 60 / 60 * 2 * driftModifier;
}

function modifyDrift(x) {
    return (x >= lastBG.x) * driftModifier;
}