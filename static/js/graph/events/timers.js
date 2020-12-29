var dataTimestamp = d3.select("#data-timestamp");

window.onload = function() {
    updateDataTime();
}


setInterval(() => clockTick(), 10000);

function clockTick() {
    if (!shiftIsDownOverChart) {
        redraw();
    }
    updateDataTime();
}

function updateDataTime() {
    var milliseconds = Date.now() - parseDate(dataTime);
    var seconds = milliseconds / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;

    
    var timeSinceLoad = Math.floor(minutes) % 60;
    if (Math.floor(hours) > 0) {
        timeSinceLoad = Math.floor(hours) + ":" + twoDigits(timeSinceLoad);
    }
    else if (minutes >= 1) {
        timeSinceLoad = timeSinceLoad + " minute" + (Math.floor(minutes) == 1 ? "" : "s");
    }
    
    if (minutes < 1) dataTimestamp.html("Data just now");
    else dataTimestamp.html(`Data ${timeSinceLoad} ago`);
}