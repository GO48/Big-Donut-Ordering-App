/* import */
import { menuArray } from "./data.js";

/* local variables and local storage */
let myOrder = {
    myCart: [],
    myDiscount: 0
}
const myOrderFromLocalStorage = JSON.parse( localStorage.getItem("myOrder") )
if (myOrderFromLocalStorage) {
    myOrder = myOrderFromLocalStorage
}

/* on load */
window.addEventListener("load", function(){
    renderMenuByCategories("donuts")
    renderCartButton()
})


/* DOM */
const modal = document.getElementById("modal")
const modalContent = document.getElementById("modal-content")
/* event listeners (event bubbling) */
document.addEventListener("click", function(e){
    // console.log(e.target)
    if (e.target.dataset.categories){
        clearActive(".categories-item")
        e.target.classList.add("active")
        renderMenuByCategories(e.target.dataset.categories)
    }
    else if(e.target.dataset.add){
        handleAddItem(e.target.dataset.add)
    }
    else if(e.target.dataset.remove){
        handleRemoveItem(e.target.dataset.remove)
    }
    else if(e.target.id === "empty-btn-menu"){
        myOrder.myCart = []
        localStorage.setItem("myOrder", JSON.stringify(myOrder) )
        renderCartButton()
    }
    else if(e.target.id === "cart-btn"){
        modal.style.display = "block"
        renderCart()
    }
    else if(e.target.id === "footer-client"){
        modal.style.display = "block"
        renderClient()
    }
    else if(e.target.id === "footer-orders"){
        modal.style.display = "block"
        renderOrdersHistory()
    }
    else if(e.target.id === "footer-discount"){
        modal.style.display = "block"
        renderDiscount()
    }
    else if(e.target.id === "footer-hours"){
        modal.style.display = "block"
        renderHours()
    }
    else if(e.target.id === "close-modal-btn" || e.target.id === "back-btn"){
        modal.style.display = "none"
        modalContent.innerHTML = ""
    }
}, false)

/* event handlers */
function handleAddItem(itemId){
    const cartItem = myOrder.myCart.find(item => item.id === Number(itemId))
    if (cartItem) {
        cartItem.quantity++
    }
    else {
        const menuItem = menuArray.find(item => item.id === Number(itemId))
        myOrder.myCart.push({...menuItem, quantity: 1})
    }
    localStorage.setItem("myOrder", JSON.stringify(myOrder) )
    renderCartButton()
    if (modal.style.display === "block"){
        renderCart()
    }
}

function handleRemoveItem(itemId){
    const cartItem = myOrder.myCart.find(item => item.id === Number(itemId))
    if (cartItem.quantity === 1) {
        myOrder.myCart.splice(myOrder.myCart.indexOf(cartItem), 1)
    }
    else {
        cartItem.quantity--
    }
    localStorage.setItem("myOrder", JSON.stringify(myOrder) )
    renderCartButton()
    renderCart()
}

/* Render functions */
function renderMenuByCategories(categories){
    const menuHtml = "<ul>" + menuArray.filter((item) => item.categories.includes(categories)).map((item) => {
        const { 
            name, ingredients, price, image, image_alt, id, categories
        } = item
        return `
        <li class="item">
            <img src="${image}" alt="${image_alt}">
            <div class="item-info">
                <h4>${name}</h4>
                <p>${ingredients.join(", ")}</p>
                <p>$ ${price}</p>
            </div>
            <button aria-label="Add ${name} to cart" title="Add to cart"  data-add="${id}">
                <i class="fa-solid fa-plus"></i>
            </button>
        </li>`
    }).join('') + "</ul>"
    document.getElementById('menu').innerHTML = menuHtml
}

function renderClient(){
    modalContent.innerHTML = `
    <h3>Client</h3>
    <p>You can now order your donuts!</p>
    <div class="button-container">
        <button class="back-btn" id="back-btn" aria-label="Back to menu" title="Back to menu">Back to menu</button>
    </div>
    `
}

