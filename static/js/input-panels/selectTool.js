$('.input-panel').on('click', (e) => { e.stopPropagation(); } );

$('.tool').on('click', function(e) {
  $('.tool').removeClass('selected');
  $(this).addClass('selected');
  $('.input-panel').addClass('activated');
  $('#chart').removeClass('activated');
  $('.bottom-bar').addClass("activate-drag");
  openInputPanel();
  e.stopPropagation();
});

$('body').on('click', function(e) {
  $('.tool').removeClass('selected');
});

function openInputPanel() {
  if ($('.blood').hasClass('selected')) {
    openBGInput();
  }
  else if ($('.insulin').hasClass('selected')) {
    openInsulinInput();
  }
  else if ($('.meal').hasClass('selected')) {
    openMealInput();
  }
  else if ($('.note').hasClass('selected')) {
    openNoteInput();
  }
}

function openBGInput() {
  const BGbody = `<input
  inputmode="numeric"
  pattern="[0-9]*"
  type="text"
  value = "0.0"
  name="BG-value">
    <div class="flex-item"><div class="BG-meter"></div><div>`;
  $('.input-body').html(BGbody);
  $inputPanel.find(".tool-header").html(`Enter
    <div class="logo-space"></div>
    <div class="tool-h1">B</div>
    <div class="tool-h2">G</div>`);
  const settings = {
    xmin: 0,
    xmax: 30,
    minticks: 1.6,
    minzoom: 3,
    maxzoom: 30,
    yPos: 70,
    xStart: 7
  };
  connectMeter("BG-meter", 'input[name="BG-value"]', settings);
  const $bgInput = $('input[name="BG-value"]');
  $bgInput.on("click", () => $bgInput.val(""));
}

function openInsulinInput() {
  let insulinBody = `<input
    inputmode="numeric"
    pattern="[0-9]*"
    type="text"
    value = "0"
    name="bolus-value">
    <div class="flex-item"><div class="bolus-meter"></div><div>`;
  $('.input-body').html(insulinBody);
  $inputPanel.find(".tool-header").html(`Enter
    <div class="logo-space"></div>
    <div class="tool-h1">B</div>
    <div class="tool-h1">O</div>
    <div class="tool-h2">L</div>
    <div class="tool-h2">U</div>
    <div class="tool-h2">S</div>`);
    const settings = {
      xmin: 0,
      xmax: 10,
      minticks: 1.6,
      minzoom: 1.6,
      maxzoom: 10,
      yPos: 70,
      xStart: 1
    };
    connectMeter("bolus-meter", 'input[name="bolus-value"]', settings);
    const $bolusInput = $('input[name="bolus-value"]');
    $bolusInput.on("click", () => $bolusInput.val("0."));
}

function openMealInput() {
  $('.input-body').html("");
  $inputPanel.find(".tool-header").html(`Enter
    <div class="logo-space"></div>
    <div class="tool-h1">M</div>
    <div class="tool-h1">E</div>
    <div class="tool-h2">A</div>
    <div class="tool-h2">L</div>`);
}

function openNoteInput() {
  $('.input-body').html("");
  $inputPanel.find(".tool-header").html(`Enter
    <div class="logo-space"></div>
    <div class="tool-h1">N</div>
    <div class="tool-h1">O</div>
    <div class="tool-h2">T</div>
    <div class="tool-h2">E</div>`);
}