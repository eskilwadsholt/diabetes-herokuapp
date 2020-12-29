// Functions to format and parse date/time
var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
var formatTimeH = d3.timeFormat("%H");
var formatTimeHM = d3.timeFormat("%H:%M");
var formatTimeHMS = d3.timeFormat("%H:%M:%S");

function twoDigits(x) {
    var leadingZero = "0" + x;
    return leadingZero.substring(leadingZero.length - 2);
}

function parseDateValCSV(csv_string) {
    var result = d3.csvParse(csv_string);
    result.forEach(function(d) {
        d.x = parseDate(d.x);
        d.y = +d.y;
    });
    return result;
}

function parseTempCSV(csv_string) {
    var result = d3.csvParse(csv_string);
    result.forEach(function(d) {
        d.start = parseDate(d.start);
        d.end = parseDate(d.end);
        d.rate = +d.rate;
    });
    return result;
}

function parseAndScaleDateValCSV(csv_string, factor) {
    var result = d3.csvParse(csv_string);
    result.forEach(function(d) {
        d.x = parseDate(d.x);
        d.y = +d.y * factor;
    });
    return result;
}

function parseAndClampDateValCSV(csv_string, ymin, ymax) {
    var result = d3.csvParse(csv_string);
    result.forEach(function(d) {
        d.x = parseDate(d.x);
        d.y = ((+d.y > ymin) && (+d.y < ymax)) ? +d.y : NaN;
    });
    return result;
}

function parseClampAndScaleDateValCSV(csv_string, ymin, ymax, factor) {
    var result = d3.csvParse(csv_string);
    result.forEach(function(d) {
        d.x = parseDate(d.x);
        d.y = ((+d.y > ymin) && (+d.y < ymax))  ? +d.y * factor : NaN;
    });
    return result;
}


function parseDateValJSON(json_list) {
    // Convert string to datetime if not already converted
    json_list.forEach(d => { d.time = parseDate(d.time) ? parseDate(d.time) : d.time ; });
    return json_list;
}

function evaluatePath(path, x) {
    var pathLength = path.element.node().getTotalLength();
    var x = Math.floor(x);
    var beginning = 0, end = pathLength, target, pos;
    while (true) {
        target = Math.floor((beginning + end) / 2);
        pos = path.element.node().getPointAtLength(target);
        if ((target === end || target === beginning) && pos.x !== x) {
            break;
        }
        if (pos.x > x)      end = target;
        else if (pos.x < x) beginning = target;
        else                break; //position found
    }
    return pos.y;
}

function squareDist(P1, P2) {
    return Math.pow(P2.x - P1.x, 2) + Math.pow(P2.y - P1.y, 2);
}

function nearestPoint(path, P) {
    console.log(P);
    var pathLength = path.element.node().getTotalLength();
    var lower = 0, upper = pathLength, target, start, mid, end;
    while (lower < upper) {
        console.log(`${lower}-${upper}`);
        target = Math.floor((lower + upper) / 2);
        start = path.element.node().getPointAtLength(lower);
        mid = path.element.node().getPointAtLength(target);
        end = path.element.node().getPointAtLength(upper);
        if (squareDist(mid, P) < squareDist(start, P)) lower = target;
        else upper = target;
    }
    return mid;
}

function clamp(value, min, max) {
    if (value < min) return min;
    else if (value > max) return max;
    return value;
}

function minutesToHHMM(m) {
    var HH = Math.floor(m / 60);
    var MM = m % 60;
    return HH + ":" + twoDigits(MM);
}