function mealCals(data) {
  return `${data.cals.toFixed(0)} cals`;
}

function createMealCalList(data) {
  return `<div class="meal-caption">
    <div class="meal-title">
      <div id="time">${formatTimeHM(parseDate(data.time))}</div>
      <div id="description">${data.description}</div>
      <div id="meal-stats">${mealCals(data)}</div>
    </div>
  </div>`;
}

function createMealCarbList(data) {
  return `<div class="meal-caption">
  <div class="meal-title">
    <div id="time">${formatTimeHM(parseDate(data.time))}</div>
    <div id="description">${data.description}</div>
    <div id="meal-stats">${mealCarbs(data)}</div>
  </div>
</div>`;
}

function mealCarbs(data) {
  return `${(carbRatio * data.carbs).toFixed(1)}↑ (${data.carbs.toFixed(0)} carbs)`;
}
