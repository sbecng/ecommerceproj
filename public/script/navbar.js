
class NavPlaceholder extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
            <div class="logo">
                <img src="/assets/SBO Logo.png" alt="company Logo" width="50">
            </div>

            <div class="menubar">
                <ul class="menuitems">
                    <li><a href="">Home</a></li>
                    <li><a href="">About</a></li>
                    <li><a href="">Products</a></li>
                    <li><a href="">Contact Us</a></li>
                </ul>
            </div>
            <div class="searchbar hide-search">
                <input type="text" name="" id="">
                <i class="fas fa-search"></i>
            </div>
            <div class="storebar">
                <div class="alert">
                    <i class="fas fa-bell"></i>
                </div>
                <div class="cart">
                    <i class="fas fa-cart-arrow-down"></i>
                </div>
            </div>
            <a href="/register">
                <div class="userprofile">
                    <div><i class="fas fa-user-tie"></i></div>
                    <p>Register</p>
                </div>
            </a>
            <div class="hamburger-menu">
                <span class="line"></span>
                <span class="line"></span>
                <span class="line"></span>
            </div>
        `
    }
}

customElements.define('nav-placeholder', NavPlaceholder)