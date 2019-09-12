$.getJSON("/getit", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page

    mycard = $(

      "<div class='col-sm-4'>" +
      "<div class='card' style='width: 18rem;'>" +
      "<img src='...' class='card-img-top' alt='...'>" +
      "<div class='card-body'>" +
      "<h5 class='card-title'>" + data[i].title + "</h5>" +
      "<p class='card-text'>" + data[i].summary + "</p>" +
      "<a href='" + data[i].link + "' class='btn btn-primary' target='blank'>Read Article</a>" +
      "      " +
      "<a href='#' class='btn btn-primary click-note' data-arid='" + data[i]._id + "'>Comments</a>" +
      "</div>" +
      "</div>" +
      "</div>"


    )

    $(".here").append(mycard);
  }




});
$(document).on("click", ".click-note", function () {
  articleId = $(this).data("arid")
  console.log(articleId)
  overlay = $(
    
    "<div class='overlay'>" +
    "<div><button class='close-notes'> Close Comments</button><div><hr>"+
    "<input id='note-input' type='text'><button data-arid='" + articleId + "' class='add-note'> Add Comment</button>" +
    "<div class='mynotes'></div>" +
    
    "</div>"
  )
  $(".container").append(overlay);
  $(".wrap").css("visibility", "visible")
  $.ajax({
    method: "GET",
    url: "/get-notes/" + articleId,
    
  }).then(function(data){
    for (i=0;i<data.length;i++){
      j=i+1
      noteText=$("<p class='text-left'>Comment"+j+": "+data[i].notebody+"</p>")

      $(".mynotes").append(noteText);
    }
  })

})
$(document).on("click", ".add-note", function () {
  artId = $(this).data("arid")
  console.log(artId)
  noteInput = $("#note-input").val().trim()
  $.ajax({
    method: "POST",
    url: "/add-note/" + artId,
    data: {

      notebody: noteInput
    }
  }).then(function (data) {
    console.log(data)
    $(".mynotes").empty();
    for (i=0;i<data.length;i++){
      j=i+1
      noteText=$("<p>Comment"+j+": "+data[i].notebody+"</p>")

      $(".mynotes").append(noteText);
    }

  })

  
})


$(document).on("click", ".close-notes", function (){
overlay.remove()
$(".wrap").css("visibility", "hidden")

})