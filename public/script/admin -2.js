// maintain__sidebar hide list scripts
let prod_create = document.querySelector("#prod_create")
let create_title = document.querySelector("#subtitle1")
let hide__create = document.querySelector("#hide__create")
create_title.addEventListener("click", function(){
    //add pseudo class attribute to hidden list, for css block display
    hide__create.classList.add("subtitle1__show")
    // add pseudo event to title to re-hide the displayed list
    create_title.setAttribute("onClick", 'listOff()')
    
})
//function to hide the dynamic displayed list by removing pseudo attributes
function listOff(){
    //remove pseudo class
    hide__create.classList.remove("subtitle1__show")
    //remove pseudo event
    create_title.removeAttribute("onClick")  
}

// Upload new products
const btn_upload__toCreate = document.querySelector("#upload__toCreate")
btn_upload__toCreate.addEventListener("click", function(){
    let upload__form = document.querySelector("#admin__workpsace")
    upload__form.innerHTML = `
        <form method="post" action="/product-upload-single" enctype="multipart/form-data">
            <div id="form__header">
                <h2>Product Upload Form</h2>
            </div>
            <div id="form__body">
                <div id="form__controls">
                    <div id="product__upload" class="upload__fields">
                        <input type="file" name="uploaded-product" placeholder="upload product imaage here" required>
                    </div>
                    <div id="product__title" class="upload__fields">
                        <input type="text" name="prodtitle" placeholder="product title" required>
                    </div>
                    <select class="upload__fields" name="prodcat" required>
                        <option>Choose Product Category</option>
                        <option>Electronics</option>
                        <option>Fashions</option>   
                        <option>Groceries</option>
                    </select>
                    <div id="product__price" class="upload__fields">
                        <input type="number" name="prodprice" required placeholder="enter product price">
                    </div>
                    <div id="product__qty" class="upload__fields">
                        <input type="number" name="prodqty" required placeholder="enter product quantity">
                    </div>
                    <textarea cols="35%" rows="10" name="proddesc" required autocomplete="on" placeholder="enter a product description">
                    
                    </textarea>
                    <div id="admin__actions" class="upload__fields">
                        <input type="submit" value="Upload" />
                        <input type="reset" value="reset"/>
                    </div>
                </div>
                <div id="form__display">
                    <figure>
                        <img src="" width="100%">
                    </figure>
                </div>
            </div>
        </form>`

        //display image of item to upload for admin to confirm before upload
        const uploadedfile = document.querySelector("#product__upload input")
        uploadedfile.addEventListener("change", function(e){

            $("#form__display>figure>img").attr("src", e.target.files[0].name)
        });
})

//.........VIEW UPLOADED PRODUCTS............//
// get all products from database
getAllProductsfromDatabase()

