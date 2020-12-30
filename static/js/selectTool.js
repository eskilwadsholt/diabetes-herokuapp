$('.tool').on('click', function(e) {
  $('.tool').removeClass('selected');
  $(this).addClass('selected');
  e.stopPropagation();
});

$('body').on('click', function(e) {
  $('.tool').removeClass('selected');
});