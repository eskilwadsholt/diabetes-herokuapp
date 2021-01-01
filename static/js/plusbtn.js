const $bottomBar = $('.bottom-bar');
const $inputPanel = $('.input-panel');

$('.btn-plus').on('click', function(e) {
  if ($bottomBar.hasClass('activated')) {
    $bottomBar.removeClass('activated');
    $inputPanel.removeClass('activated');
  }
  else {
    $bottomBar.addClass('activated');
  }
  e.preventDefault();
});