function getAllProductsfromDatabase(){

    $(function(){
        $.get({
            url:"/product-view-all",
            beforeSend(){
                console.log("retrieving products data from database...");
            },
            success:function(feedback){
                if(feedback.type === "success"){
                    let data = feedback.products__data

                    viewAllProducts(data)
                    // const btn_view__toCreate = document.getElementById("view__toCreate")
                    // btn_view__toCreate.addEventListener("click", function(){
                    //     let admin__space = document.getElementById("admin__workpsace")
                    //     // console.log(admin__space);
                    //     admin__space.innerHTML = `
                    //         <div id="product__shelf">

                    //         </div> `
                    //     let view__shelf = document.querySelector("#product__shelf")

                    //     //MAP FUNCTION
                    //     var card_index = 1
                    //     data.map(function(item){
                    //         var button_index = 0
                    //         view__shelf.innerHTML+= `
                    //             <div id="product__card">
                    //                 <div id="card__image">
                    //                     <figure id="prodimg">
                    //                         <img src="/products/${item.img_name}"/>
                    //                     </figure>
                    //                     <figcaption>
                    //                         <h3> ${item.pdtname} </h3>
                    //                         <p> Quantity In Stock: ${item.prodqty} </p>
                    //                     </figcaption>
                    //                 </div>
                    //                 <div id="card__details">
                    //                     <div id="proddesc">
                    //                         <summary>Description</summary>
                    //                         <p>${item.pdtdesc}</p>
                    //                     </div>
                    //                     <div id="pdtcat">
                    //                         <p>${item.pdtcat}</p>
                    //                     </div>
                    //                     <div id="pdtprice">
                    //                         <p>${item.pdtprice}</p>
                    //                     </div> 

                    //                     <div id="card__buttons" class="${card_index}">
                    //                         <div id="add__buttons" class="icons ${button_index + 1}" title="Add item">
                    //                             <p>Add Item</p>
                    //                             <i id="btn__add" class="fas fa-cart-plus"></i>
                    //                         </div> 
                    //                         <div id="edit__buttons" class="icons ${button_index + 2}" title="Edit item">
                    //                             <p>Edit Item</p>
                    //                             <i id="btn__edit" class="fas fa-edit"></i>
                    //                         </div> 
                    //                         <div id="remove__buttons" class="icons ${button_index + 3}" title="Remove item">
                    //                             <p>Remove Item</p>
                    //                             <i id="btn__remove" class="fas fa-reply"></i>
                    //                         </div> 
                    //                     </div> 

                    //                 </div>
                    //             </div>
                    //         `   
                    //         card_index++   
                    //         button_index++                     
                    //     })  
                    //     // display Add, Edit and Remove Icons text on hover
                    //     $(function(){

                    //         $("#card__buttons i").hover(function(i){
                    //             //get hovered button element parent and grand parent
                    //             var button_parent = $(this).parent().attr("class") 
                    //             var button_grand = $(this).parent().parent().attr("class") 

                    //             //iterate through button labels to get instance
                    //             $(`#card__buttons p`).each(function(j){

                    //                 //get button label (p) element parent and grand parent
                    //                 var txt_parent = $(this).parent().attr("class") 
                    //                 var txt_grand = $(this).parent().parent().attr("class") 

                    //                 //display right label if has same parent and grand as button
                    //                 if(button_grand==txt_grand && button_parent==txt_parent){
                    //                     $(this).css("display","block");
                    //                 }

                    //             })

                    //             //hide all labels on mouse leaving any button
                    //             $(this).mouseleave(function(){
                    //                 $("#card__buttons p").hide()
                    //             });
                                
                    //         })
                            
                    //     })

                    //     //.........CRUD Actions............//
                    //     $("#card__buttons i").click(function(){
                    //         // apply pseudo classes to all target elements
                    //         //---product-card
                    //         $(this).parent().parent().parent().parent().attr("class","clicked_card") 
                    //         //---select the image and related details
                    //         const selected_crudaction = $(this).attr("id")
                    //         const selected_img = $(".clicked_card img" ).attr("src")
                    //         const selected_img_name =  $(".clicked_card figcaption h3" ).html()
                    //         const selected_img_qty =  $(".clicked_card figcaption p" ).html()
                    //         const selected_img_desc =  $(".clicked_card #card__details #proddesc p" ).html()
                    //         const selected_img_cat =  $(".clicked_card  #card__details #pdtcat p" ).html()
                    //         const selected_img_price =  $(".clicked_card  #card__details #pdtprice p" ).html()
                            
                    //         //select relevant dom elements
                    //         let admin__back = document.querySelector("#admin__workpsace")
                    //         const add_page = document.createElement("div");
                    //         add_page.setAttribute("id","overlay")
                    //         admin__back.appendChild(add_page);
                    //         let overlay = document.querySelector("#overlay")

                    //         //Event to remove overlay and its contents
                    //         overlay.addEventListener("click", function(){
                    //             // $("#crudactions__page").hide()
                    //             $("#overlay").hide()
                    //         });
                
                    //         //process selected CRUD operations
                    //         switch (selected_crudaction) {
                    //             case 'btn__add':
                    //                 //display UPDATE CRUD page
                    //                 overlay.innerHTML = `
                    //                 <div id="crudactions__page">
                    //                     <i class="bi bi-x-lg"></i>   
                    //                     <div id="display">
                    //                         <img src="${selected_img}" />
                    //                     </div>

                    //                     <div id="operate">
                    //                         <div id="display_details">
                    //                             <div>
                    //                                 <h2>${selected_img_name}</h2>
                    //                                 <h3>${selected_img_qty}</h3>
                    //                                 <p>${selected_img_desc}</p>
                    //                                 <p>${selected_img_cat}</p>
                    //                                 <p>${selected_img_price}</p>
                    //                             </div>
                    //                         </div>
                    //                         <div = id="display_buttons">
                    //                             <button> UPDATE stock quantity </button>
                    //                         </div>
                    //                     </div>
                                    
                    //                 </div> 
                    //                     `
                    //                 //PUBLISH selected products
                    //                 publishProduct();                        
                    //                 break;
                    //             case 'btn__edit':
                    //                 //display EDIT CRUD page
                    //                 overlay.innerHTML = `
                    //                 <div id="crudactions__page">
                    //                     <i class="bi bi-x-lg"></i>   
                    //                     <div id="display">
                    //                         <img src="${selected_img}" />
                    //                     </div>

                    //                     <div id="operate">
                    //                         <div id="display_details">
                    //                             <div>
                    //                                 <h2>${selected_img_name}</h2>
                    //                                 <h3>${selected_img_qty}</h3>
                    //                                 <p>${selected_img_desc}</p>
                    //                                 <p>${selected_img_cat}</p>
                    //                                 <p>${selected_img_price}</p>
                    //                             </div>
                    //                         </div>
                    //                         <div = id="display_buttons">
                    //                             <button> EDIT item details </button>
                    //                         </div>
                    //                     </div>
                                    
                    //                 </div> 
                    //                     `
                    //                 //EDIT selected products
                    //                 updateEditedProduct();
                    //                 break;
                    //             case 'btn__remove':
                    //                 //display DELETE CRUD page
                    //                 overlay.innerHTML = `
                    //                 <div id="crudactions__page">
                    //                     <div id="display">
                    //                         <i class="bi bi-x-lg"></i>   

                    //                         <img src="${selected_img}" />
                    //                     </div>

                    //                     <div id="operate">
                    //                         <div id="display_details">
                    //                             <div>
                    //                                 <h2>${selected_img_name}</h2>
                    //                                 <h3>${selected_img_qty}</h3>
                    //                                 <p>${selected_img_desc}</p>
                    //                                 <p>${selected_img_cat}</p>
                    //                                 <p>${selected_img_price}</p>
                    //                             </div>
                    //                         </div>
                    //                         <div = id="display_buttons">
                    //                             <button> REMOVE from database </button>
                    //                         </div>
                    //                     </div>
                                    
                    //                 </div> 
                    //                     `
                    //                 //delete selected products
                    //                 removeFromDatabase();
                    //                 break;
                    //             default:
                    //                 console.log(`Sorry, we are out of ${expr}.`);
                    //             }
                                    
                    //     });
                        
                    // })
                    
                }else{
                    console.log("No products found in database...");
                }
            }
        }) 
    })

};
       

