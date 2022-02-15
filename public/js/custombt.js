var sharebtn = $(".share");
var sharebtnstar = $(".sharestar");
var currentButton;

$("#exampleModal").on("show.bs.modal", function (event) {
  currentButton = $(event.relatedTarget);
});

sharebtn.on("click", function (e) {
  const url = "/profile/movie/share";

  const data = { id: currentButton.data("whatever") };

  $.ajax({
    url,
    type: "POST",
    data,
    success: function (result) {
      $("[data-dismiss=modal]").trigger({ type: "click" });
      var classlist = currentButton.attr("class").split(/\s+/);
      if (classlist.includes("shared")) {
        currentButton.removeClass("shared");
        currentButton.text("Share");
      } else {
        currentButton.addClass("shared");
        currentButton.text("Shared");
      }
    },
  });
});

sharebtnstar.on("click", function (e) {
  const url = "/profile/star/share";

  const data = { id: currentButton.data("whatever") };

  $.ajax({
    url,
    type: "POST",
    data,
    success: (result) => {
      $("[data-dismiss=modal]").trigger({ type: "click" });
      var classlist = currentButton.attr("class").split(/\s+/);
      if (classlist.includes("shared")) {
        currentButton.removeClass("shared");
        currentButton.text("Share");
      } else {
        currentButton.addClass("shared");
        currentButton.text("Shared");
      }
    },
  });
});

var movieslikebtn = $(".movielike");

movieslikebtn.on("click", function success(e) {
  const url = "/movies/like";

  const data = { id: $(this).data("whatever") };

  $.ajax({
    url,
    type: "POST",
    data,
    success: (result) => {
      var classlist = $(this).attr("class").split(/\s+/);

      if (classlist.includes("like")) {
        $(this).removeClass("like").addClass("liked");
        $(this).text("").append("<i class='ion-heart'></i> Liked");
      } else {
        $(this).removeClass("liked").addClass("like");
        $(this).text("").append("<i class='ion-heart'></i> Like");
      }
    },
  });
});

var likebtn = $(".likebtn");
likebtn.on("click", function (e) {
  const url = "/movies/like";

  const data = { id: $(this).data("whatever") };

  $.ajax({
    url,
    type: "POST",
    data,
    success: function (result) {
      var classlist = likebtn.attr("class").split(/\s+/);
      if (classlist.includes("yellowbtn")) {
        likebtn.siblings().removeClass("yellowbtn");
        likebtn.removeClass("yellowbtn");
        likebtn.siblings().addClass("reddbtn");
        likebtn.addClass("reddbtn");

        likebtn.text("");
        likebtn.append("<i class='ion-heart'></i>");
        likebtn.append("Liked");
      } else {
        likebtn.siblings().removeClass("reddbtn");
        likebtn.removeClass("reddbtn");
        likebtn.siblings().addClass("yellowbtn");
        likebtn.addClass("yellowbtn");

        likebtn.text("");
        likebtn.append("<i class='ion-heart'></i>");
        likebtn.append("Like");
      }
    },
  });
});

var starlikebtn = $(".starlike");

starlikebtn.on("click", function success(e) {
  const url = "/stars/like";

  const data = { id: $(this).data("whatever") };

  $.ajax({
    url,
    type: "POST",
    data,
    success: (result) => {
      var classlist = $(this).attr("class").split(/\s+/);

      if (classlist.includes("like")) {
        $(this).removeClass("like").addClass("liked");
        $(this).text("").append("<i class='ion-heart'></i> Liked");
      } else {
        $(this).removeClass("liked").addClass("like");
        $(this).text("").append("<i class='ion-heart'></i> Like");
      }
    },
  });
});

var likebtnStar = $(".likebtn-star");
likebtnStar.on("click", function (e) {
  const url = "/stars/like";

  const data = { id: $(this).data("whatever") };

  $.ajax({
    url,
    type: "POST",
    data,
    success: function (result) {
      var classlist = likebtnStar.attr("class").split(/\s+/);
      if (classlist.includes("yellowbtn")) {
        likebtnStar.siblings().removeClass("yellowbtn");
        likebtnStar.removeClass("yellowbtn");
        likebtnStar.siblings().addClass("reddbtn");
        likebtnStar.addClass("reddbtn");

        likebtnStar.text("");
        likebtnStar.append("<i class='ion-heart'></i>");
        likebtnStar.append("Liked");
      } else {
        likebtnStar.siblings().removeClass("reddbtn");
        likebtnStar.removeClass("reddbtn");
        likebtnStar.siblings().addClass("yellowbtn");
        likebtnStar.addClass("yellowbtn");

        likebtnStar.text("");
        likebtnStar.append("<i class='ion-heart'></i>");
        likebtnStar.append("Like");
      }
    },
  });
});


$("#deleteModal").on("show.bs.modal", function (event) {
  $("#delete-inf").val($(event.relatedTarget).data("id"));
});
