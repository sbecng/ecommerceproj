// Shopfloor..........................................//
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
                data.map(function(item,i){
                    var button_index = 0
                    view__shelf.innerHTML+= `
                        <div id="${item._id}" class="product__card">
                            <div id="card__image">
                                <figure id="prodimg">
                                    <img src="/products/${item.img_name}"/>
                                </figure>
                                <figcaption>
                                    <h3> ${item.pdtname} </h3>
                                    <p>
                                        <span> Quantity In Stock: </span> 
                                        <span id='shop_qty'>${item.prodqty} </span>
                                    </p>
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
                                    <p>${Number(item.pdtprice).toFixed(2)}</p>
                                </div> 

                                <div id="card__buttons" class="${card_index}">
                                    <div id="add__buttons" class="icons ${button_index + 1}" title="Add to Cart">
                                        <p>Add to Cart</p>
                                        <i id="btn__add" class="fas fa-cart-plus add-to-cart"></i>
                                    </div> 
                                    <div id="edit__buttons" class="icons ${button_index + 2}" title="Buy item">
                                        <p>Buy Item</p>
                                        <i id="btn__edit" class="fas fa-money-check-alt"></i>
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

                // ...........add selected product to cart...........................

                $('.add-to-cart').click(function(){
                    //--- get selected clicked-card id
                    const selected_item_id = $(this).parent().parent().parent().parent().attr("id") 
                    console.log('clicked_card ',selected_item_id);
                    //---retrieve the image and related details of clicked product
                    const selected_img = $('#product__shelf > #' +selected_item_id+ ' img' ).attr('src');
                    const selected_img_name =  $('#product__shelf > #' +selected_item_id+ ' figcaption h3' ).html()
                    const selected_img_qty =  $('#product__shelf > #' +selected_item_id+ ' figcaption > p:first-of-type + p').html()
                    const selected_img_desc =  $('#product__shelf > #' +selected_item_id+ ' #card__details #proddesc p:first-of-type').html()
                    const selected_img_cat =  $('#product__shelf > #' +selected_item_id+ '  #card__details #pdtcat p' ).html()
                    const selected_img_price =  $('#product__shelf > #' +selected_item_id+ '  #card__details #pdtprice p' ).html()
                    
                    // get elevant carts elements
                    const big_cart = document.querySelector('.big-cart');
                    const sml_cart_carthole = document.querySelector('.cartholr'); //navbar cart icon
                    let sml_cart_itemsCount = $('.cartholr').html() //counter for navbar cart icon
                    //get trays_container
                    let trays_container = document.querySelector('.trays');
                    //create product tray for the clicked item
                    const product_tray = document.createElement('div');
                    $(product_tray).attr({'id':`tray_${selected_item_id}`,'class':'product_tray'});
                    let product_tray_id = $(product_tray).attr('id')

                    //select all items in cart trays_container
                    let trays = document.querySelectorAll('.trays > div') //same as trays_container

                    //duplicates tracker initial
                    let dupl_tracker = 0

                    trays.forEach(tray => {

                        let curtray = $(tray);
                        let curtray_id = $(tray).attr('id');
                        let curtray_lenth = $(tray).length;
                        let trays_container_lenth = $(trays).length;
                        let curtray_qty = $('#'+curtray_id + ' .tray_qty .qty').html();
                        let curtray_name = $('#'+curtray_id + ' .tray_name').html();
                        let curtray_price = $('#'+curtray_id + ' .totprice_in_tray').html();

                        // clone tray id for compare
                        curtray_id_clone = curtray_id.split('_')[1]
                        if(selected_item_id.trim()===curtray_id_clone.trim()){
                            //recompute curtray item detais
                            curtray_qty = Number(curtray_qty) + 1
                            curtray_totPrice = Number(selected_img_price) * Number(curtray_qty)
                            sml_cart_itemsCount = Number(sml_cart_itemsCount) + 1

                            // update tray qty
                            $('#'+curtray_id+' .tray_qty .qty').text(Number(curtray_qty))
                            // update tray totprice
                            $('#'+curtray_id+' .totprice_in_tray').text(Number(curtray_totPrice))
                            // update smal_cart items count
                            $('.cartholr').text(Number(sml_cart_itemsCount))

                            //track duplicates
                            dupl_tracker = dupl_tracker + 1 

                            //..............manage localstorage cart..........
                            //check for existing cart, return it or empty array []
                            let cartinstorage = localStorage.getItem('cartinstorage')? JSON.parse(localStorage.getItem('cartinstorage')) : [];
                            //initialize tray id
                            curtray_id = curtray_id_clone
                            //get index of item tray in cartinstorage
                            const getIndex = (curtray_id) => cartinstorage.indexOf(cartinstorage.find(s_tray => s_tray.tray_id === curtray_id));
                    
                            //send cart tray to local storage
                            const addCart_tolocalStorage = (curtray_id) => {
                                //initialize tray id
                                curtray_id = curtray_id_clone   
                                //check if tray already in storage
                                console.log('update.length',cartinstorage.length);

                                if(cartinstorage.length > 0){
                                    //update cartinstore item details if curtray id exist in storage
                                    getIndex(curtray_id) > -1 ? cartinstorage[getIndex(curtray_id)].tray_totprice === curtray_totPrice : cartinstorage.splice(
                                        getIndex(curtray_id),
                                        1,
                                        {
                                            tray_id:curtray_id,
                                            tray_img:selected_img,
                                            tray_name:selected_img_name,
                                            tray_totprice:curtray_totPrice,
                                            tray_qty:curtray_qty
                                        }
                                    );
                                    getIndex(curtray_id) ? cartinstorage[getIndex(curtray_id)].tray_qty === curtray_qty : cartinstorage.splice(
                                        getIndex(curtray_id),
                                        1,
                                        {
                                            tray_id:curtray_id,
                                            tray_img:selected_img,
                                            tray_name:selected_img_name,
                                            tray_totprice:curtray_totPrice,
                                            tray_qty:curtray_qty
                                        }
                                    );
                                    localStorage.setItem('cartinstorage', JSON.stringify(cartinstorage));
                                }
                            }
                            addCart_tolocalStorage(); 
                        };

                    });
                    //insert new items in cart trays
                    if($(trays).length === 0 || dupl_tracker === 0 ){
                        product_tray.innerHTML += `
                        <div class='tray_img tray_items'>
                            <img src='${selected_img}'> 
                        </div>
                        <div class='tray_name tray_items'>${selected_img_name} </div>
                        <div class='totprice_in_tray tray_items'>${selected_img_price} </div>
                        <div class='tray_qty tray_items'>
                            <span class='minus'> < </span>
                            <span class='qty'> 1 </span>
                            <span class='plus'> > </span>
                        </div>
                        <div class='tray_delete tray_items'>
                            <span class='tray_delbtn' onclick='removetray_fromBigcart(${product_tray_id})'> &times </span>
                        </div>
                        `
                        // put product tray into cart
                        trays_container.appendChild(product_tray)
                        big_cart.appendChild(trays_container);

                        // update small cart items qty
                        $('.cartholr').text(Number(sml_cart_itemsCount) + 1) 
                        
                        //.........store new cart in localstorage.........
                        //check for existing cart, return it or empty array []
                        let cartinstorage = localStorage.getItem('cartinstorage')? JSON.parse(localStorage.getItem('cartinstorage')) : [];
   
                        //send cart tray to local storage
                        const addCart_tolocalStorage = (curtray_id) => {
                            //initialize tray id
                            curtray_id = selected_item_id
                            //check if tray already in storage
                            console.log('new item to store',curtray_id);

                            cartinstorage.push(
                                {
                                    tray_id:curtray_id,
                                    tray_img:selected_img,
                                    tray_name:selected_img_name,
                                    tray_totprice:selected_img_price,
                                    tray_qty:1
                                }
                            );
                            localStorage.setItem('cartinstorage', JSON.stringify(cartinstorage));
                            
                        }
                        addCart_tolocalStorage(); 

                    }   

                });
            // })
            
        }else{
            console.log("No products found in database...");
        }
    } 
  });

    
// })


// toggle big and small left sidebar
const big_left_sidebar = document.querySelector('.big-sidebasr');
const sml_left_sidebar = document.querySelector('.sml-sidebasr');
const close_left_sidebar = document.querySelector('.close_left_sidebar');
const open_left_sidebar = document.querySelector('.open_left_sidebar');

close_left_sidebar.addEventListener('click',function(){
    $(big_left_sidebar).hide();
    $(sml_left_sidebar).show();

})

open_left_sidebar.addEventListener('click',function(){
    $(sml_left_sidebar).hide();
    $(big_left_sidebar).show();
})

// Populate product categories from server to sidebar

$('#client_container').ready(function(){
    
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

// .......shopping cart control and management.............
const big_cart = document.querySelector('.big-cart');
const sml_cart = document.querySelector('.fa-cart-arrow-down');
const close_big_cart = document.querySelector('.close_big_cart');
const resize_shelf = document.querySelector('#client_container')
// open cart
sml_cart.addEventListener('click',function(){
    if($(big_cart).hide()){
        $(big_cart).show()
        // resize product shelf
        $(resize_shelf).width('100%')
    }
});
// close cart
close_big_cart.addEventListener('click',function(){
    $(big_cart).hide()
    // resize product shelf
    $(resize_shelf).width('100%')
});
//cartcounter vissibility
// $('.cartholr').text().trim() == "" ?  

//load cart from localstorage
loadCart_fromLocalStorage();
function loadCart_fromLocalStorage(){
    //check for existing cart, return it or empty array []
    let cartinstorage = localStorage.getItem('cartinstorage')? JSON.parse(localStorage.getItem('cartinstorage')) : [];
    
    if(cartinstorage.length > 0){
        // get elevant carts elements
        const big_cart = document.querySelector('.big-cart');
        const sml_cart_carthole = document.querySelector('.cartholr'); //navbar cart icon
        let sml_cart_itemsCount = $('.cartholr').html() //counter for navbar cart icon
        //get trays_container
        let trays_container = document.querySelector('.trays');
        //create product tray for the clicked item
        const product_tray = document.createElement('div');
        //iterate localstorage cart to add its items to shopping cart
        let totqtyinstorage = 0
        cartinstorage.forEach(c_tray => {
            //identify product_tray by cartinstorage tray id
            const product_tray = document.createElement('div');
            $(product_tray).attr({'id':`tray_${c_tray.tray_id}`,'class':'product_tray'});
            let product_toDel = c_tray.tray_id
            product_tray.innerHTML += `
            <div class='tray_img tray_items'>
                <img src='${c_tray.tray_img}'> 
            </div>
            <div class='tray_name tray_items'>${c_tray.tray_name} </div>
            <div class='totprice_in_tray tray_items'>${c_tray.tray_totprice} </div>
            <div class='tray_qty tray_items'>
                <span class='minus'> < </span>
                <span class='qty'> ${c_tray.tray_qty} </span>
                <span class='plus'> > </span>
            </div>
            <div class='tray_delete tray_items'>
                <span class='tray_delbtn' onclick='removetray_fromBigcart(${product_toDel})'> &times </span>
            </div>
            `
            // put product tray into cart
            trays_container.appendChild(product_tray)
            big_cart.appendChild(trays_container);
            totqtyinstorage = totqtyinstorage + c_tray.tray_qty
            // update small cart items qty
            $('.cartholr').text(`${totqtyinstorage}`) 

            console.log(product_tray);
            console.log(trays_container);
            console.log(big_cart);
        })
    };

}
//remove item from cart
function removetray_fromBigcart(product_toDel){
    console.log('Clicked X buuton');
    //check for existing cart, return it or empty array []
    let cartinstorage = localStorage.getItem('cartinstorage')? JSON.parse(localStorage.getItem('cartinstorage')) : [];

    if(cartinstorage.length > 0){
        // get elevant carts elements
        const big_cart = document.querySelector('.big-cart');
        const sml_cart_carthole = document.querySelector('.cartholr'); //navbar cart icon
        let sml_cart_itemsCount = $('.cartholr').html() //counter for navbar cart icon
        //get trays_container
        let trays_container = document.querySelector('.trays');
        //create product tray for the clicked item
        const product_tray = document.createElement('div');
        //iterate localstorage cart to add its items to shopping cart
        let totqtyinstorage = 0
        cartinstorage.forEach(c_tray => {
            //identify product_tray by cartinstorage tray id
            const product_trayToremove = c_tray.tray_id
            if(product_toDel === product_trayToremove){
                cartinstorage.splice(getIndex(product_trayToremove), 1);
            }

            localStorage.setItem('cartinstorage', JSON.stringify(cartinstorage));

            product_tray.innerHTML += `
            <div class='tray_img tray_items'>
                <img src='${c_tray.tray_img}'> 
            </div>
            <div class='tray_name tray_items'>${c_tray.tray_name} </div>
            <div class='totprice_in_tray tray_items'>${c_tray.tray_totprice} </div>
            <div class='tray_qty tray_items'>
                <span class='minus'> < </span>
                <span class='qty'> ${c_tray.tray_qty} </span>
                <span class='plus'> > </span>
            </div>
            <div class='tray_delete tray_items'>
                <span class='tray_delbtn' onclick='removetray_fromBigcart(${product_trayToremove})'> &times </span>
            </div>
            `
            // put product tray into cart
            trays_container.appendChild(product_tray)
            big_cart.appendChild(trays_container);
            totqtyinstorage = totqtyinstorage + c_tray.tray_qty
            // update small cart items qty
            $('.cartholr').text(`${totqtyinstorage}`) 

        })
    }
}

//..............User view product by categories''''''''''''''''''''
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

                        let admin__space = document.getElementById("users__shopfloor")
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
                            <div id="${item._id}" class="product__card">
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
                                        <div id="add__buttons" class="icons ${button_index + 1}" title="Add to Cart">
                                            <p>Add to Cart</p>
                                            <i id="btn__add" class="fas fa-cart-plus add-to-cart"></i>
                                        </div> 
                                        <div id="edit__buttons" class="icons ${button_index + 2}" title="Buy item">
                                            <p>Buy Item</p>
                                            <i id="btn__edit" class="fas fa-money-check-alt"></i>
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