function viewAllProducts(data){
    const btn_view__toCreate = document.getElementById("view__toCreate")
    btn_view__toCreate.addEventListener("click", function(){
        let admin__space = document.getElementById("admin__workpsace")
        // console.log(admin__space);
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

        // //.........CRUD Actions............//
        monitorCRUDOptionSelected();

        // $("#card__buttons i").click(function(){
        //     // apply pseudo classes to all target elements
        //     //---product-card
        //     $(this).parent().parent().parent().parent().attr("class","clicked_card") 
        //     //---select the image and related details
        //     const selected_crudaction = $(this).attr("id")
        //     const selected_img = $(".clicked_card img" ).attr("src")
        //     const selected_img_name =  $(".clicked_card figcaption h3" ).html()
        //     const selected_img_qty =  $(".clicked_card figcaption p" ).html()
        //     const selected_img_desc =  $(".clicked_card #card__details #proddesc p" ).html()
        //     const selected_img_cat =  $(".clicked_card  #card__details #pdtcat p" ).html()
        //     const selected_img_price =  $(".clicked_card  #card__details #pdtprice p" ).html()
            
        //     // //select relevant dom elements
        //     getOverlayforCRUDPageDisplay();
        //     // let admin__back = document.querySelector("#admin__workpsace")
        //     // const add_page = document.createElement("div");
        //     // add_page.setAttribute("id","overlay")
        //     // admin__back.appendChild(add_page);
        //     // let overlay = document.querySelector("#overlay")

        //     // //Event to remove overlay and its contents
        //     // overlay.addEventListener("click", function(){
        //     //     // $("#crudactions__page").hide()
        //     //     $("#overlay").hide()
        //     // });

        //     //process selected CRUD operations
        //     selecctCRUDActionToRun(selected_crudaction, selected_img, selected_img_name, selected_img_qty, selected_img_desc, selected_img_cat, selected_img_price);
        //     // switch (selected_crudaction) {
        //     //     case 'btn__add':
        //     //         //display UPDATE CRUD page
        //     //         overlay.innerHTML = `
        //     //         <div id="crudactions__page">
        //     //             <i class="bi bi-x-lg"></i>   
        //     //             <div id="display">
        //     //                 <img src="${selected_img}" />
        //     //             </div>

        //     //             <div id="operate">
        //     //                 <div id="display_details">
        //     //                     <div>
        //     //                         <h2>${selected_img_name}</h2>
        //     //                         <h3>${selected_img_qty}</h3>
        //     //                         <p>${selected_img_desc}</p>
        //     //                         <p>${selected_img_cat}</p>
        //     //                         <p>${selected_img_price}</p>
        //     //                     </div>
        //     //                 </div>
        //     //                 <div = id="display_buttons">
        //     //                     <button> UPDATE stock quantity </button>
        //     //                 </div>
        //     //             </div>
                    
        //     //         </div> 
        //     //             `
        //     //         //PUBLISH selected products
        //     //         publishProduct();                        
        //     //         break;
        //     //     case 'btn__edit':
        //     //         //display EDIT CRUD page
        //     //         overlay.innerHTML = `
        //     //         <div id="crudactions__page">
        //     //             <i class="bi bi-x-lg"></i>   
        //     //             <div id="display">
        //     //                 <img src="${selected_img}" />
        //     //             </div>

        //     //             <div id="operate">
        //     //                 <div id="display_details">
        //     //                     <div>
        //     //                         <h2>${selected_img_name}</h2>
        //     //                         <h3>${selected_img_qty}</h3>
        //     //                         <p>${selected_img_desc}</p>
        //     //                         <p>${selected_img_cat}</p>
        //     //                         <p>${selected_img_price}</p>
        //     //                     </div>
        //     //                 </div>
        //     //                 <div = id="display_buttons">
        //     //                     <button> EDIT item details </button>
        //     //                 </div>
        //     //             </div>
                    
        //     //         </div> 
        //     //             `
        //     //         //EDIT selected products
        //     //         updateEditedProduct();
        //     //         break;
        //     //     case 'btn__remove':
        //     //         //display DELETE CRUD page
        //     //         overlay.innerHTML = `
        //     //         <div id="crudactions__page">
        //     //             <div id="display">
        //     //                 <i class="bi bi-x-lg"></i>   

        //     //                 <img src="${selected_img}" />
        //     //             </div>

        //     //             <div id="operate">
        //     //                 <div id="display_details">
        //     //                     <div>
        //     //                         <h2>${selected_img_name}</h2>
        //     //                         <h3>${selected_img_qty}</h3>
        //     //                         <p>${selected_img_desc}</p>
        //     //                         <p>${selected_img_cat}</p>
        //     //                         <p>${selected_img_price}</p>
        //     //                     </div>
        //     //                 </div>
        //     //                 <div = id="display_buttons">
        //     //                     <button> REMOVE from database </button>
        //     //                 </div>
        //     //             </div>
                    
        //     //         </div> 
        //     //             `
        //     //         //delete selected products
        //     //         removeFromDatabase();
        //     //         break;
        //     //     default:
        //     //         console.log(`Sorry, we are out of ${expr}.`);
        //     //     }
                    
        // });
 
    })
};

