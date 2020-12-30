$('.menubtn').on("click", function(e) {
  $('.dropdown-menu').toggleClass("open");
  e.stopPropagation();
});

$('body').on('click', function(e) {
  $('.dropdown-menu').removeClass('open');
});