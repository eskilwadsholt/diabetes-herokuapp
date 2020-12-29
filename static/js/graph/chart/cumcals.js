class cumcals {
  constructor(data, divElement) {
      this.data = data;
      this.divElement = divElement
  }

  draw() {
      this.element = d3.select(this.divElement);
      this.redraw();

      d3.select(this.divElement)
        .on("click", () => {
            var popup = d3.select("#cals-popup");
            populateCalsPopup(this.data);
            popup.classed("active", true);
        });
  }

  redraw() {
      var cals = this.data[this.data.length - 1].cum_cals;

      var cumcalsHTML = `<div class="mini-header">Cals Today</div>
      <div class="info" id="cals-info">${cals.toFixed(0)}</div>`;
      
      this.element
          .html(cumcalsHTML);
  }
}

function populateCalsPopup(data) {
    var cals = data[data.length - 1].cum_cals;
    d3.select("#cals-value").html(`${cals.toFixed(0)} Cals today`);

    var lastDate = "";
    var HTML = "";
    data.forEach((d) => {
        if (lastDate != d.date) {
            HTML += `<div id="cals-date">${d.date}</div>`;
            lastDate = d.date;
        }
        d.group.forEach(m => {
            HTML += createMealCalList(m);
        });
    });

    d3.select("#cals-body")
        .html(HTML);

    var calsDiv = document.getElementById("cals-popup");
    calsDiv.scrollTop = calsDiv.scrollHeight;
    
    var overlay = d3.select("#overlay");
    overlay
        .attr("class", "active")
        .on('click', closePopups);
}
