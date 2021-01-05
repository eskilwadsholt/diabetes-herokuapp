function connectBGsubmit() {
  $(".BG-value").on("click", function(e) {
    $BGval = Number($(".BG-value").text());
    $error = $(".error");
    console.log(`Send BG: ${$BGval} to DB`);
    data = {
      timestamp: new Date(),
      BG: $BGval
    };
    $.ajax({
      url: "/data/BG",
      type: "POST",
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(resp) {
        console.log(resp);
        window.location.href = "/dashboard/";
      },
      error: function(resp) {
        console.log(resp);
        if ("error" in resp.responseJSON) {
          $error.text(resp.responseJSON.error).removeClass("error--hidden");
        }
        else {
          $error.text("Something went wrong").removeClass("error--hidden");
        }
      }
    });
    e.stopPropagation();
  });
}

function connectBolusSubmit() {
  $(".bolus-value").on("click", function(e) {
    $bolusval = Number($(".bolus-value").text());
    $error = $(".error");
    console.log(`Send bolus: ${$bolusval} to DB`);
    data = {
      timestamp: new Date(),
      bolus: $bolusval
    };
    $.ajax({
      url: "/data/bolus",
      type: "POST",
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(resp) {
        console.log(resp);
        window.location.href = "/dashboard/";
      },
      error: function(resp) {
        console.log(resp);
        if (resp.responseJSON && "error" in resp.responseJSON) {
          $error.text(resp.responseJSON.error).removeClass("error--hidden");
        }
        else {
          $error.text("Something went wrong").removeClass("error--hidden");
        }
      }
    });
    e.stopPropagation();
  });
}

function submitBG(inputID) {
  let $BGval = Number($(inputID).val());
  let $error = $(".error");
  console.log(`Send BG: ${$BGval} to DB`);
  let data = {
    timestamp: new Date(),
    BG: $BGval
  };
  $.ajax({
    url: "/data/BG",
    type: "POST",
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(resp) {
      console.log(resp);
      window.location.href = "/dashboard/";
    },
    error: function(resp) {
      console.log(resp);
      if ("error" in resp.responseJSON) {
        $error.text(resp.responseJSON.error).removeClass("error--hidden");
      }
      else {
        $error.text("Something went wrong").removeClass("error--hidden");
      }
    }
  });
}

function submitBolus(inputID) {
  $bolusval = Number($(inputID).val());
  $error = $(".error");
  console.log(`Send bolus: ${$bolusval} to DB`);
  data = {
    timestamp: new Date(),
    bolus: $bolusval
  };
  $.ajax({
    url: "/data/bolus",
    type: "POST",
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(resp) {
      console.log(resp);
      window.location.href = "/dashboard/";
    },
    error: function(resp) {
      console.log(resp);
      if (resp.responseJSON && "error" in resp.responseJSON) {
        $error.text(resp.responseJSON.error).removeClass("error--hidden");
      }
      else {
        $error.text("Something went wrong").removeClass("error--hidden");
      }
    }
  });
}