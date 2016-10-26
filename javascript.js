$(function(){
  for(i=0; localStorage.length>i; i++){
    var storedIdeaBox = JSON.parse(localStorage.getItem(localStorage.key(i)));
    createIdeaBox(storedIdeaBox);
  }
});


$(".idea-container").on("focus", ".idea-title, .idea-body", function(){
  var selector = $(this).closest(".idea-card");
  var key = selector.attr("id");
  var ideabox = JSON.parse(localStorage.getItem(key));
  $(this).on("keydown", function(event){
    if(event.key === "Enter")
      event.preventDefault();
      $(this).blur();
  })
  $(this).on("blur", function(){
    ideabox.title = selector.find(".idea-title").text();
    ideabox.idea = selector.find(".idea-body").text();
    localStorage.setItem(key, JSON.stringify(ideabox));
  })
})

function IdeaBox(title, idea, id){
  this.title = title;
  this.idea = idea;
  this.id = id;
  this.quality = "swill";
};

function createIdeaBox(ideabox){
  $(".idea-container").prepend(
    `<section class="idea-card" id="`+ideabox.id+`">
      <button class="delete-btn"></button>
       <p class="idea-title" contenteditable>`+ideabox.title+`</p>
       <p class="idea-body" contenteditable>`+ideabox.idea+`</p>
       <button class="up-vote"></button>
       <button class="down-vote"></button>
       <article>
         <h3>quality:<h3>
         <p class="quality">`+ideabox.quality+`</p>
       </article>
     </section>
    `
  )
}

$("textarea").on("keyup", function(){
  $(this).css("height", $(this)[0].scrollHeight+"px");
})

$(".save-btn").on("click", function(){
  var title = $(".title-input").val();
  var idea = $(".idea-input").val();
  var ideabox = new IdeaBox(title, idea, Date.now());
  var key = ideabox.id;
  localStorage.setItem(key, JSON.stringify(ideabox));
  createIdeaBox(ideabox);
  emptyInput();
  $(".title-input").focus();
})

$(".title-input, .idea-input").on("keydown", function(event){
  if(event.key === "Enter")
    $(".save-btn").click();
})

$(".idea-container").on("click", ".up-vote, .down-vote", function(){
  var ideaCard = $(this).closest(".idea-card");
  var selector = $(this).attr("class");
  var quality = ideaCard.find(".quality");
  var newQuality = getNewQuality(selector, quality.text());
  var key = ideaCard.attr("id");
  var ideabox = JSON.parse(localStorage.getItem(key));
  ideabox.quality = newQuality;
  localStorage.setItem(key, JSON.stringify(ideabox));
  quality.text(newQuality);
})

$(".idea-container").on("click", ".delete-btn", function(){
  var selector = $(this).closest(".idea-card");
  localStorage.removeItem(selector.attr("id"));
  selector.remove();
})



function emptyInput() {
  $(".title-input").val("");
  $(".idea-input").val("");
  $(".idea-input").css("height", "42px");
}

function getNewQuality(selector, quality){
  if(selector === "up-vote"){
    return upVote(quality);
  } else {
    return downVote(quality);
  }
}

function upVote(quality){
  switch (quality) {
    case "swill":
      return "plausible";
    case "plausible":
      return "genius"
  }
}

function downVote(quality){
  switch (quality) {
    case "genius":
      return "plausible";
    case "plausible":
      return "swill"
  }
}