function monitorCRUDOptionSelected(){

    $("#card__buttons i").click(function(){
        // apply pseudo classes to all target elements
        const selected_prevId = $(this).attr("id") 
        $(this).attr("id","clickedAction");

        //---product-card
        $(this).parent().parent().parent().parent().attr("class","clicked_card") 
        //---select the image and related details
        const selected_crudaction = $(this).attr("id")
        const selected_img = $(".clicked_card img" ).attr("src")
        const selected_img_name =  $(".clicked_card figcaption h3" ).html()
        const selected_img_qty =  $(".clicked_card figcaption p" ).html()
        const selected_img_desc =  $(".clicked_card #card__details #proddesc p" ).html()
        const selected_img_cat =  $(".clicked_card  #card__details #pdtcat p" ).html()
        const selected_img_price =  $(".clicked_card  #card__details #pdtprice p" ).html()

        console.log($(".clicked_card" ),selected_crudaction, selected_prevId);
        
        // //select relevant dom elements
        // getOverlayforCRUDPageDisplay();
           //select relevant dom elements
        let admin__back = document.querySelector("#admin__workpsace")
        const add_page = document.createElement("div");
        add_page.setAttribute("id","overlay");
        add_page.setAttribute("onClick","toggleOverlay()");

        admin__back.appendChild(add_page);
        let overlay = document.querySelector("#overlay");

        //process selected CRUD operations

        // selecctCRUDActionToRun(overlay, selected_crudaction, selected_img, selected_img_name, selected_img_qty, selected_img_desc, selected_img_cat, selected_img_price);

        if (selected_crudaction === 'clickedAction'&& selected_prevId ==='btn__add' ) {
            //display UPDATE CRUD page
            overlay.innerHTML = `
            <div id="crudactions__page">
                <i class="bi bi-x-lg"></i>   
                <div id="display">
                    <img src="${selected_img}" />
                </div>

                <div id="operate">
                    <div id="display_details">
                        <div>
                            <h2>${selected_img_name}</h2>
                            <h3>${selected_img_qty}</h3>
                            <p>${selected_img_desc}</p>
                            <p>${selected_img_cat}</p>
                            <p>${selected_img_price}</p>
                        </div>
                    </div>
                    <div id="display_buttons">
                        <button onClick="publishProduct()"> UPDATE stock quantity </button>
                    </div>
                </div>
            
            </div> 
                `
    }

    if(selected_crudaction === 'clickedAction'&& selected_prevId ==='btn__edit'){
            //display EDIT CRUD page
            overlay.innerHTML = `
            <div id="crudactions__page">
                <i class="bi bi-x-lg"></i>   
                <div id="display">
                    <img src="${selected_img}" />
                </div>

                <div id="operate">
                    <div id="display_details">
                        <div>
                            <h2>${selected_img_name}</h2>
                            <h3>${selected_img_qty}</h3>
                            <p>${selected_img_desc}</p>
                            <p>${selected_img_cat}</p>
                            <p>${selected_img_price}</p>
                        </div>
                    </div>
                    <div id="display_buttons">
                        <button onClick="updateItemDetails()"> EDIT item details </button>
                    </div>
                </div>
            </div> 
                `
    } 

    if(selected_crudaction === 'clickedAction'&& selected_prevId ==='btn__remove'){
            //display DELETE CRUD page
            overlay.innerHTML = `
            <div id="crudactions__page">
                <div id="display">
                    <i class="bi bi-x-lg"></i>   

                    <img src="${selected_img}" />
                </div>

                <div id="operate">
                    <div id="display_details">
                        <div>
                            <h2>${selected_img_name}</h2>
                            <h3>${selected_img_qty}</h3>
                            <p>${selected_img_desc}</p>
                            <p>${selected_img_cat}</p>
                            <p>${selected_img_price}</p>
                        </div>
                    </div>
                    <div id="display_buttons">
                        <button onClick="removeFromDatabase()"> REMOVE from database </button>
                    </div>
                </div>
    
            </div> 
                `
    }
        
    });
};

