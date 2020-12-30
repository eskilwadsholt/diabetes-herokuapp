$('.btn-plus').on('click', function(e) {
  closePopups();
  if ($(this).hasClass('activated')) {
    $('#overlay').removeClass('active');
    $(this).removeClass('activated');
  }
  else {
    $('#overlay').addClass('active');
    $(this).addClass('activated');
  }
  e.preventDefault();
});

$('#overlay').on('click', function(e) {
  $('.btn-plus').removeClass('activated');
});