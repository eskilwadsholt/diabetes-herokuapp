$('.dropdown-menu').on("click", function(e) {
  e.preventDefault();
  $(this).toggleClass("change");
});