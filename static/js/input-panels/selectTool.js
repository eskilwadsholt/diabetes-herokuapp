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
  const BGbody = `<div class="BG-input center"></div>
    <div class="BG-meter center"></div>`;
  $('.input-body').html(BGbody);
  $inputPanel.find("h1").text("Enter BG");
  CreateBGmeter();
  //$inputPanel.html("<h1 class='center'>Enter BG</h1>");
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