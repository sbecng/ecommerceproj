// Concept of jquery is DOM manipulation

console.log($("#container")); //how to target any element in jquery
console.log($("#heading").text()); //attribute
console.log(jQuery("#heading").text()); //attribute
console.log(jQuery("#heading").css({"color": "red", "border": ".2rem solid green" })); //attribute
// console.log(jQuery("#heading").css({"color": "red", "border": ".2rem solid green" }).hide()); //attribute

///////functional methods
// .html()
// .slideIn()
// 'toggle()
// .animate()
// .css()
// .slideShow()
// .show()
// .hide()
// .fade()

//Event handling
$("#btn").on("click", function(){
    $("#heading").hide()
    $("btn").text("show")
})

//Ajax demo 
//.on() is a function method and event listener
$("#loader").on("click", function(){
    $.ajax({
        type: "GET", 
        url:"/home",
        success: function(data){
            console.log(data);
            $("#reg").html(data) //loads another html page to another
        },
        beforeSend(){
            alert("loading...")
        },
        error(){

        }
    })
})