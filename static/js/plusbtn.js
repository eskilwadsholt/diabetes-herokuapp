const $bottomBar = $('.bottom-bar');
const $inputPanel = $('.input-panel');
const $chart = $('#chart');

$('.btn-plus').on('click', function(e) {
  if ($bottomBar.hasClass('activated')) {
    $bottomBar.removeClass("activate-drag");
    $bottomBar.removeClass('activated');
    $inputPanel.removeClass('activated');
    $(".tool").removeClass('selected');
    $chart.addClass('activated');
  }
  else {
    $bottomBar.addClass('activated');
    $chart.removeClass('activated');
  }
  e.preventDefault();
});

let mouseY = 0;
let maxY = 200;

let plusBtnColor = null;
const submitGreen = "rgb(30, 200, 30)";
let colorInterpolater = null;

function plusDragStart(startY) {
  mouseY = startY;
  plusBtnColor = $(".btn-plus").css("background-color");
  colorInterpolater = d3.interpolate(plusBtnColor, submitGreen);
}

const submitHeight = 160;

function plusDragTo(newY) {
  if ($bottomBar.hasClass("activate-drag")) {
    $(".vertical-drag-container").addClass("dragging");
    let newBottom = mouseY - newY;
    if (newBottom >= submitHeight) {
      console.log("Plus button confirmation activated ...");
      newBottom = 0;
      $bottomBar.removeClass("activate-drag");
      $bottomBar.removeClass('activated');
      $inputPanel.removeClass('activated');
      $(".tool").removeClass('selected');
      $chart.addClass('activated');
      plusDragEnd();
    }
    else {
      if (newBottom < 0) newBottom = 0;
      const progress = newBottom / submitHeight;
      $('.btn-plus').css({
        top: `calc(100% - ${newBottom + 80}px)`,
        "background-color": colorInterpolater(progress)
      });
      $('#rect1').css({
        right: "calc(50% - 5px)",
        width: "calc(30% + 5px)",
        transform: `rotate(${-45 * progress}deg)`,
        "transform-origin": "calc(100% - 5px) 5px",
        bottom: `calc(50% + ${0.25 * Math.sqrt(2) * 30 * progress}% - 5px)`
      });
      $('#rect2').css({
        left: "calc(50% - 5px)",
        width: "calc(30% + 5px)",
        transform: `rotate(${45 * progress}deg)`,
        "transform-origin": "5px 5px",
        bottom: `calc(50% + ${0.25 * Math.sqrt(2) * 30 * progress}% - 5px)`
      });
    }
  }
}

function plusDragEnd() {
  $('.btn-plus').attr('style', '');
  $('.btn-plus > *').attr('style', '');
  $(".vertical-drag-container").removeClass("dragging");
}

let plusDrag = d3.drag()
      .on("start", () => { plusDragStart(d3.event.y); })
      .on("drag", () => { plusDragTo(d3.event.y); })
      .on("end", () => { plusDragEnd(); });

d3.select(".bottom-bar").call(plusDrag);