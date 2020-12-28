var shiftIsDownOverChart = false;

// Check for key presses
const shiftKey = 16;
d3.select("html")
    .on("keydown", function() {
        if (mouseOverChart && d3.event.keyCode == shiftKey) {
            shiftIsDownOverChart = true;
            redraw();
        }
    })
    .on("keyup", function() {
        shiftIsDownOverChart = false;
        redraw();
    });