function toggleOverlay(){
    $("#overlay").click(function(){
    //    console.log($("#overlay")); 
        $("#overlay").hide()
    });
}
// function getOverlayforCRUDPageDisplay(){



// function selecctCRUDActionToRun(overlay,selected_crudaction, selected_img, selected_img_name, selected_img_qty, selected_img_desc, selected_img_cat, selected_img_price){

//     if (selected_crudaction === 'btn__add') {
//             //display UPDATE CRUD page
//             overlay.innerHTML = `
//             <div id="crudactions__page">
//                 <i class="bi bi-x-lg"></i>   
//                 <div id="display">
//                     <img src="${selected_img}" />
//                 </div>

//                 <div id="operate">
//                     <div id="display_details">
//                         <div>
//                             <h2>${selected_img_name}</h2>
//                             <h3>${selected_img_qty}</h3>
//                             <p>${selected_img_desc}</p>
//                             <p>${selected_img_cat}</p>
//                             <p>${selected_img_price}</p>
//                         </div>
//                     </div>
//                     <div id="display_buttons">
//                         <button onClick="publishProduct()"> UPDATE stock quantity </button>
//                     </div>
//                 </div>
            
//             </div> 
//                 `
//     }

//     if(selected_crudaction === 'btn__edit'){
//             //display EDIT CRUD page
//             overlay.innerHTML = `
//             <div id="crudactions__page">
//                 <i class="bi bi-x-lg"></i>   
//                 <div id="display">
//                     <img src="${selected_img}" />
//                 </div>