function renderOrdersHistory(){
    modalContent.innerHTML = `
    <h3>Orders History</h3>
    <p>You have no orders yet.</p>
    <div class="button-container">
        <button class="back-btn" id="back-btn" aria-label="Back to menu" title="Back to menu">Back to menu</button>
    </div>
    `
}

function renderDiscount(){
    modalContent.innerHTML = `
    <h3>Discount Codes</h3>
    <div class="discount-container">
        <p>10OFF</p>
        <p>15OFF</p>
        <p>20OFF</p>
    </div>
    <div class="button-container">
        <button class="back-btn" id="back-btn" aria-label="Back to menu" title="Back to menu">Back to menu</button>
    </div>
    `
}

function renderHours(){
    modalContent.innerHTML = `
    <h3>Hours</h3>
    <p>We are open 7 days a week, 24 hours a day.</p>
    <p>We are open 7 days a week, 24 hours a day.</p>
    <p>We are open 7 days a week, 24 hours a day.</p>
    <div class="button-container">
        <button class="back-btn" id="back-btn" aria-label="Back to menu" title="Back to menu">Back to menu</button>
    </div>
    `
}

function renderCartButton(){
    document.getElementById("count").innerHTML = getCount()
    document.getElementById("subtotal").innerHTML = "$ "+ getSubtotal()
}

function renderCart(){
    const cartHtml = `
    <h3>Your Cart</h3>
    <section class="cart"> 
        <ul>
    ` 
    + myOrder.myCart.map((item) => {
        const { 
            name, ingredients, price, image, image_alt, id, categories, quantity
        } = item
        return `
            <li class="item">
                <img src="${image}" alt="${image_alt}">
                <div class="item-info">
                    <h4>${name}</h4>
                    <p>${ingredients.join(", ")}</p>
                    <p>$ ${price}</p>
                </div>
                <button aria-label="Remove ${name} from cart" title="Remove from cart"  data-remove="${id}">
                    <i class="fa-solid fa-minus"></i>
                </button>
                <span>${quantity}</span>
                <button aria-label="Add ${name} to cart" title="Add to cart"  data-add="${id}">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </li>`
    }).join('') + `
        </ul>
    </section>
    <div class="button-container">
        <button class="empty-btn" id="empty-btn-cart" aria-label="Empty cart" title="Empty cart">
            <i class="fa-solid fa-trash"></i>
        </button>
        <button class="checkout-btn" id="checkout-btn" aria-label="Go to checkout" title="Go to checkout">
            <i class="fa-solid fa-bag-shopping">
                <sup class="count">${getCount()}</sup>
            </i>
            <span>Checkout</span>
            <span>$ ${getSubtotal()}</span>
        </button>
    </div>
    <p class="warning-msg" id="warning-msg"></p>
    `
    modalContent.innerHTML = cartHtml
    document.getElementById("empty-btn-cart").addEventListener("click", function(){
        myOrder.myCart = []
        localStorage.setItem("myOrder", JSON.stringify(myOrder) )
        renderCartButton()
        renderCart()
    }, false)
    document.getElementById("checkout-btn").addEventListener("click", function(){
        const warningMsg = document.getElementById("warning-msg")
        if (myOrder.myCart.length === 0){
            warningMsg.style.opacity = "1"
            warningMsg.innerHTML = "Warning! Your cart is empty."
            return
        }
        if (!Number(getSubtotal())){
            warningMsg.style.opacity = "1"
            warningMsg.innerHTML = "Warning! Not for sale items in your cart."
            return
        }
        renderCheckout()
    }, false)
}

