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
        <form method="post" action="/product-upload-single" enctype="multipart/form-data" id='form_productupload'>
            <div id="form__header">
                <h2>Product Upload Form</h2>
            </div>
            <div id="form__body">
                <div id="form__controls">
                    <div id="product__upload" class="upload__fields">
                        <input type="file" name="uploaded-product" placeholder="upload product imaage here" required>
                    </div>
                    <div id="product__title" class="upload__fields">
                        <input type="text" value='' name="prodtitle" placeholder="product title" required>
                    </div>
                    <select id='select_uploadCat' class="upload__fields" value='' name="prodcat" required>
                        <option>Choose Product Category</option>

                    </select>
                    <div id="product__price" class="upload__fields">
                        <input type="number" value='' name="prodprice" required placeholder="enter product price">
                    </div>
                    <div id="product__qty" class="upload__fields">
                        <input type="number" value='' name="prodqty" required placeholder="enter product quantity">
                    </div>
                    <textarea cols="35%" rows="10" value='' name="proddesc" required autocomplete="on" placeholder="enter a product description">
                    
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
/////////////////////////////////////////////////////////////////////
getAllProducts()

function getAllProducts(){
    $.get({
        url:"/product-view-all",
        beforeSend(){
            console.log("retrieving products data from database...");
        },
        success:function(feedback){
            
            if(feedback.type === "success"){
                let data = feedback.products__data
                let admin__space = document.getElementById("admin__workpsace")
                // console.log(admin__space);
                admin__space.innerHTML = `
                    <div id="product__shelf">

                    </div> `
                let view__shelf = document.querySelector("#product__shelf")

                //MAP FUNCTION
                var card_index = 1
                var displayimage = "";                

                data.map(function(item){
                    var button_index = 0
                    // determine display image source
                    if(!item.cloudinary_id){
                        displayimage ='/products/'+ item.img_name + "'";

                    }else{
                        displayimage = item.cloudinary_image;
                    }

                    view__shelf.innerHTML+= `
                    <div id="product__card">
                        <div id="card__image">
                            <figure id="prodimg">
                                <img src='${displayimage}'/>
                            </figure>
                            <figcaption>
                                <h3> ${item.pdtname} </h3>
                                <p>Quantity In Stock: </p>
                                <p> ${item.prodqty} </p>
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

                            <div id="card__buttons" class="${card_index}" name="${item._id}">
                                <div id="add__buttons" class="icons ${button_index + 1}" title="Upload item">
                                    <p>Upload New Image</p>
                                    <i id="btn__add" class="fas fa-cloud-upload-alt"></i>
                                </div> 
                                <div id="edit__buttons" class="icons ${button_index + 2}" title="Edit item" >
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

                $("#card__buttons i").click(function(){
                    // apply pseudo classes to all target elements
            
                    //---product-card
                    $(this).parent().parent().parent().parent().attr("class","clicked_card") 
                    const selected_item_id =  $(this).parent().parent().attr("name")
            
                    //---select the image and related details
                    const selected_crudaction = $(this).attr("id")
                    const selected_img = $(".clicked_card img").attr("src")
                    const selected_img_name =  $(".clicked_card figcaption h3" ).html()
                    const selected_img_qty =  $(".clicked_card figcaption > p:first-of-type + p").html()
                    const selected_img_desc =  $(".clicked_card #card__details #proddesc p:first-of-type").html()
                    const selected_img_cat =  $(".clicked_card  #card__details #pdtcat p" ).html()
                    const selected_img_price =  $(".clicked_card  #card__details #pdtprice p" ).html()
                    
                    //store item id to delete in cookie
                    document.cookie = `delItem_id=${selected_img_name}; SameSite=None;  path=/product-delete;Secure`;  
                    //store item to edit in cookie
                    document.cookie = `editedProductId=ObjectId('${selected_item_id}'); SameSite=None;  path=/admin-editproduct;Secure`;  
                    document.cookie = `editedProduct=${selected_img_name}; SameSite=None;  path=/admin-editproduct;Secure`;  
            
                    // //select relevant dom elements
            
                    let admin__back = document.querySelector("#admin__workpsace")
                    const add_page = document.createElement("div");
                    add_page.setAttribute("id","overlay");
                    add_page.setAttribute("onClick","toggleOverlay()");
                    const content_page = document.createElement("div");
                    content_page.setAttribute("id","contentpage");
            
                    admin__back.appendChild(add_page);
                    admin__back.appendChild(content_page);
            
                    let overlay = document.querySelector("#overlay");
                    let contentpage = document.querySelector("#contentpage");
                    
                    //process selected CRUD operations
                    selecctCRUDActionToRun(contentpage,selected_item_id,overlay, selected_crudaction, selected_img, selected_img_name, selected_img_qty, selected_img_desc, selected_img_cat, selected_img_price);
                    
                    
                    // $("#overlay").click(function(){
                    //     $("#contentpage").hide()
                    //     $(this).hide()
                    // });
            
                });

            }else{
                console.log("No products found in database...");
            }
        }
    }) 
}
////////////////////////////////////////////////////////////////

// get all products from database
// getAllProductsfromDatabase()

// function getAllProductsfromDatabase(){

//     $(function(){
//         $.get({
//             url:"/product-view-all",
//             beforeSend(){
//                 console.log("retrieving products data from database...");
//             },
//             success:function(feedback){
//                 if(feedback.type === "success"){
//                     let data = feedback.products__data

//                     viewAllProducts(data)

//                 }else{
//                     console.log("No products found in database...");
//                 }
//             }
//         }) 
//     })

// };
       

// function viewAllProducts(data){
//     const btn_view__toCreate = document.getElementById("view__toCreate")
//     btn_view__toCreate.addEventListener("click", function(){

//         getAllProducts()


        // let admin__space = document.getElementById("admin__workpsace")
        // // console.log(admin__space);
        // admin__space.innerHTML = `
        //     <div id="product__shelf">

        //     </div> `
        // let view__shelf = document.querySelector("#product__shelf")

        // //MAP FUNCTION
        // var card_index = 1
        // data.map(function(item){
        //     var button_index = 0
        //     view__shelf.innerHTML+= `
        //     <div id="product__card">
        //         <div id="card__image">
        //             <figure id="prodimg">
        //                 <img src="/products/${item.img_name}"/>
        //             </figure>
        //             <figcaption>
        //                 <h3> ${item.pdtname} </h3>
        //                 <p> Quantity In Stock: ${item.prodqty} </p>
        //             </figcaption>
        //         </div>
        //         <div id="card__details">
        //             <div id="proddesc">
        //                 <summary>Description</summary>
        //                 <p>${item.pdtdesc}</p>
        //             </div>
        //             <div id="pdtcat">
        //                 <p>${item.pdtcat}</p>
        //             </div>
        //             <div id="pdtprice">
        //                 <p>${item.pdtprice}</p>
        //             </div> 

        //             <div id="card__buttons" class="${card_index}" name="${item._id}">
        //                 <div id="add__buttons" class="icons ${button_index + 1}" title="Add item">
        //                     <p>Add Item</p>
        //                     <i id="btn__add" class="fas fa-cloud-upload-alt"></i>
        //                 </div> 
        //                 <div id="edit__buttons" class="icons ${button_index + 2}" title="Edit item">
        //                     <p>Edit Item</p>
        //                     <i id="btn__edit" class="fas fa-edit"></i>
        //                 </div> 
        //                 <div id="remove__buttons" class="icons ${button_index + 3}" title="Remove item">
        //                     <p>Remove Item</p>
        //                     <i id="btn__remove" class="fas fa-reply"></i>
        //                 </div> 
        //             </div> 

        //         </div>
        //     </div>
        //     `   
        //     card_index++   
        //     button_index++  
            
        // })  
        
        // // display Add, Edit and Remove Icons text on hover

        // $(function(){

        //     $("#card__buttons i").hover(function(i){
        //         //get hovered button element parent and grand parent
        //         var button_parent = $(this).parent().attr("class") 
        //         var button_grand = $(this).parent().parent().attr("class") 

        //         //iterate through button labels to get instance
        //         $(`#card__buttons p`).each(function(j){

        //             //get button label (p) element parent and grand parent
        //             var txt_parent = $(this).parent().attr("class") 
        //             var txt_grand = $(this).parent().parent().attr("class") 

        //             //display right label if has same parent and grand as button
        //             if(button_grand==txt_grand && button_parent==txt_parent){
        //                 $(this).css("display","block");
        //             }

        //         })

        //         //hide all labels on mouse leaving any button
        //         $(this).mouseleave(function(){
        //             $("#card__buttons p").hide()
        //         });
                
        //     })
            
        // })

        // // //.........CRUD Actions............//
        // monitorCRUDOptionSelected(data);

//     })
// };


// function monitorCRUDOptionSelected(data){

//     $("#card__buttons i").click(function(){
//         // apply pseudo classes to all target elements

//         //---product-card
//         $(this).parent().parent().parent().parent().attr("class","clicked_card") 
//         const selected_item_id =  $(this).parent().parent().attr("name")

//         //---select the image and related details
//         const selected_crudaction = $(this).attr("id")
//         const selected_img = $(".clicked_card img").attr("src")
//         const selected_img_name =  $(".clicked_card figcaption h3" ).html()
//         const selected_img_qty =  $(".clicked_card figcaption p" ).html()
//         const selected_img_desc =  $(".clicked_card #card__details #proddesc p" ).html()
//         const selected_img_cat =  $(".clicked_card  #card__details #pdtcat p" ).html()
//         const selected_img_price =  $(".clicked_card  #card__details #pdtprice p" ).html()
        
//         //store item id to delete in cookie
//         document.cookie = `delItem_id=${selected_img_name}; SameSite=None;  path=/admin/delete;Secure`;  
//         //store item to edit in cookie
//         const img_name = selected_img.trim()
//         const pdtname = selected_img_name.trim()
//         const pdtcat = selected_img_cat.trim()
//         const pdtdesc = selected_img_desc.trim()
//         const pdtprice = selected_img_price.trim()
//         const prodqty = selected_img_qty.trim()
        
//         const edited_product = {
//             img_name:img_name,
//             pdtname:pdtname,
//             pdtcat:pdtcat,
//             pdtdesc:pdtdesc,
//             pdtprice:pdtprice,
//             prodqty:prodqty
//         };
//         document.cookie = `editedProduct=${edited_product}; SameSite=None;  path=/admin/edit;Secure`;  

//         console.log(edited_product);
//         // //select relevant dom elements

//         let admin__back = document.querySelector("#admin__workpsace")
//         const add_page = document.createElement("div");
//         add_page.setAttribute("id","overlay");
//         add_page.setAttribute("onClick","toggleOverlay()");
//         const content_page = document.createElement("div");
//         content_page.setAttribute("id","contentpage");

//         admin__back.appendChild(add_page);
//         admin__back.appendChild(content_page);

//         let overlay = document.querySelector("#overlay");
//         let contentpage = document.querySelector("#contentpage");
        
//         //process selected CRUD operations
//         selecctCRUDActionToRun(contentpage,selected_item_id,overlay, selected_crudaction, selected_img, selected_img_name, selected_img_qty, selected_img_desc, selected_img_cat, selected_img_price);
        
        
//         // $("#overlay").click(function(){
//         //     $("#contentpage").hide()
//         //     $(this).hide()
//         // });

//     });
// };

function toggleOverlay(){
    if ($("#overlay").show()){
        location.reload()
        $("#contentpage").hide()
        $("#overlay").hide()
    }
}

function selecctCRUDActionToRun(contentpage,selected_item_id,overlay,selected_crudaction, selected_img, selected_img_name, selected_img_qty, selected_img_desc, selected_img_cat, selected_img_price){
    
    //display UPDATE CRUD page
    if (selected_crudaction === 'btn__add') {
        $.get({
            url:"/admin-editproduct",
            beforeSend(){
                console.log("retrieving product to update...");
            },
            success:function(feedback){

                console.log('get call feedback ',feedback);
                

                let contentpage = document.querySelector("#contentpage");

                contentpage.innerHTML = `
                <div id="display">
                    <img src="${selected_img}"/>
                </div>

                <form method="post" action="/product-image-replace" enctype="multipart/form-data" name="form_imeageReplace">

                    <div id="form__header">
                        <h2>${feedback.pdtname}'s Image Replacement</h2>
                    </div>
                    <div id="form__body">
                        <div id="form__controls">

                            <div id="product__upload" class="upload__fields">
                                <input type="hidden" name="pdtname" value='${feedback.pdtname}'>
                                <input type="file" name="newImage__upload" placeholder="upload product imaage here" required>
                            </div>
        
                        </div>
        
                        <div id="admin__actions" >
                            <div class="form_buttons">

                               <input type="submit" id="updateSubmit_btn"  value="Replace Product Image" />
                               <input type="reset" value="Reset"/>

                            </div>
                        </div>
        
                    </div>
                </form> `
            }
        })
    }
    
    //display EDIT CRUD page
    if(selected_crudaction === 'btn__edit'){
        // Ajax call to find item to update from database
        $.get({
            url:"/admin-editproduct",
            beforeSend(){
                console.log("retrieving product to update...");
            },
            success:function(feedback){

                console.log('get call feedback ',feedback);
                

                let contentpage = document.querySelector("#contentpage");

                contentpage.innerHTML = `
                <div id="display">
                    <img src="${selected_img}"/>
                </div>

                <form method="POST" action="/admin-editproduct-update" id='form_forProductupdate'>

                    <div id="form__header">
                        <h2>Product Update Form</h2>
                    </div>
                    <div id="form__body">
                        <div id="form__controls">
        
                            <div id="product__title" class="upload__fields">
                                <input type="text" value="${feedback.pdtname}" name="prodtitle" placeholder="product title" required>
                            </div>
        
                            <select id="product__cat" class="upload__fields" value="${feedback.pdtcat}" name="prodcat" onClick='form_updateCat_List()' required>
                                <option>${feedback.pdtcat}</option>

                            </select>
        
                            <label>Describe the product below...</label>
                            <textarea id="product__desc" cols="" rows="10" value="${feedback.pdtdesc}" name="proddesc" class="upload__fields" required autocomplete="on" placeholder="enter a product description">
                            </textarea>
        
                            <div id="product__price" class="upload__fields">
                                <input type="number" value="${feedback.pdtprice}" name="prodprice" required placeholder="enter product price">
                            </div>
        
                            <div id="product__qty" class="upload__fields">
                                <input type="number" value="${feedback.prodqty}" name="prodqty" required placeholder="enter product quantity">
                            </div>
        
                        </div>
        
                        <div id="admin__actions" >
                            <div class="form_buttons">

                               <input type="submit" id="updateSubmit_btn"  name="${feedback.pdtname}" value="Update" />
                               <input type="reset" value="Reset"/>

                            </div>
                        </div>
        
                    </div>
                </form> `
            }
        })
        // onClick="editAProduct()"
        // function editAProduct(){
        //     const pdtId = $("#updateSubmit_btn").attr("name")
        //     // AJAX UPDATE call
        //     $.ajax({
        //         url:"/admin-editproduct",
        //         type:"put",
        //         data:{pdtname:pdtId, action:'fetch-single'},
        //         datatype:"JSON",
        //         success:function(feedback){

        //             if(feedback.type === "success"){
        //                 // let feedback_toEdit = feedback.product_toEdit;
        //                 // let contentpage = document.querySelector("#contentpage");
        //                 // contentpage.innerHTML = `
        //                 // <div id="display">
        //                 //     <img src="${selected_img}"/>
        //                 // </div>
        //                 // <form method="PUT" action="/admin-editproduct" enctype="multipart/form-data">
        //                 //     <div id="form__header">
        //                 //         <h2>Product Update Form</h2>
        //                 //     </div>
        //                 //     <div id="form__body">
        //                 //         <div id="form__controls">
        //                 //             <div id="product__upload" class="upload__fields">
        //                 //                 <input type="file" value=${selected_img} name="uploaded-product" placeholder="upload product imaage here" required>
        //                 //             </div>
                
        //                 //             <div id="product__title" class="upload__fields">
        //                 //                 <input type="text" value=${selected_img_name} name="prodtitle" placeholder="product title" required>
        //                 //             </div>
                
        //                 //             <select class="upload__fields" value=${selected_img_cat} name="prodcat" required>
        //                 //                 <option>${selected_img_cat}</option>
        //                 //                 <option>Electronics</option>
        //                 //                 <option>Fashions</option>   
        //                 //                 <option>Groceries</option>
        //                 //             </select>
                
        //                 //             <label>Describe the product below...</label>
        //                 //             <textarea cols="" rows="10" value=${selected_img_desc} name="proddesc" class="upload__fields" required autocomplete="on" placeholder="enter a product description">
        //                 //             </textarea>
                
        //                 //             <div id="product__price" class="upload__fields">
        //                 //                 <input type="number" value=${selected_img_price} name="prodprice" required placeholder="enter product price">
        //                 //             </div>
                
        //                 //             <div id="product__qty" class="upload__fields">
        //                 //                 <input type="number" value=${selected_img_qty} name="prodqty" required placeholder="enter product quantity">
        //                 //             </div>
                
        //                 //         </div>
                
        //                 //         <div id="admin__actions" >
        //                 //             <div class="form_buttons">
        //                 //                 <input type="submit" id="updateSubmit_btn" onClick="editAProduct()" name="${selected_img_name}" value="Update" />
        //                 //                 <input type="reset" value="Reset"/>
        //                 //             </div>
        //                 //         </div>
                
        //                 //     </div>
        //                 // </form> `
        //             }

        //         }
        //     })
        // }

    } 

    //display DELETE CRUD page
    if(selected_crudaction === 'btn__remove'){
        contentpage.innerHTML = `
        <form id="crudactions__page" action="/product-delete" method="GET" enctype="multipart/form-data">
            <i class="close_dispay" onClick="toggleOverlay()">&times</i>      
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
                        <p>${selected_item_id}</p>
                    </div>
                </div>
                <div id="display_buttons">
                    <button type="submit" name="removeid" onClick="setCookie()"> REMOVE from database </button>
                </div>
            </div>
        
        </form> 
            `   
    }

};

// MANAGE CATEGORIES 
function createNewCategory(){
            
    let admin__back = document.querySelector("#admin__workpsace")
    const add_page = document.createElement("div");
    add_page.setAttribute("id","overlay");
    add_page.setAttribute("onClick","toggleOverlay()");
    const content_page = document.createElement("div");
    content_page.setAttribute("id","contentpage");

    admin__back.appendChild(add_page);
    admin__back.appendChild(content_page);

    let overlay = document.querySelector("#overlay");
    let contentpage = document.querySelector("#contentpage");

    contentpage.innerHTML = `
    <form method="post" action="/admin-manage-categories" id="form-newCat">
        <div id="form__header">
            <h2>Manage Product Categories</h2>
        </div>
        <div id="form__body">
            <div id="form__controls">

                <label>EXISTING CATEGORIES</label>
                <div id="editCat" class="manage_catFields upload__fields">
                    <select id="oldCat" class="upload__fields catFields" name="cat_exist" value='' onchange="ediACategory()">
                        <option></option>
                        <option>Electronics</option>
                        <option>Fashions</option>   
                        <option>Groceries</option>
                    </select>
                </div>

                <label>NEW CATEGORIES</label>
                <div id="editCat" class="manage_catFields upload__fields">
                    <div id="catDesc" class="upload__fields catFields">
                        <input type="hidden" id='catID'  name="cat_Id">

                        <input type="text" id='newCat' value='' name="cat_name" required placeholder="enter category's name">
                        
                        <label>short description here...</label>
                        <input type="text" id='newCatDesc' value='' name="cat_desc" required placeholder="short description here...">
                    </div>
                </div>
                <div id="admin__actions" class="upload__fields">
                    <input type="reset" value="Reset" name="catBtns"/>
                    <input type="submit" value="Create/Update" name="catBtns"/>

                </div>
            </div>

        </div>
    </form>`
}

function ediACategory(){
    const oldCat = document.getElementById('catId');
    const newtCat = document.getElementById('newCat');
    const newtCatDesc = document.getElementById('newCatDesc');
    newtCat.value = oldCat.value;
    newtCatDesc.value = oldCat.value;
}

// Populate product categories from server to sidebar

$('#admin__sidebar').ready(function(){
    
    const categories_ul = document.getElementById('view__list');

    $.get({
        url:"/admin-manage-categories",
        beforeSend(){
            console.log("retrieving product categories...");
        },
        success:function(category_array){

            category_array.map(function(item){

                // create a new li item
                let li_name = item.catName
                let categories_ul_li = document.createElement('li');
                let categories_ul_li_a = document.createElement('a');
                categories_ul_li.setAttribute('class','all_sidebar_lists li_viewlist');
                // append new li item to ul container
                categories_ul.appendChild(categories_ul_li);
                // append new anchor item to li container
                categories_ul_li.appendChild(categories_ul_li_a);
                categories_ul_li_a.innerHTML=(li_name);
                categories_ul_li_a.setAttribute('onClick','getAllProductsbyCategory()')

            })
        }
        
    })

});

// Populate product categories from database to uploadform
function form_uploadCat_List(){
    $('#form_productupload').ready(function(){

        const select_uploadCat = document.getElementById('select_uploadCat');
    
        $.get({
            url:"/admin-manage-categories",
            beforeSend(){
                console.log("retrieving product categories...");
            },
            success:function(category_array){
    
                category_array.map(function(item){
    
                    // create a new li item
                    let li_name = item.catName
                    let select_uploadCat_option = document.createElement('option');
                    select_uploadCat.appendChild(select_uploadCat_option);
                    select_uploadCat_option.innerHTML=(li_name);
    
                })
            }
            
        })
    
    });
};

// Populate product categories from database to updateform
function form_updateCat_List(){
    
    $('#contentpage #form_forProductupdate #product__cat').ready(function(){
        
        console.log($('#contentpage #form_forProductupdate #product__cat'));

        const select_updateCat = document.querySelector('#contentpage #form_forProductupdate #product__cat');

        $.get({
            url:"/admin-manage-categories",
            beforeSend(){
                console.log("retrieving product categories...");
            },
            success:function(category_array){
    
                category_array.map(function(item){
    
                    // create a new li item
                    let li_name = item.catName
                    let select_updateCat_option = document.createElement('option');
                    select_updateCat.appendChild(select_updateCat_option);
                    select_updateCat_option.innerHTML=(li_name);

                    console.log(select_updateCat);
    
                })
            }
            
        })
    
    });
};

function getAllProductsbyCategory(){
    $(function(){

        $('.li_viewlist a').click(function(){
            $(this).attr('id','clicked_category');
            let selectedCat = $(this).html();
            
            //store item to edit in query
            // var xhttp = new XMLHttpRequest();
            // xhttp.onreadystatechange = function() {
            //   if (this.readyState == 4 && this.status == 200) {
            //     $(this).attr('id','clicked_category');
            //     let selectedCat = $(this).html();
            //   }
            // };
            // xhttp.open("GET", "/product-view-all?pdtcat=" + selectedCat , true);
            // xhttp.send();
    
            // console.log('products__data ',products__data);



            $.get({
                url:"/admin-viewby-category?" + selectedCat,
                beforeSend(){
                    console.log("retrieving product by category...");
                },
                datatype:JSON,
                data:{pdtcat:selectedCat},
                success:function(feedback){
    
    
                    console.log('getAllProductsbyCategory ',selectedCat);

                    if(feedback.type === "success"){
                        let data = feedback.feedback
                        
                        console.log('feedback ', data);

                        let admin__space = document.getElementById("admin__workpsace")
                        // console.log(admin__space);
                        admin__space.innerHTML = `
                            <div id="product__shelf">
        
                            </div> `
                        let view__shelf = document.querySelector("#product__shelf")
        
                        //MAP FUNCTION
                        var card_index = 1
                        var displayimage = "";                
        
                        data.map(function(item){
                            var button_index = 0
                            // determine display image source
                            if(!item.cloudinary_id){
                                displayimage ='/products/'+ item.img_name + "'";
        
                            }else{
                                displayimage = item.cloudinary_image;
                            }
        
                            view__shelf.innerHTML+= `
                            <div id="product__card">
                                <div id="card__image">
                                    <figure id="prodimg">
                                        <img src='${displayimage}'/>
                                    </figure>
                                    <figcaption>
                                        <h3> ${item.pdtname} </h3>
                                        <p>Quantity In Stock: </p>
                                        <p> ${item.prodqty} </p>
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
        
                                    <div id="card__buttons" class="${card_index}" name="${item._id}">
                                        <div id="add__buttons" class="icons ${button_index + 1}" title="Upload item">
                                            <p>Upload New Image</p>
                                            <i id="btn__add" class="fas fa-cloud-upload-alt"></i>
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
        
                        $("#card__buttons i").click(function(){
                            // apply pseudo classes to all target elements
                    
                            //---product-card
                            $(this).parent().parent().parent().parent().attr("class","clicked_card") 
                            const selected_item_id =  $(this).parent().parent().attr("name")
                    
                            //---select the image and related details
                            const selected_crudaction = $(this).attr("id")
                            const selected_img = $(".clicked_card img").attr("src")
                            const selected_img_name =  $(".clicked_card figcaption h3" ).html()
                            const selected_img_qty =  $(".clicked_card figcaption > p:first-of-type + p").html()
                            const selected_img_desc =  $(".clicked_card #card__details #proddesc p:first-of-type").html()
                            const selected_img_cat =  $(".clicked_card  #card__details #pdtcat p" ).html()
                            const selected_img_price =  $(".clicked_card  #card__details #pdtprice p" ).html()
                            
                            //store item id to delete in cookie
                            document.cookie = `delItem_id=${selected_img_name}; SameSite=None;  path=/product-delete;Secure`;  
                            //store item to edit in cookie
                            document.cookie = `editedProductId=ObjectId('${selected_item_id}'); SameSite=None;  path=/admin-editproduct;Secure`;  
                            document.cookie = `editedProduct=${selected_img_name}; SameSite=None;  path=/admin-editproduct;Secure`;  
                    
                            // //select relevant dom elements
                    
                            let admin__back = document.querySelector("#admin__workpsace")
                            const add_page = document.createElement("div");
                            add_page.setAttribute("id","overlay");
                            add_page.setAttribute("onClick","toggleOverlay()");
                            const content_page = document.createElement("div");
                            content_page.setAttribute("id","contentpage");
                    
                            admin__back.appendChild(add_page);
                            admin__back.appendChild(content_page);
                    
                            let overlay = document.querySelector("#overlay");
                            let contentpage = document.querySelector("#contentpage");
                            
                            //process selected CRUD operations
                            selecctCRUDActionToRun(contentpage,selected_item_id,overlay, selected_crudaction, selected_img, selected_img_name, selected_img_qty, selected_img_desc, selected_img_cat, selected_img_price);
                            
                            
                            // $("#overlay").click(function(){
                            //     $("#contentpage").hide()
                            //     $(this).hide()
                            // });
                    
                        });
        
                    }else{
                        console.log("No products found in database...");
                    }

                }
            });

            //call view function to display product
            // getAllProducts()
        });
    });
};