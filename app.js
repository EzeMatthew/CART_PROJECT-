
let cart = [];
let elements = [];
const cartDiv = document.querySelector(".cart");
const modal = document.querySelector(".modal")

document.addEventListener("DOMContentLoaded", () =>{
    /* I'm creating an array with all the buttons */
    const buttons = document.querySelectorAll(".btn");

    fetch("./data.json")
        .then(respuesta => respuesta.json())
        .then(result => result.forEach(element => elements.push(element)))


    /* I'm adding an even listener in each button */
    buttons.forEach(button => {
        button.addEventListener("click", () => addElement(button))
    })

})

function addElement (button){
    const product = elements[button.id];
    const Existsquantity = elements[button.id].quantity;

    const {name,price} = product;


    if(!Existsquantity){
        elements[button.id].quantity = 1;
        const cartProd = {
            id: button.id,
            name,
            price,
            image: elements[button.id].image.thumbnail,
            quantity: elements[button.id].quantity,
            total: elements[button.id].quantity * price
        }
        cart.push(cartProd);
       
    }
    else{

        elements[button.id].quantity++;
        const newQuantity = elements[button.id].quantity;

        const index = cart.findIndex(element => element.id === button.id)
        cart[index].quantity = newQuantity
        cart[index].total = newQuantity * cart[index].price
    }

    cleanCart();
    updateCart();
    mostrarModal();
    removeElement();

    setInterval(() => {
        if(cart.length === 0){
            window.location.reload();
        }
    }, 300);
}
function mostrarModal (){
    const buttonMostrar = document.querySelector(".cart__confirm-button");
    const buttonOcultar = document.querySelector(".modal__Button") 

    buttonOcultar.addEventListener("click", () => {modal.classList.toggle("inactive"); window.location.reload()})

    buttonMostrar.onclick = () => {
        modal.classList.toggle("inactive");

        const modalContainer = document.querySelector(".modal__prod-container")
        cart.forEach(prod => {
            modalContainer.innerHTML += `
            <div class="modal__prod">
   <div class="modal__prod-img">
       <img src="${prod.image}"/>
   </div>
   <div class="modal__prod-meta">
       <h3 class="modal__prod-name">${prod.name}</h3>
       <div class="modal__prod-status">
           <p class="modal__prod-quantity">${prod.quantity}x</p>
           <p class="modal__prod-price">@${formatearDinero(prod.price)}</p>
       </div>
   </div>
   <p class="modal__prod-total">
       ${formatearDinero(prod.quantity*prod.price)}
   </p>
</div>
            `
        })
    }
}
function removeElement(){
    const remove = document.querySelectorAll(".cart__remove")

   
    if(remove){
        remove.forEach(button => {
            button.onclick = () => {
                const newCart = cart.filter(prod => prod.id !== button.id[1])
    
                cart = [...newCart]
    
                cleanCart();
                updateCart();
                removeElement();
                return
            }
            
        })
    }
   
        
 
}
function cleanCart (){
    while(cartDiv.firstChild){
        cartDiv.removeChild(cartDiv.firstChild)
    }
}
function cartQuantity (){
    let quantity = 0;
    cart.forEach(element => {
        quantity += element.quantity
    })

    return quantity
}
function cartTotal (){
    let total = 0;
    cart.forEach(element => {
        total += element.quantity * element.price
    })

    return total
}
function updateCart(){

    if(cart.length === 0){
        cartDiv.innerHTML = `
            <h2 class="cart__heading">Your cart (0)</h2>
          `
    }
    else{
        
        cartDiv.innerHTML = `
            <h2 class="cart__heading">Your cart (${cartQuantity()})</h2>
          `
          cart.forEach(prod => {
            cartDiv.innerHTML += `
            <div class="cart__prod">
              <div class="cart__info">
                <h3 class="cart__name">${prod.name}</h3>
  
                <div class="cart__meta">
                  <p class="cart__quantity">${prod.quantity}x</p>
                  <p class="cart__price">@${formatearDinero(prod.price)}</p>
                  <p class="cart__total">${formatearDinero(prod.price * prod.quantity)}</p>
                </div>
              </div>
              <a class="cart__remove" id="R${prod.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 10 10"><path class="cart__svg" fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
              </a>
            </div>
            `
          })

          cartDiv.innerHTML += `
            <div class="cart__total-container">
                <p class="cart__total-text">Order Total</p>
                <p class="cart__total-pagar">${formatearDinero(cartTotal())}</p>
            </div>
            <div class="carbon">
                <img src="./assets/images/icon-carbon-neutral.svg" alt="Image carbon neutral" />
                <p class="carbon__text">This is a <span>carbon-neutral</span> delivery</p>
            </div>
            <a class="cart__confirm-button">Confirm Order</a>
          `
    }
}
const formatearDinero = (valor) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    return formatter.format(valor)
}