function renderCheckout(){
    let subtotal = getSubtotal()
    const checkoutHtml = `
    <h3>Checkout</h3>
    <form id="checkout-form">
        <h5>Card Details</h5>
        <div class="form-group">
            <label for="name">Name on Card</label>
            <input type="text" id="name" name="name" autocomplete="cc-name" placeholder="First and Last Name on Card" size="30" required>
        </div>
        <div class="form-group">
            <label for="card-number">Card Number</label>
            <input type="text" inputmode="numeric" id="card-number" name="card-number" autocomplete="cc-number" placeholder="16 Digits Card Number" pattern="[0-9]{16}" size="30" required>
        </div>
        <div class="form-group">
            <label for="exp-date">Expiry Date</label>
            <input type="text" inputmode="numeric" id="exp-date" name="exp-date" autocomplete="cc-exp" placeholder="MM/YY" pattern="^(0[1-9]|1[0-2])\/?([0-9]{2})$" size="8" required>
            <label for="cvv">Security Code</label>
            <input type="text" inputmode="numeric" id="cvv" name="cvv" autocomplete="cc-csc" placeholder="CVV 3-4 digits" pattern="[0-9]{3,4}" size="12" required>
        </div>
        <h5>Discount Code</h5>
        <div class="form-group">
            <label for="discount-code">Discount Code</label>
            <input type="text" id="discount-code" name="discount-code" placeholder="Enter discount code" aria-label="Enter discount code" title="Enter discount code">
            <span class="discount-msg" id="discount-msg">No discount applied</span>
        </div>
        <h5>Order summary</h5>
        <div class="form-group">
            <p id="total-msg">Total: $ ${subtotal}</p>
        </div>
        <div class="button-container">
            <button type="reset" class="reset-btn" aria-label="Reset form" title="Reset form">
                <i class="fa-solid fa-rotate-right"></i>
            </button>
            <button type="submit" class="pay-btn" aria-label="Pay for order" title="Pay for order">
                <i class="fa-regular fa-credit-card"></i>
                <span>Pay</span>
                <span id="total">$ ${subtotal}</span>
            </button>
        </div>
    </form>
    `
    modalContent.innerHTML = checkoutHtml
    const discountCode = document.getElementById("discount-code")
    const checkoutForm = document.getElementById("checkout-form")
    let currentDiscount = 0
    function applyDiscount(){
        const code = discountCode.value
        const discountMsg = document.getElementById("discount-msg")
        const totalMsg = document.getElementById("total-msg")
        const totalEl = document.getElementById("total")
        switch(code){
            case "10OFF":
                currentDiscount = 0.1
                break
            case "15OFF":
                currentDiscount = 0.15
                break
            case "20OFF":
                currentDiscount = 0.2
                break
            default:
                currentDiscount = 0
                discountMsg.innerHTML = "No discount applied"
                totalMsg.innerHTML = `Total: $ ${subtotal}`
                totalEl.innerHTML = `$ ${subtotal}`
                return
        }
        let discountAmount = (subtotal * currentDiscount).toFixed(2)
        let total = (subtotal - discountAmount).toFixed(2)
        discountMsg.innerHTML = `${currentDiscount * 100}% discount applied`
        totalMsg.innerHTML = `Total: $ ${subtotal} - $ ${discountAmount} =  $ ${total}`
        totalEl.innerHTML = `$ ${total}`
    }
    discountCode.addEventListener("input", applyDiscount)
    checkoutForm.addEventListener("reset", function(e){
        setTimeout(applyDiscount, 0) //defer to make sure currentDiscount is reset
    })
    checkoutForm.addEventListener("submit", function(e){
        e.preventDefault()
        myOrder.myDiscount = currentDiscount
        localStorage.setItem("myOrder", JSON.stringify(myOrder) )
        renderOrderConfirmation()
        //Todo: save myOrder to the orders history, plus default Rating as 0
        //reset myOrder to default
        myOrder = {
            myCart: [],
            myDiscount: 0
        }
        localStorage.setItem("myOrder", JSON.stringify(myOrder) )
        renderCartButton()
    })
}

