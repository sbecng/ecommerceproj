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
                                    <p>${item.pdtprice}</p>
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

                    //--- get selected product-card
                    $(this).parent().parent().parent().parent().attr("class","clicked_card") 
                    //--- get selected product-card id
                    const selected_item_id = $(this).parent().parent().parent().parent().attr("id") 

                    console.log('clicked_card ',selected_item_id);
                    
                    // crete new tray for the cart
                    const big_cart = document.querySelector('.big-cart');
                    const sml_cart_carthole = document.querySelector('.cartholr');

                    let trays_container = document.querySelector('.trays');

                    const product_tray = document.createElement('div');
                    $(product_tray).attr({'id':`tray_${selected_item_id}`,'class':'product_tray'});

                    let product_tray_id = $(product_tray).attr('id')

                    console.log($(product_tray));

                    //---select the image and related details
                    const selected_img = $(".clicked_card img").attr("src")
                    const selected_img_name =  $(".clicked_card figcaption h3" ).html()
                    const selected_img_qty =  $(".clicked_card figcaption > p:first-of-type + p").html()
                    const selected_img_desc =  $(".clicked_card #card__details #proddesc p:first-of-type").html()
                    const selected_img_cat =  $(".clicked_card  #card__details #pdtcat p" ).html()
                    const selected_img_price =  $(".clicked_card  #card__details #pdtprice p" ).html()

                    // identify selected item into tray
                    let sml_cart_itemsCount = $('.cartholr').html()

                    //select all items in cart trays
                    let trays = document.querySelectorAll('.product_tray')
                    
                    if($(trays).length <= 0){

                        console.log('when lenth is NOT 0', $(trays).length);

                        //Insert new product_tray into trays_container in the big_cart
                        console.log('first run ',$(trays).length );

                        product_tray.innerHTML = `
                        <div class='tray_img tray_items'>
                            <img src='${selected_img}'> 
                        </div>
                        <div class='tray_name tray_items'>${selected_img_name} </div>
                        <div class='totprice_in_tray tray_items'>${selected_img_price} </div>
                        <div class='tray_qty tray_items'>
                            <span class='minus'> < </span>
                            <span class='qty'> 1 </span>
                            <span class='plus'> > </span>
                        </div>`
                        // put product tray into cart
                        trays_container.append(product_tray)
                        big_cart.appendChild(trays_container);

                        // update small cart items qty
                        $('.cartholr').text(Number(sml_cart_itemsCount) + 1) 

                        // trays.forEach(ith_tray => {

                        //     let ith_tray_id = $(ith_tray).attr('id') 
                        //     let ith_tray_qty = $('#'+ith_tray_id+' span.qty').html() 
                        //     let ith_tray_totPrice = $('#'+ith_tray_id+'> .totprice_in_tray').html()

                        //     //clone tray id for compare
                        //     ith_tray_id_clone = ith_tray_id.split('_')[1]

                        //     if(selected_item_id.trim()===ith_tray_id_clone.trim()){

                        //         ith_tray_qty = Number(ith_tray_qty) + 1
                        //         ith_tray_totPrice = Number(selected_img_price) * Number(ith_tray_qty)
                        //         sml_cart_itemsCount = Number(sml_cart_itemsCount) + 1

                        //         // update tray qty

                        //         console.log('update run');

                        //         $('#'+ith_tray_id+' .tray_qty .qty').text(Number(ith_tray_qty))

                        //         // update tray totprice
                        //         $('#'+ith_tray_id+' .totprice_in_tray').text(Number(ith_tray_totPrice))

                        //         // update smal_cart items count
                        //         $('#'+ith_tray_id+' .totprice_in_tray').text(Number(ith_tray_totPrice))

                        //         $('.cartholr').text(Number(sml_cart_itemsCount))

                        //         // document.querySelector('.clicked_card').classList.remove('clicked_card')                                
                        //     };

                        // })
                    }

                    // if($(trays).length >= 0){

                        // console.log('when lenth is NOT 0', $(trays).length);

                        // //Insert new product_tray into trays_container in the big_cart
                        // console.log('first run ',$(trays).length );

                        // product_tray.innerHTML = `
                        // <div class='tray_img tray_items'>
                        //     <img src='${selected_img}'> 
                        // </div>
                        // <div class='tray_name tray_items'>${selected_img_name} </div>
                        // <div class='totprice_in_tray tray_items'>${selected_img_price} </div>
                        // <div class='tray_qty tray_items'>
                        //     <span class='minus'> < </span>
                        //     <span class='qty'> 1 </span>
                        //     <span class='plus'> > </span>
                        // </div>`
                        // // put product tray into cart
                        // trays_container.append(product_tray)
                        // big_cart.appendChild(trays_container);

                        // update small cart items qty
                        // $('.cartholr').text(Number(sml_cart_itemsCount) + 1) 

                        trays.forEach(ith_tray => {

                            let ith_tray_id = $(ith_tray).attr('id') 
                            let ith_tray_qty = $('#'+ith_tray_id+' span.qty').html() 
                            let ith_tray_totPrice = $('#'+ith_tray_id+'> .totprice_in_tray').html()

                            //clone tray id for compare
                            ith_tray_id_clone = ith_tray_id.split('_')[1]

                            if(selected_item_id.trim()===ith_tray_id_clone.trim()){

                                ith_tray_qty = Number(ith_tray_qty) + 1
                                ith_tray_totPrice = Number(selected_img_price) * Number(ith_tray_qty)
                                sml_cart_itemsCount = Number(sml_cart_itemsCount) + 1

                                // update tray qty

                                console.log('update run');

                                $('#'+ith_tray_id+' .tray_qty .qty').text(Number(ith_tray_qty))

                                // update tray totprice
                                $('#'+ith_tray_id+' .totprice_in_tray').text(Number(ith_tray_totPrice))

                                // update smal_cart items count
                                $('#'+ith_tray_id+' .totprice_in_tray').text(Number(ith_tray_totPrice))

                                $('.cartholr').text(Number(sml_cart_itemsCount))

                                // document.querySelector('.clicked_card').classList.remove('clicked_card')                                
                            };
                            

                            product_tray.innerHTML = `
                            <div class='tray_img tray_items'>
                                <img src='${selected_img}'> 
                            </div>
                            <div class='tray_name tray_items'>${selected_img_name} </div>
                            <div class='totprice_in_tray tray_items'>${selected_img_price} </div>
                            <div class='tray_qty tray_items'>
                                <span class='minus'> < </span>
                                <span class='qty'> 1 </span>
                                <span class='plus'> > </span>
                            </div>`
                            // put product tray into cart
                            trays_container.append(product_tray)
                            big_cart.appendChild(trays_container);
    
                            // update small cart items qty
                            $('.cartholr').text(Number(sml_cart_itemsCount) + 1) 
                        })
                    // }
                    
                    // // remove psuedo class
                    document.querySelector('.clicked_card').classList.remove('clicked_card')

                    console.log(trays_container);

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


