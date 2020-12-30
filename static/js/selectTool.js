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
  $inputPanel.html("<h1 class='center'>Enter BG</h1>");
}

function openInsulinInput() {
  $inputPanel.html("<h1 class='center'>Enter Bolus</h1>");
}

function openMealInput() {
  $inputPanel.html("<h1 class='center'>Enter Meal</h1>");
}

function openNoteInput() {
  $inputPanel.html("<h1 class='center'>Enter Note</h1>");
}