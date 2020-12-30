const $bottomBar = $('.bottom-bar')

$('.btn-plus').on('click', function(e) {
  if ($bottomBar.hasClass('activated')) {
    $('#overlay').removeClass('active');
    $bottomBar.removeClass('activated');
  }
  else {
    $('#overlay').addClass('active');
    $bottomBar.addClass('activated');
  }
  e.preventDefault();
});

$('#overlay').on('click', function(e) {
  $('#overlay').removeClass('active');
  $bottomBar.removeClass('activated');
});