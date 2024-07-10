// $(function(){
$.ajax({
    url: "/shopfloor-all",
    type: "GET",
    dataType: "json",
    success: function(feedback){
        // alert(JSON.stringify(data));

        if(feedback.type === "success"){
            let data = feedback.products__data
            console.log(data);

            // const btn_view__toCreate = document.getElementById("view__toCreate")
            // btn_view__toCreate.addEventListener("click", function(){
                let admin__space = document.getElementById("users__shopfloor")
                console.log(admin__space);
                admin__space.innerHTML = `
                    <div id="product__shelf">

                    </div> `
                let view__shelf = document.querySelector("#product__shelf")

                //MAP FUNCTION
                var card_index = 1
                data.map(function(item){
                    var button_index = 0
                    view__shelf.innerHTML+= `
                        <div id="product__card">
                            <div id="card__image">
                                <figure id="prodimg">
                                    <img src="/products/${item.img_name}"/>
                                </figure>
                                <figcaption>
                                    <h3> ${item.pdtname} </h3>
                                    <p> Quantity In Stock: ${item.prodqty} </p>
                                </figcaption>
                            </div>
                            <div id="card__details">
                                <div id="proddesc">
                                    <summary>Description</summary>
                                    <p>${item.pdtdesc}</p>
                                </div>
                                <div id="pdtcat">
                                    <p>${item.pdtcat}</p>
                                </div>
                                <div id="pdtprice">
                                    <p>${item.pdtprice}</p>
                                </div> 

                                <div id="card__buttons" class="${card_index}">
                                    <div id="add__buttons" class="icons ${button_index + 1}" title="Add item">
                                        <p>Add Item</p>
                                        <i id="btn__add" class="fas fa-cart-plus"></i>
                                    </div> 
                                    <div id="edit__buttons" class="icons ${button_index + 2}" title="Edit item">
                                        <p>Edit Item</p>
                                        <i id="btn__edit" class="fas fa-edit"></i>
                                    </div> 
                                    <div id="remove__buttons" class="icons ${button_index + 3}" title="Remove item">
                                        <p>Remove Item</p>
                                        <i id="btn__remove" class="fas fa-reply"></i>
                                    </div> 
                                </div> 

                            </div>
                        </div>
                    `   
                    card_index++   
                    button_index++                     
                })  
                // display Add, Edit and Remove Icons text on hover
                $(function(){

                    $("#card__buttons i").hover(function(i){
                        //get hovered button element parent and grand parent
                        var button_parent = $(this).parent().attr("class") 
                        var button_grand = $(this).parent().parent().attr("class") 

                        //iterate through button labels to get instance
                        $(`#card__buttons p`).each(function(j){

                            //get button label (p) element parent and grand parent
                            var txt_parent = $(this).parent().attr("class") 
                            var txt_grand = $(this).parent().parent().attr("class") 

                            //display right label if has same parent and grand as button
                            if(button_grand==txt_grand && button_parent==txt_parent){
                                $(this).css("display","block");
                            }

                        })

                        //hide all labels on mouse leaving any button
                        $(this).mouseleave(function(){
                            $("#card__buttons p").hide()
                        });
                        
                    })
                    
                })

                //.........ADD ITEMS TO PRODUCTS............//
                $("#card__buttons i").click(function(){
                    let admin__back = document.querySelector("#admin__workpsace")
                    const add_page = document.createElement("div");
                    add_page.setAttribute("id","overlay")
                    admin__back.appendChild(add_page);
                    let overlay = document.querySelector("#overlay")

                    overlay.innerHTML = `
                        <div id="additem__page">
                        
                        </div> 
                        `
                    let view__shelf = document.querySelector("#product__shelf")
                });
            // })
            
        }else{
            console.log("No products found in database...");
        }
    } 
  });

    
// })