class lastbg {
    constructor(lastBG, divElement) {
        this.lastBG = lastBG;
        this.divElement = divElement
    }

    draw() {
        this.lastBGbox = d3.select(this.divElement);
        this.redraw();
    }

    redraw() {
        var lastBG = this.lastBG;
        var scales = this.chart.scales;
        var now = new Date();

        var xCursor = !shiftIsDownOverChart ? now : scales.x.invert(mouseNewX);

        var now = new Date();
        var milliseconds = now - lastBG.x;
        var seconds = milliseconds / 1000;
        var minutes = seconds / 60;
        var hours = minutes / 60;

        
        var timeSinceLastBG = Math.floor(minutes) % 60;
        if (Math.floor(hours) > 0) {
            timeSinceLastBG = Math.floor(hours) + ":" + twoDigits(timeSinceLastBG);
        } else {
            timeSinceLastBG = timeSinceLastBG + " minute" + (Math.floor(minutes) == 1 ? "" : "s");
        }

        var lastBGText = `<div class="mini-header">Last BG-reading</div>
        <div class="info" id="lastBG-info">${lastBG.y} (mmol/L)<br>${timeSinceLastBG} ago</div>`;
        var xCursorMilliseconds = xCursor - now;
        var xCursorSeconds = Math.abs(xCursorMilliseconds) / 1000;
        var xCursorMinutes = xCursorSeconds / 60;
        var xCursorHours = xCursorMinutes / 60;
        var timeToXCursor = Math.floor(xCursorMinutes) % 60;
        if (Math.floor(xCursorHours) > 0) {
            timeToXCursor = Math.floor(xCursorHours) + ":" + twoDigits(timeToXCursor);
        } else {
            timeToXCursor = timeToXCursor + " minute" + (Math.floor(xCursorMinutes) == 1 ? "" : "s");
        }
        var timeToXCursorText = ((Math.ceil(xCursorMilliseconds / 1000 / 60) < 0) ? "-" : "+") + timeToXCursor;
        
        this.lastBGbox
            .html(!shiftIsDownOverChart ? lastBGText : timeToXCursorText);

    }
}