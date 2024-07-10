

//hamburger-menu
const hamburger = document.querySelector('.hamburger-menu');
const navMenu = document.querySelector('.menubar');
hamburger.addEventListener('click', () => {
    
    const hide_menubar = navMenu.setAttribute("class","hide-menubar")

    hide_menubar.classList.toggle('hide-menubar');    

});