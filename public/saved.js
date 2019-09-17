$.getJSON("/getsaved", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
  
      mycard = $(
  
        "<div class='col-sm-4'>" +
        "<div class='card' style='width: 18rem;'>" +
        "<a href='#' class='btn btn-danger unsave-article' data-arid='" + data[i]._id + "'>Unsave</a>"+
        "<img src='"+data[i].image+"' class='card-img-top' alt='...'>" +
        "<div class='card-body'>" +
        "<h5 class='card-title'>" + data[i].title + "</h5>" +
        "<p class='card-text'>" + data[i].summary + "</p>" +
        "<a href='" + data[i].link + "' class='btn btn-info' target='blank'>Read Article</a>" +
        "      " +
        "<a href='#' class='btn btn-info click-note' data-arid='" + data[i]._id + "'>Comments</a>" +
       
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
     showNotes(data)
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
     showNotes(data)
    })
  
    
  })
  
  
  $(document).on("click", ".close-notes", function (){
  overlay.remove()
  $(".wrap").css("visibility", "hidden")
  
  })

  $(document).on("click", ".unsave-article", function () {
    
    artId = $(this).data("arid")
  console.log(artId)
  
  $.ajax({

    method: "POST",
    url: "/unsave-article/" + artId,
    
  }).then(function (data) {
      window.location.reload()
    
  })
})

$(document).on("click", ".delete", function (){
    noteId = $(this).data("noteid")
    artId = $(this).data("artid")
    $.ajax({
      method: "DELETE",
      url: "/delete-note/" + noteId+"/"+artId,
     
    }).then(function (data) {
  
   showNotes(data)
  
    })
    
    })


function showNotes(data){
    $(".mynotes").empty();
    
    notes=data.note
    for (i=0;i<notes.length;i++){
      j=i+1
      noteText=$( "<hr>"+
      "<div>"+
      "<p>Comment"+j+": "+notes[i].notebody+"</p>"+
      "<button class='delete' data-artid='" + data._id+ "' data-noteid='" + notes[i]._id +"'>Delete</button>"+
      "</div>")

      $(".mynotes").append(noteText);
    }
  }