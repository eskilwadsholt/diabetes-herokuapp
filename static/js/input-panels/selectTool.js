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
  const BGbody = `<div class="BG-input center">7</div>`;
  $('.input-body').html(BGbody);
  divHeights = 0;
  $('.input-body > div').each( (i, e) => {
    let height = $(e).height();
    console.log(`${e}, ${height}`);
    divHeights += height;
  });
  console.log($('.input-body').height());
  $meterWrapper = $('<div class="meter-wrapper"></div>')
    .height($('.input-body').height() - divHeights);
  $meterWrapper.append($('<div class="BG-meter"></div>'));
  $('.input-body').append($meterWrapper);
  CreateBGmeter();
}

function openInsulinInput() {
  $('.input-body').html("");
  $inputPanel.find("h1").text("Enter Bolus");
}

function openMealInput() {
  $('.input-body').html("");
  $inputPanel.find("h1").text("Enter Meal");
}

function openNoteInput() {
  $('.input-body').html("");
  $inputPanel.find("h1").text("Enter Note");
}