function renderOrderConfirmation(){
    let subtotal = getSubtotal()
    let discountAmount = (subtotal * myOrder.myDiscount).toFixed(2)
    let total = (subtotal - discountAmount).toFixed(2)
    const orderHtml = `
    <h3>Your Order</h3>
    <p id="order-msg">Thank you for your visiting. Your order is on its way!</p>
    <h5>Order summary</h5>
    <section class="order">
        <ul>
    ` 
    + myOrder.myCart.map((item) => {
        const { 
            name, ingredients, price, image, image_alt, id, categories, quantity
        } = item
        return `
            <li class="item">
                <span>${quantity} @ ${name}</span>
                <span>$ ${(price * quantity).toFixed(2)}</span>
            </li>`
    }).join('') + `
        </ul>
    </section>
    <p>Discount: ${myOrder.myDiscount? `${myOrder.myDiscount * 100}% discount applied` : "No discount applied"}</p>
    <p>Total: ${myOrder.myDiscount? `$ ${subtotal} - $ ${discountAmount} =  $ ${total}` : `$ ${subtotal}`}</p>
    <section class="rating">
        <h3>Rate your experience</h3>
        <p class="rating-msg" id="rating-msg">Tell us what you think</p>
        <ul>
            <li class="rating-item" data-rating="1">
                <i class="fa-regular fa-face-tired"></i>
            </li>
            <li class="rating-item" data-rating="2">
                <i class="fa-regular fa-face-frown"></i>
            </li>
            <li class="rating-item" data-rating="3">
                <i class="fa-regular fa-face-meh"></i>
            </li>
            <li class="rating-item" data-rating="4">
                <i class="fa-regular fa-face-grin"></i>
            </li>
            <li class="rating-item" data-rating="5">
                <i class="fa-regular fa-face-grin-stars"></i>
            </li>
        </ul>
        <div class="button-container" id="rating-btn-container"></div>
    </section> 
    `
    modalContent.innerHTML = orderHtml

    const ratingMsg = document.getElementById("rating-msg")
    const ratingItems = document.querySelectorAll(".rating-item")
    const ratingBtnContainer = document.getElementById("rating-btn-container")
    let currentRating = 0
    function handleMouseOver(e){
        ratingMsg.innerHTML = getRatingMsg(Number(e.target.dataset.rating))
    }
    function handleMouseOut(e){
        ratingMsg.innerHTML = getRatingMsg(currentRating)
    }
    function handleClickRating(e){
        clearActive(".rating-item")
        e.target.classList.add("active")
        currentRating = Number(e.target.dataset.rating)
        ratingMsg.innerHTML = getRatingMsg(currentRating)
        ratingBtnContainer.innerHTML = `<button class="rating-btn" id="rating-btn" aria-label="Submit rating" title="Submit rating">Submit rating</button>`
        document.getElementById("rating-btn").addEventListener("click", function(){
            //change user view and interaction
            ratingItems.forEach((item) => {
                item.removeEventListener("mouseover", handleMouseOver)
                item.removeEventListener("mouseout", handleMouseOut)
                item.removeEventListener("click", handleClickRating)
                item.classList.add("frozen")
            })
            ratingBtnContainer.innerHTML = `<button class="back-btn" id="back-btn" aria-label="Back to menu" title="Back to menu">Back to menu</button>`
            // Todo: save currentRating to the last entry in orders history
        })
    }
    ratingItems.forEach((item) => {
        item.addEventListener("mouseover", handleMouseOver)
        item.addEventListener("mouseout", handleMouseOut)
        item.addEventListener("click", handleClickRating)
    })
}

/* helper functions */
function clearActive(selectors){
    const selectedElements = document.querySelectorAll(selectors)
    selectedElements.forEach((element) => {
        element.classList.remove("active")
    })
}

function getSubtotal(){
    return myOrder.myCart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
}

function getCount(){
    return myOrder.myCart.reduce((total, item) => total + item.quantity, 0)
}

function getRatingMsg(rating){
    switch(rating){
        case 1:
            return "Terrible"
        case 2:
            return "Bad"
        case 3:
            return "Okay"
        case 4:
            return "Good"
        case 5:
            return "Great"
        default:
            return "Tell us what you think"
    }
}
