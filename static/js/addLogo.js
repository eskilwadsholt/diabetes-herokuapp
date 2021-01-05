[..."DIA"].forEach(element => {
  $(".logo").append(
    `<div class="dia">${element}</div>`
  );
});
$(".logo").append(`<div class="logo-space"></div>`);
[..."CAST"].forEach(element => {
  $(".logo").append(
    `<div class="cast">${element}</div>`
  );
});