//                 <div id="operate">
//                     <div id="display_details">
//                         <div>
//                             <h2>${selected_img_name}</h2>
//                             <h3>${selected_img_qty}</h3>
//                             <p>${selected_img_desc}</p>
//                             <p>${selected_img_cat}</p>
//                             <p>${selected_img_price}</p>
//                         </div>
//                     </div>
//                     <div id="display_buttons">
//                         <button onClick="updateItemDetails()"> EDIT item details </button>
//                     </div>
//                 </div>
//             </div> 
//                 `
//     } 

//     if(selected_crudaction === 'btn__remove'){
//             //display DELETE CRUD page
//             overlay.innerHTML = `
//             <div id="crudactions__page">
//                 <div id="display">
//                     <i class="bi bi-x-lg"></i>   

//                     <img src="${selected_img}" />
//                 </div>

//                 <div id="operate">
//                     <div id="display_details">
//                         <div>
//                             <h2>${selected_img_name}</h2>
//                             <h3>${selected_img_qty}</h3>
//                             <p>${selected_img_desc}</p>
//                             <p>${selected_img_cat}</p>
//                             <p>${selected_img_price}</p>
//                         </div>
//                     </div>
//                     <div id="display_buttons">
//                         <button onClick="removeFromDatabase()"> REMOVE from database </button>
//                     </div>
//                 </div>
            
//             </div> 
//                 `
//     }
// };

//DELETE CRUD
function removeFromDatabase(){
    console.log("place delete operations codes here");
};

//UPDATE CRUD
function updateItemDetails(){

};

//PUBLISH Item
function publishProduct(){

};
// once the page has loaded, get all the products
// getAllProducts();


// function getAllProducts(){

//     $.get({
//         url: "/product-view-all", 
//         beforeSend(){
//             console.log("Getting the products ...")
//         }, 
//         success: function(feedback){
//             //console.log("Productsb results: ", feedback)
//             let products = [];
//             if(feedback.type === "success"){
//                 products = feedback.products__data;
//             }else{
//                 // there are no products
//             }

//             console.log("Products: ", products)

//             // display the products on the page 
//             let workspace = document.querySelector("#admin__workspace");


//             let table_code = `<table>
//                                     <thead>
//                                         <th>ID</th>
//                                         <th></th>
//                                         <th>Product name</th>
//                                         <th>Product category</th>
//                                         <th>Product description</th>
//                                         <th>Price(NGN)</th>
//                                         <th>Manage</th>
//                                     </thead>
//                                 <tbody>`;
                                
//                                 for(let i = 0; i < products.length; i++){

//                                     table_code += `<tr>
//                                                         <td>${products[i]._id}</td>
//                                                         <td><img src='/products/${products[i].img_name}' width=25></td>
//                                                         <td>${products[i].pdtname}</td>
//                                                         <td>${products[i].pdtcat}</td>
//                                                         <td>${products[i].pdtdesc}</td>
//                                                         <td>${products[i].pdtprice}</td>
//                                                         <td><a href=''>Manage this product</a></td>
//                                                     </tr>`;

//                                 }



//                                 table_code +=`</tbody>
            
//                             </table>`;

//             add to workspace
//             workspace.innerHTML += table_code;

//         }
//     })