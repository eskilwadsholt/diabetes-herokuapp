$('.input-panel').on('click', (e) => { e.stopPropagation(); } );

$('.tool').on('click', function(e) {
  $('.tool').removeClass('selected');
  $(this).addClass('selected');
  $('.input-panel').addClass('activated');
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
  $inputPanel.find("h1").text("Enter BG");
  const BGbody = `<div class="BG-value center btn--secondary">7</div>
  <div class="error"> </div>`;
  $('.input-body').html(BGbody);
  divHeights = 0;
  $('.input-body > div').each( (i, e) => {
    let height = $(e).height();
    divHeights += height;
  });
  $meterWrapper = $('<div class="meter-wrapper"></div>')
    .height($('.input-body').height() - divHeights);
  $meterWrapper.append($('<div class="BG-meter"></div>'));
  $('.input-body').append($meterWrapper);
  const settings = {
    xmin: 0,
    xmax: 30,
    minticks: 1.6,
    minzoom: 2.5,
    maxzoom: 30,
    yPos: 60,
    xStart: 7
  };
  connectMeter("BG-meter", "BG-value", settings);
  connectBGsubmit();
}

function openInsulinInput() {
  $inputPanel.find("h1").text("Enter Bolus");
  const bolusbody = `<div class="bolus-value center btn--secondary"></div>
  <div class="error"> </div>`;
  $('.input-body').html(bolusbody);
  divHeights = 0;
  $('.input-body > div').each( (i, e) => {
    let height = $(e).height();
    divHeights += height;
  });
  $meterWrapper = $('<div class="meter-wrapper"></div>')
    .height($('.input-body').height() - divHeights);
  $meterWrapper.append($('<div class="bolus-meter"></div>'));
  $('.input-body').append($meterWrapper);
  const settings = {
    xmin: 0,
    xmax: 20,
    minticks: 1.6,
    minzoom: 2.5,
    maxzoom: 10,
    yPos: 60,
    xStart: 1
  };
  connectMeter("bolus-meter", "bolus-value", settings);
  connectBolusSubmit();
}

function openMealInput() {
  $('.input-body').html("");
  $inputPanel.find("h1").text("Enter Meal");
}

function openNoteInput() {
  $('.input-body').html("");
  $inputPanel.find("h1").text("Enter Note");
}